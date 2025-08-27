<?php
// Connessione al database
include 'conn.php';
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

// Se la tabella è users - Login endpoint
if ($table == "users") {
    
    // Verifica che ci siano email e password nei parametri
    if (!isset($request[0]) || !isset($request[1])) {
        echo "ERROR";
        exit;
    }
    
    // Recupero email e password (già sanitizzati dal prepared statement)
    $email = $request[0];
    $password = $request[1];
    
    try {
        // Prepared statement per recuperare le info dell'user
        $query = "SELECT id, nome, cognome FROM users WHERE email=? AND pswrd=?";
        $stmt = mysqli_prepare($conn, $query);
        
        if (!$stmt) {
            echo "ERROR";
            exit;
        }
        
        mysqli_stmt_bind_param($stmt, "ss", $email, $password);
        mysqli_stmt_execute($stmt);
        $res = mysqli_stmt_get_result($stmt);
        $num_rows = mysqli_num_rows($res);
        
        // Se è stato trovato il record corrispondente all'user 
        if ($num_rows == 1) {
            $row = mysqli_fetch_array($res);
        
            // AVVIO LA SESSIONE AL LOGIN
            session_start();
            // Rigenero l'id della sessione 
            session_regenerate_id();
            $sessionid = session_id();
            $id = $row['id'];
            
            // Aggiorno l'id della sessione nel DB
            $updateQuery = "UPDATE users SET session_id=? WHERE id=?";
            $updateStmt = mysqli_prepare($conn, $updateQuery);
            
            if ($updateStmt) {
                mysqli_stmt_bind_param($updateStmt, "si", $sessionid, $id);
                mysqli_stmt_execute($updateStmt);
            }
            
            // Setto variabile di sessione 
            $_SESSION['login'] = true;
            
            // Ritorna il token JWT (mantiene struttura originale)
            echo createToken($id, $email);
            
        } else {
            // Caso d'errore - credenziali sbagliate
            echo "ERROR";
        }
        
    } catch (mysqli_sql_exception $e) {
        // Errore database
        echo "ERROR";
    }
}

?>
