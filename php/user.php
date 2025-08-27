<?php
session_start();

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

// Verifica token JWT
if (!validateToken()) {
    echo "Denied";
    exit;
}

// Gestisci le richieste

// GET /users - Recupera dati dell'utente corrente
if ($table == "users" && $method == "GET") {
    
    try {
        // Fix per il warning "Only variables should be passed by reference"
        $current_session_id = session_id();
        
        $query = "SELECT * FROM users WHERE session_id=?";
        $stmt = mysqli_prepare($conn, $query);
        
        if (!$stmt) {
            echo "ERROR";
            exit;
        }
        
        mysqli_stmt_bind_param($stmt, "s", $current_session_id);
        mysqli_stmt_execute($stmt);
        $res = mysqli_stmt_get_result($stmt);
        $num_rows = mysqli_num_rows($res);
        
        if ($num_rows == 1) {
            $user_data = mysqli_fetch_assoc($res);
            echo json_encode($user_data);
        } else {
            echo "ERROR";
        }
        
    } catch (mysqli_sql_exception $e) {
        echo "ERROR";
    }
}

// PUT /users - Modifica dati utente
elseif ($table == "users" && $method == "PUT") {
    
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validazione input
        if (!is_array($input) || !isset($input["nome"]) || !isset($input["cognome"]) || !isset($input["email"]) || !isset($input["phone"])) {
            echo "ERROR";
            exit;
        }
        
        $nome = $input["nome"];
        $cognome = $input["cognome"];
        $email = $input["email"];
        $phone = $input["phone"];
        $userid = getUserFromSession($conn);
        
        if (!$userid) {
            echo "ERROR";
            exit;
        }
        
        // Controllo se la nuova email è già presente nel db (per altro utente)
        $query = "SELECT email, id as user FROM users WHERE email=?";
        $stmt = mysqli_prepare($conn, $query);
        
        if (!$stmt) {
            echo "ERROR";
            exit;
        }
        
        mysqli_stmt_bind_param($stmt, "s", $email);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $row = mysqli_fetch_assoc($result);
        
        // Se c'è già nel db per un altro utente, ritorna "email"
        if ($row && $row['user'] != $userid) {
            echo "email";
        } else {
            // Fai la query di update
            $query = "UPDATE `users` SET `nome`=?, `cognome`=?, `email`=?, `telefono`=? WHERE id=?";
            $stmt = mysqli_prepare($conn, $query);
            
            if (!$stmt) {
                echo "ERROR";
                exit;
            }
            
            mysqli_stmt_bind_param($stmt, "ssssi", $nome, $cognome, $email, $phone, $userid);
            mysqli_stmt_execute($stmt);
            $rows = mysqli_stmt_affected_rows($stmt);
            
            if ($rows == 1) {
                echo "OK";
            } else {
                echo "ERROR";
            }
        }
        
    } catch (mysqli_sql_exception $e) {
        echo "ERROR";
    } catch (Exception $e) {
        echo "ERROR";
    }
}

// DELETE /users - Elimina l'utente
elseif ($table == "users" && $method == "DELETE") {
    
    try {
        $userid = getUserFromSession($conn);
        
        if (!$userid) {
            echo "ERROR";
            exit;
        }
        
        $query = "DELETE FROM `users` WHERE id=?";
        $stmt = mysqli_prepare($conn, $query);
        
        if (!$stmt) {
            echo "Errore nella preparazione dello statement: " . mysqli_error($conn);
            exit;
        }
        
        mysqli_stmt_bind_param($stmt, "i", $userid);
        mysqli_stmt_execute($stmt);
        $rows = mysqli_stmt_affected_rows($stmt);
        
        if ($rows == 1) {
            echo "eseguita";
        } else {
            echo "Nessuna riga eliminata";
        }
        
    } catch (mysqli_sql_exception $e) {
        echo "ERROR";
    }
}

?>
