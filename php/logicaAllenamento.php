<?php 
session_start();
include 'conn.php';
include 'getUserFromSession.php';
include 'getSchedaFromUserID.php';
include 'jwt.php';

require "../vendor/autoload.php";

use CircularProtocol\Api\CircularProtocolAPI;

// Parsing robusto del PATH_INFO per PHP 8.2
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

// Verifica metodo e percorso
$method = $_SERVER['REQUEST_METHOD'];
$pathInfo = getPathInfo();
$segments = array_values(array_filter(explode('/', trim($pathInfo, '/'))));
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

// Estrai tabella dal primo segmento
$table = isset($segments[0]) ? preg_replace('/[^a-z0-9_]+/i', '', $segments[0]) : '';
if ($table === '') {
    http_response_code(400);
    exit('Missing table in path');
}

// Rimuovi il primo elemento e tieni il resto come $request
$request = array_slice($segments, 1);

// Recupera user dalla sessione
$user = getUserFromSession($conn);

// Verifica token JWT
if (!validateToken()) {
    echo "Denied";
    exit;
}

// Gestisci le richieste

// POST /allenamenti/{data} - Inserimento allenamento
if ($method == 'POST' && $table == "allenamenti" && isset($request[0])) {
    
    $data_allenamento = $request[0];
    $scheda = getSchedaFromUserID($conn, $user);
    
    if (!$scheda) {
        echo "error";
        exit;
    }
    
    try {
        mysqli_begin_transaction($conn);
        
        // Inserimento allenamento
        $query = "INSERT INTO allenamenti (`data`, `user`, `scheda`) VALUES (?,?,?)";
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, "sii", $data_allenamento, $user, $scheda);
        mysqli_stmt_execute($stmt);
        
        $newAllenamentoID = mysqli_insert_id($conn);
        
        // Decodifica JSON input
        $input = json_decode(file_get_contents('php://input'), true);
        
        // ✅ USA LA CHIAVE 'allenamento' PER OTTENERE GLI ESERCIZI
        $esercizi = $input['allenamento'] ?? [];
        
        if (is_array($esercizi)) {
            $query = "INSERT INTO `a_e`(`allenamento`, `esercizio`, `peso`) VALUES (?,?,?)";
            
            // ✅ LOOP SULL'ARRAY DEGLI ESERCIZI, NON SU TUTTO L'INPUT
            foreach($esercizi as $esercizio => $peso) {
                if ($esercizio !== 'data') { // Escludi solo il campo data interno
                    // Verifica se l'esercizio esiste
                    $check_query = "SELECT nome FROM esercizi WHERE nome = ?";
                    $check_stmt = mysqli_prepare($conn, $check_query);
                    mysqli_stmt_bind_param($check_stmt, "s", $esercizio);
                    mysqli_stmt_execute($check_stmt);
                    $check_result = mysqli_stmt_get_result($check_stmt);
                    
                    if (mysqli_num_rows($check_result) == 0) {
                        throw new Exception("Esercizio '$esercizio' non esiste nella tabella esercizi");
                    }
                    
                    // Se esiste, inserisci
                    $stmt = mysqli_prepare($conn, $query);
                    mysqli_stmt_bind_param($stmt, "isi", $newAllenamentoID, $esercizio, $peso);
                    mysqli_stmt_execute($stmt);
                }
            }
            
            // ✅ INSERIMENTO TRANSAZIONE BLOCKCHAIN
            $txid = $input['txid'] ?? null;
            
            if ($txid) {
                $query2 = "INSERT INTO allenamenti_blocks (id_allenamento, txid) VALUES (?, ?)";
                $stmt2 = mysqli_prepare($conn, $query2);
                mysqli_stmt_bind_param($stmt2, "is", $newAllenamentoID, $txid);
                mysqli_stmt_execute($stmt2);
            }
        }
        
        mysqli_commit($conn);
        echo "ok";
        exit;
        
    } catch (Exception $e) {
        mysqli_rollback($conn);
        error_log("Errore inserimento allenamento: " . $e->getMessage());
        echo "error";
        exit;
    }
}





// GET /schede - Recupero esercizi della scheda attiva
elseif ($method == 'GET' && $table == "schede") {
    
    $id_scheda = getSchedaFromUserID($conn, $user);
    
    if (!$id_scheda) {
        echo "ERROR";
        exit;
    }
    
    try {
        $query = "SELECT nome, serie, ripetizioni, recupero, gruppo 
                  FROM e_s, esercizi 
                  WHERE scheda=? AND esercizi.nome=e_s.esercizio";
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, "i", $id_scheda);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        
        $rows = [];
        while($row = mysqli_fetch_assoc($result)) {
            $rows[] = $row;
        }
        
        // Aggiungi l'id della scheda come ultimo elemento (struttura originale)
        $rows[] = $id_scheda;
        
        echo json_encode($rows);
        exit;
        
    } catch (mysqli_sql_exception $e) {
        echo "ERROR";
        exit;
    }
}

// GET /allenamenti/storico - Recupero storico allenamenti
elseif ($method == 'GET' && $table == "allenamenti" && isset($request[0]) && $request[0] == "storico") {
    
    try {
        $query = "SELECT * FROM allenamenti WHERE user=? ORDER BY id DESC";
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, 'i', $user);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        
        $rows = [];
        while($row = mysqli_fetch_assoc($result)) {
            $rows[] = $row;
        }
        
        echo json_encode($rows);
        exit;
        
    } catch (mysqli_sql_exception $e) {
        echo json_encode([]);
        exit;
    }
}

// GET /a_e/{id_allenamento} - Recupero esercizi di un allenamento
elseif ($method == 'GET' && $table == "a_e" && isset($request[0])) {
    
    $id_allenamento = (int)$request[0];
    
    try {
        // Verifica che l'allenamento appartenga all'user
        $query = "SELECT scheda FROM allenamenti WHERE id=? AND user=?";
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, 'ii', $id_allenamento, $user);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $num_rows = mysqli_num_rows($result);
        
        if ($num_rows == 0) {
            echo "ERROR";
            exit;
        }
        
        $row = mysqli_fetch_assoc($result);
        $id_scheda = $row['scheda'];
        
        // Recupera esercizi dell'allenamento
        $query = "SELECT a_e.allenamento, a_e.esercizio, a_e.peso, esercizi.gruppo, 
                         e_s.serie, e_s.ripetizioni, e_s.recupero, allenamenti.data
                  FROM a_e, esercizi, allenamenti, e_s, schede
                  WHERE a_e.allenamento = allenamenti.id 
                  AND a_e.esercizio = esercizi.nome 
                  AND e_s.esercizio = esercizi.nome 
                  AND e_s.scheda = schede.id 
                  AND schede.id = allenamenti.scheda 
                  AND allenamenti.id = ?";
        
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, 'i', $id_allenamento);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        
        $rows = [];
        while($row = mysqli_fetch_assoc($result)) {
            $rows[] = $row;
        }
        
        echo json_encode($rows);
        exit;
        
    } catch (mysqli_sql_exception $e) {
        echo "ERROR";
        exit;
    }
}

elseif ($method == 'GET' && $table == 'user_wallets'){
    try {
        $query = "SELECT address FROM user_wallets WHERE user_id=? LIMIT 1";
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, 'i', $user);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        
        $wallet = mysqli_fetch_assoc($result);
        
        if ($wallet) {
            echo json_encode(['success' => true, 'wallet' => $wallet]);
            exit;
        } else {
            echo json_encode(['success' => false, 'message' => 'Wallet not found']);
            exit;
        }
        
    } catch (mysqli_sql_exception $e) {
        echo json_encode(['success' => false, 'message' => 'Database error']);
        exit;
    }
}
elseif ($method == 'GET' && $table == 'allenamenti_blocks' && isset($request[0])){
    $id_allenamento = (int)$request[0];

    try {
        $query = "SELECT txid FROM allenamenti_blocks WHERE id_allenamento=? LIMIT 1";
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, 'i', $id_allenamento);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $row = mysqli_fetch_assoc($result);
        
        if ($row) {
            $circular = new CircularProtocolAPI();
            $blockchain = "8a20baa40c45dc5055aeb26197c203e576ef389d9acb171bd62da11dc5ad72b2";
            $txid = $row['txid'];
            
            $blockData = $circular->getTransactionOutcome($blockchain, $txid, 10);
            error_log("BlockData ricevuto: " . json_encode($blockData));
            
            if ($blockData && isset($blockData->Status)) {
                
                // ✅ CONTROLLO STATUS E AGGIORNAMENTO BLOCK ID
                if ($blockData->Status === "Executed" && isset($blockData->BlockID)) {
                    error_log("Transazione Executed - Aggiornamento BlockID: " . $blockData->BlockID);
                    
                    $updateQuery = "UPDATE allenamenti_blocks SET block = ? WHERE id_allenamento = ?";
                    $updateStmt = mysqli_prepare($conn, $updateQuery);
                    
                    if ($updateStmt) {
                        mysqli_stmt_bind_param($updateStmt, 'si', $blockData->BlockID, $id_allenamento);
                        
                        if (mysqli_stmt_execute($updateStmt)) {
                            error_log("✅ BlockID aggiornato con successo per ID allenamento: " . $id_allenamento);
                        } else {
                            error_log("❌ Errore update BlockID: " . mysqli_stmt_error($updateStmt));
                        }
                        
                        mysqli_stmt_close($updateStmt);
                    } else {
                        error_log("❌ Errore prepare update query: " . mysqli_error($conn));
                    }
                }
                
                echo json_encode([
                    'success' => true, 
                    'blockData' => $blockData
                ]);
                exit;
                
            } else {
                error_log("Risposta blockchain non valida - Status mancante");
                echo json_encode([
                    'success' => false, 
                    'message' => 'Invalid blockchain response - no Status'
                ]);
                exit;
            }
        } else {
            echo json_encode([
                'success' => false, 
                'message' => 'No blockchain record for this workout'
            ]);
            exit;
        }
    } catch (Exception $e) {
        error_log("Eccezione getTransactionOutcome: " . $e->getMessage());
        echo json_encode([
            'success' => false, 
            'message' => 'Error checking transaction status: ' . $e->getMessage()
        ]);
        exit;
    }
}
?>
