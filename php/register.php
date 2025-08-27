<?php
include 'conn.php';
require "../vendor/autoload.php";

use CircularProtocol\Api\CircularProtocolAPI;

// Parsing robusto del PATH_INFO
function getPathInfo(): string {
    $pi = $_SERVER['PATH_INFO'] ?? '';
    if ($pi !== '' && $pi !== '/') return $pi;
    
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';
    $script = $_SERVER['SCRIPT_NAME'] ?? '';
    if ($script !== '' && strpos($uri, $script) === 0) {
        $rest = substr($uri, strlen($script));
    } else {
        $base = rtrim(dirname($script), '/');
        $rest = ($base && strpos($uri, $base) === 0) ? substr($uri, strlen($base)) : $uri;
    }
    $rest = '/'.ltrim($rest, '/');
    return $rest === '/' ? '' : $rest;
}

$pathInfo = getPathInfo();
$segments = array_values(array_filter(explode('/', trim($pathInfo, '/'))));
$table = isset($segments[0]) ? preg_replace('/[^a-z0-9_]+/i','', $segments[0]) : '';

if ($table === '') {
    http_response_code(400);
    exit('Missing table in path');
}

// JSON decode con controllo errori
$raw = file_get_contents('php://input') ?: '';
$input = json_decode($raw, true);
if (!is_array($input)) {
    http_response_code(400);
    exit('Invalid or missing JSON input');
}

// Inizializza Circular API solo se necessario
$circular = null;
$blockchain = "0x8a20baa40c45dc5055aeb26197c203e576ef389d9acb171bd62da11dc5ad72b2";
$publicKey = "0x04ff3c44c0adfb6472982a66b4678b257be11699547c1cac022ca9dd943a1c2ccbc8fbb3cb85051ad1126c31223fb1321d3705dd4efe8be924bcb149d85983138c";

if ($table === 'users') {
    try {
        $circular = new CircularProtocolAPI();
    } catch (Exception $e) {
        error_log("Circular API initialization failed: " . $e->getMessage());
    }
}

// Processa input per query
$columns = preg_replace('/[^a-z0-9_]+/i','',array_keys($input));
$values = array_map(function ($value) use ($conn) {
    if ($value === null) return null;
    return mysqli_real_escape_string($conn,(string)$value);
}, array_values($input));

// Costruisci SET clause
$set = '';
for ($i=0; $i<count($columns); $i++) {
    $set .= ($i>0?',':'').'`'.$columns[$i].'`=';
    $set .= ($values[$i]===null?'NULL':'"'.$values[$i].'"');
}

if (empty($set)) {
    http_response_code(400);
    exit('No valid fields to insert');
}

// Esegui query di inserimento principale
$sql = "INSERT INTO `$table` SET $set";
$result = mysqli_query($conn,$sql);

if (!$result) {
    if (mysqli_errno($conn) === 1062) {
        http_response_code(409);
        exit('Email already exists');
    }
    http_response_code(500);
    exit('Database error: ' . mysqli_error($conn));
}

$insertId = mysqli_insert_id($conn);
$response = ['success' => true, 'id' => $insertId];

// Se è registrazione utente e Circular è disponibile
if ($table === 'users' && $circular !== null) {
    try {
        $walletResult = $circular->registerWallet($blockchain, $publicKey);
        
        if (isset($walletResult['Node']) && isset($walletResult['Response']['Timestamp'])) {
            $node = $walletResult['Node'];
            $timestamp = $walletResult['Response']['Timestamp'];
            
            // Inserisci wallet con la struttura semplificata
            $walletSql = "INSERT INTO user_wallets (user_id, address, created_at) VALUES (?, ?, ?)";
            $stmt = mysqli_prepare($conn, $walletSql);
            
            if ($stmt) {
                mysqli_stmt_bind_param($stmt, "iss", $insertId, $node, $timestamp);
                
                if (mysqli_stmt_execute($stmt)) {
                    $response['wallet'] = [
                        'id' => mysqli_insert_id($conn),
                        'address' => $node,
                        'created_at' => $timestamp
                    ];
                } else {
                    error_log("Failed to save wallet: " . mysqli_stmt_error($stmt));
                    $response['wallet_error'] = 'Failed to save wallet';
                }
            }
        } else {
            error_log("Invalid Circular wallet response: " . json_encode($walletResult));
            $response['wallet_error'] = 'Invalid wallet response';
        }
    } catch (Exception $e) {
        error_log("Circular wallet registration failed: " . $e->getMessage());
        $response['wallet_error'] = $e->getMessage();
    }
}

header('Content-Type: application/json');
echo json_encode($response);
?>
