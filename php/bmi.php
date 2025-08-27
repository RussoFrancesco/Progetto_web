<?php 

// Avviamo la sessione 
session_start();

// Includiamo i file necessari
include 'conn.php'; 
include 'getUserFromSession.php';
include 'jwt.php';

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

// Estrai tabella dal primo segmento
$table = isset($segments[0]) ? preg_replace('/[^a-z0-9_]+/i', '', $segments[0]) : '';
if ($table === '') {
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

// POST /bmi/{valore}/{data} - Inserimento BMI
if ($method == 'POST' && $table === 'bmi' && isset($request[0]) && isset($request[1])) {
    
    $bmi = $request[0];
    $data = $request[1];
    
    try {
        // Query di inserimento
        $query = "INSERT INTO bmi(user, bmi, data) VALUES (?, ?, ?)";
        $stmt = mysqli_prepare($conn, $query);
        
        if (!$stmt) {
            echo 'error';
            exit;
        }
        
        mysqli_stmt_bind_param($stmt, "ids", $user, $bmi, $data);
        $res = mysqli_stmt_execute($stmt);
        
        // Response del server (mantiene struttura originale)
        if ($res) {
            echo 'ok';
        } else {
            echo 'error';
        }
        
    } catch (mysqli_sql_exception $e) {
        echo 'error';
    }
}

// GET /bmi - Recupero misurazioni BMI dell'utente
elseif ($method == "GET" && $table == "bmi") {
    
    try {
        // Query per recuperare dati BMI
        $query = "SELECT * FROM bmi WHERE user = ? ORDER BY data ASC";
        $stmt = mysqli_prepare($conn, $query);
        
        if (!$stmt) {
            echo json_encode(["labels" => [], "data" => []]);
            exit;
        }
        
        mysqli_stmt_bind_param($stmt, "i", $user);
        mysqli_stmt_execute($stmt);
        $res = mysqli_stmt_get_result($stmt);
        
        // Inizializza array per labels e dati
        $labels = [];
        $data = [];
        
        // Recupera dati dal database
        while ($row = mysqli_fetch_assoc($res)) {
            $labels[] = $row['data'];
            $data[] = $row['bmi'];
        }
        
        // Mantiene la struttura JSON originale
        $rows = [
            "labels" => $labels,
            "data" => $data
        ];
        
        echo json_encode($rows);
        
    } catch (mysqli_sql_exception $e) {
        // Return empty structure in caso di errore
        echo json_encode(["labels" => [], "data" => []]);
    }
}

?>
