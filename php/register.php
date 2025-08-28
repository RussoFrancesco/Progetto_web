<?php
include 'conn.php';
require "../vendor/autoload.php";

use CircularProtocol\Api\CircularProtocolAPI;

// Gestione CORS e errori
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Abilita errori per debug
error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');

// Parsing PATH_INFO
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
    exit(json_encode(['error' => 'Missing table in path']));
}

// Verifica connessione database
if (!$conn) {
    http_response_code(500);
    exit(json_encode(['error' => 'Database connection failed']));
}

// JSON decode con controllo errori
$raw = file_get_contents('php://input') ?: '';
$input = json_decode($raw, true);
if (!is_array($input)) {
    http_response_code(400);
    exit(json_encode(['error' => 'Invalid or missing JSON input']));
}

// Inizializza Circular API
$circular = null;
$blockchain = "0x8a20baa40c45dc5055aeb26197c203e576ef389d9acb171bd62da11dc5ad72b2";

if ($table === 'users') {
    try {
        $circular = new CircularProtocolAPI();
    } catch (Throwable $e) {
        error_log("Circular API initialization failed: " . $e->getMessage());
        $circular = null;
    }
}

// Processa input per query
$columns = array_map(function($key) {
    return preg_replace('/[^a-z0-9_]+/i','', $key);
}, array_keys($input));

$values = array_map(function ($value) use ($conn) {
    if ($value === null) return null;
    return mysqli_real_escape_string($conn, (string)$value);
}, array_values($input));

// ✅ ESTRAI LA CHIAVE PUBBLICA
$userPublicKey = null;
$publicKeyIndex = array_search('public_key', $columns);
if ($publicKeyIndex !== false) {
    $userPublicKey = $values[$publicKeyIndex];
    error_log("User public key received: " . substr($userPublicKey, 0, 20) . "...");
    
    // Rimuovi dai dati da inserire nel database utenti
    unset($columns[$publicKeyIndex]);
    unset($values[$publicKeyIndex]);
    $columns = array_values($columns);
    $values = array_values($values);
}

// Costruisci SET clause
$set = '';
for ($i = 0; $i < count($columns); $i++) {
    $set .= ($i > 0 ? ',' : '') . '`' . $columns[$i] . '`=';
    $set .= ($values[$i] === null ? 'NULL' : '"' . $values[$i] . '"');
}

if (empty($set)) {
    http_response_code(400);
    exit(json_encode(['error' => 'No valid fields to insert']));
}

try {
    // INIZIO TRANSAZIONE
    mysqli_begin_transaction($conn);
    
    // Inserimento utente
    $sql = "INSERT INTO `$table` SET $set";
    $result = mysqli_query($conn, $sql);
    
    if (!$result) {
        if (mysqli_errno($conn) === 1062) {
            mysqli_rollback($conn);
            http_response_code(409);
            exit(json_encode(['error' => 'Email already exists']));
        }
        mysqli_rollback($conn);
        throw new Exception('User insertion failed: ' . mysqli_error($conn));
    }
    
    $insertId = mysqli_insert_id($conn);
    $response = ['success' => true, 'id' => $insertId];
    
    error_log("User inserted with ID: $insertId");
    
    // ✅ GESTIONE WALLET CON CORREZIONE STDCLASS
    if ($table === 'users' && $circular !== null) {
        try {
            if (!$userPublicKey) {
                error_log("ERROR: User public key missing");
                $response['wallet_error'] = 'User public key is required';
                $response['wallet_pending'] = true;
            } else {
                error_log("Calling registerWallet with key: " . substr($userPublicKey, 0, 30) . "...");
                
                $walletResult = $circular->registerWallet($blockchain, $userPublicKey);
                error_log("Wallet API Response: " . json_encode($walletResult));
                
                // ✅ ACCESSO CORRETTO COME OGGETTO (non array!)
                if (isset($walletResult->Node) && isset($walletResult->Response->Timestamp)) {
                    $walletAddress = $walletResult->Node;
                    $timestamp = $walletResult->Response->Timestamp;
                    
                    // Estrai TXID se presente
                    $txid = null;
                    if (isset($walletResult->Response->TxID)) {
                        $txid = $walletResult->Response->TxID;
                    } elseif (isset($walletResult->TxID)) {
                        $txid = $walletResult->TxID;
                    } elseif (isset($walletResult->txid)) {
                        $txid = $walletResult->txid;
                    }
                    
                    error_log("Wallet data - Address: $walletAddress, TxID: $txid, Timestamp: $timestamp");
                    
                    // Inserimento wallet nel database
                    $walletSql = "INSERT INTO user_wallets (user_id, address, txid, created_at) VALUES (?, ?, ?, ?)";
                    $stmt = mysqli_prepare($conn, $walletSql);
                    
                    if ($stmt) {
                        mysqli_stmt_bind_param($stmt, "isss", $insertId, $walletAddress, $txid, $timestamp);
                        
                        if (mysqli_stmt_execute($stmt)) {
                            $walletId = mysqli_insert_id($conn);
                            $response['wallet'] = [
                                'id' => $walletId,
                                'address' => $walletAddress,
                                'txid' => $txid,
                                'created_at' => $timestamp
                            ];
                            error_log("✅ Wallet saved successfully with ID: $walletId");
                        } else {
                            error_log("Failed to save wallet: " . mysqli_stmt_error($stmt));
                            $response['wallet_error'] = 'Failed to save wallet to database';
                            $response['wallet_pending'] = true;
                        }
                        mysqli_stmt_close($stmt);
                    } else {
                        error_log("Failed to prepare wallet statement: " . mysqli_error($conn));
                        $response['wallet_error'] = 'Database prepare failed';
                        $response['wallet_pending'] = true;
                    }
                } else {
                    error_log("Invalid wallet response structure: " . json_encode($walletResult));
                    $response['wallet_error'] = 'Invalid wallet response from Circular Protocol';
                    $response['wallet_pending'] = true;
                }
            }
            
        } catch (Exception $e) {
            error_log("Wallet creation exception: " . $e->getMessage());
            $response['wallet_error'] = 'Wallet creation failed: ' . $e->getMessage();
            $response['wallet_pending'] = true;
        }
    } elseif ($table === 'users') {
        error_log("Circular API not available");
        $response['wallet_pending'] = true;
        $response['wallet_error'] = 'Circular Protocol API not available';
    }
    
    // COMMIT TRANSAZIONE
    mysqli_commit($conn);
    
} catch (Exception $e) {
    mysqli_rollback($conn);
    error_log("Registration error: " . $e->getMessage());
    http_response_code(500);
    exit(json_encode(['error' => 'Registration failed: ' . $e->getMessage()]));
}

error_log("Final response: " . json_encode($response));
echo json_encode($response);
?>
