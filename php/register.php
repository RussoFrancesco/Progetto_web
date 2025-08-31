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

// ✅ ESTRAI DATI WALLET GENERATI DAL JAVASCRIPT
$userPublicKey = null;
$userAddress = null;
$userPrivateKey = null; // Solo per debug/log, non salvare!

$publicKeyIndex = array_search('public_key', array_keys($input));
$addressIndex = array_search('address', array_keys($input));
$privateKeyIndex = array_search('private_key', array_keys($input));

if ($publicKeyIndex !== false) {
    $userPublicKey = $input['public_key'];
    unset($input['public_key']);
    error_log("User public key received: " . substr($userPublicKey, 0, 20) . "...");
}

if ($addressIndex !== false) {
    $userAddress = $input['address'];
    unset($input['address']);
    error_log("User address received: " . $userAddress);
}

if ($privateKeyIndex !== false) {
    $userPrivateKey = $input['private_key'];
    unset($input['private_key']);
    error_log("User private key received: " . substr($userPrivateKey, 0, 10) . "... (length: " . strlen($userPrivateKey) . ")");
}

// Processa input per query utente
$columns = array_map(function($key) {
    return preg_replace('/[^a-z0-9_]+/i','', $key);
}, array_keys($input));

$values = array_map(function ($value) use ($conn) {
    if ($value === null) return null;
    return mysqli_real_escape_string($conn, (string)$value);
}, array_values($input));

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
    $response = ['success' => true, 'user_id' => $insertId]; // ✅ Cambiato da 'id' a 'user_id'
    
    error_log("User inserted with ID: $insertId");
    
    // ✅ GESTIONE WALLET CON ADDRESS GENERATO DAL JAVASCRIPT
    if ($table === 'users' && $circular !== null) {
        try {
            if (!$userPublicKey || !$userAddress) {
                error_log("ERROR: User public key or address missing");
                $response['wallet_error'] = 'User public key and address are required';
                $response['wallet_pending'] = true;
            } else {
                error_log("Registering wallet on Circular Protocol...");
                error_log("- Public Key: " . substr($userPublicKey, 0, 30) . "...");
                error_log("- Address: " . $userAddress);
                
                // ✅ REGISTRA IL WALLET CON LA CHIAVE PUBBLICA
                $walletResult = $circular->registerWallet($blockchain, $userPublicKey);
                error_log("Wallet registration response: " . json_encode($walletResult));
                
                // ✅ VERIFICA SUCCESSO REGISTRAZIONE
                if (isset($walletResult->Result) && $walletResult->Result == 200) {
                    // Estrai TXID dalla registrazione
                    $txid = null;
                    if (isset($walletResult->Response->TxID)) {
                        $txid = $walletResult->Response->TxID;
                    } elseif (isset($walletResult->Response->txid)) {
                        $txid = $walletResult->Response->txid;
                    }
                    
                    $timestamp = $walletResult->Response->Timestamp ?? date('Y-m-d H:i:s');
                    
                    error_log("✅ Wallet registered successfully on blockchain");
                    error_log("- TxID: " . $txid);
                    error_log("- Timestamp: " . $timestamp);
                    
                    // ✅ SALVA NEL DATABASE CON L'ADDRESS GENERATO DAL JAVASCRIPT
                    $walletSql = "INSERT INTO user_wallets (user_id, address, txid, created_at) VALUES (?, ?, ?, ?)";
                    $stmt = mysqli_prepare($conn, $walletSql);
                    
                    if ($stmt) {
                        mysqli_stmt_bind_param($stmt, "isss", $insertId, $userAddress, $txid, $timestamp);
                        
                        if (mysqli_stmt_execute($stmt)) {
                            $walletId = mysqli_insert_id($conn);
                            $response['wallet'] = [
                                'id' => $walletId,
                                'address' => $userAddress, // ✅ USA L'ADDRESS GENERATO DAL JAVASCRIPT
                                'txid' => $txid,
                                'created_at' => $timestamp
                            ];
                            error_log("✅ Wallet saved successfully with ID: $walletId");
                            error_log("✅ Using JavaScript-generated address: " . $userAddress);
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
                    $errorCode = $walletResult->Result ?? 'Unknown';
                    $errorMessage = isset($walletResult->Response) ? 
                        (is_string($walletResult->Response) ? $walletResult->Response : json_encode($walletResult->Response)) : 
                        'Unknown error';
                    
                    error_log("Wallet registration failed - Code: $errorCode, Message: $errorMessage");
                    $response['wallet_error'] = "Wallet registration failed (Code: $errorCode)";
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
