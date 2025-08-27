<?php

session_start();

// Connessione al database
include 'conn.php';
include 'getUserFromSession.php';
include 'getSchedaFromUserID.php';
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
$id_user = getUserFromSession($conn);

// Verifica token JWT
if (!validateToken()) {
    echo "Denied";
    exit;
}

// Gestisci le richieste

// GET /schede/storico - Storico delle schede
if ($method == 'GET' && isset($request[0]) && $request[0] == "storico" && $table == 'schede') {
    
    try {
        $query = "SELECT schede.id as id_scheda, data_inizio, data_fine
                  FROM `schede` 
                  WHERE user=? ORDER BY data_fine DESC";
        
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, "i", $id_user);
        mysqli_stmt_execute($stmt);
        $res = mysqli_stmt_get_result($stmt);
        
        $rows = [];
        while ($row = mysqli_fetch_assoc($res)) {
            $rows[] = $row;
        }
        
        echo json_encode($rows);
        
    } catch (mysqli_sql_exception $e) {
        echo json_encode([]);
    }
}

// POST /scheda/{data_inizio} - Inserimento nuova scheda
elseif ($method == 'POST' && $table == 'scheda' && isset($request[0])) {
    
    $data_inizio = $request[0];
    
    try {
        // Inserisci scheda
        $query = "INSERT INTO `schede` (`data_inizio`, `user`) VALUES (?,?)";
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, "si", $data_inizio, $id_user);
        mysqli_stmt_execute($stmt);
        $id_scheda = mysqli_insert_id($conn);
        
        // Recupera JSON con esercizi
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (is_array($input) && !empty($input)) {
            $query = "INSERT INTO `e_s`(`esercizio`, `scheda`, `serie`, `ripetizioni`, `recupero`) VALUES (?,?,?,?,?)";
            
            foreach ($input as $exercise) {
                if (isset($exercise["nome"]) && isset($exercise["n_serie"]) && isset($exercise["n_rep"]) && isset($exercise["rec"])) {
                    $stmt = mysqli_prepare($conn, $query);
                    mysqli_stmt_bind_param($stmt, "siiii", $exercise["nome"], $id_scheda, $exercise["n_serie"], $exercise["n_rep"], $exercise["rec"]);
                    mysqli_stmt_execute($stmt);
                }
            }
        }
        
        echo "ok";
        
    } catch (mysqli_sql_exception $e) {
        echo "error";
    }
}

// GET /scheda/{id} - Recupero scheda specifica
elseif ($method == 'GET' && $table == 'scheda' && isset($request[0])) {
    
    $id_scheda = (int)$request[0];
    
    try {
        $query = "SELECT * FROM `schede` WHERE id=? AND user=?";
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, "ii", $id_scheda, $id_user);
        mysqli_stmt_execute($stmt);
        $res = mysqli_stmt_get_result($stmt);
        
        if ($res && mysqli_num_rows($res) == 1) {
            $row = mysqli_fetch_assoc($res);
            echo json_encode($row);
        } else {
            echo "ERROR";
        }
        
    } catch (mysqli_sql_exception $e) {
        echo "ERROR";
    }
}

// GET /e_s/schede/esercizi/{id_scheda} - Esercizi di una scheda
elseif ($method == 'GET' && $table == 'e_s' && isset($request[0]) && $request[0] == 'schede' && isset($request[1]) && $request[1] == 'esercizi' && isset($request[2])) {
    
    $id_scheda = (int)$request[2];
    
    try {
        $query = "SELECT e_s.esercizio, e_s.serie, e_s.ripetizioni, e_s.recupero, esercizi.gruppo
                  FROM e_s, schede, esercizi 
                  WHERE e_s.scheda = schede.id AND e_s.esercizio = esercizi.nome AND e_s.scheda = ?";
        
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, "i", $id_scheda);
        mysqli_stmt_execute($stmt);
        $res = mysqli_stmt_get_result($stmt);
        
        $rows = [];
        while ($row = mysqli_fetch_assoc($res)) {
            $rows[] = $row;
        }
        
        echo json_encode($rows);
        
    } catch (mysqli_sql_exception $e) {
        echo json_encode([]);
    }
}

// PUT /schede/{id_scheda}/{data_fine} - Chiusura scheda
elseif ($method == 'PUT' && $table == 'schede' && isset($request[0]) && isset($request[1]) && !isset($request[2])) {
    
    $id_scheda = (int)$request[0];
    $data_fine = $request[1];
    
    try {
        $query = "UPDATE `schede` SET `data_fine`=? WHERE id=? AND user=?";
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, "sii", $data_fine, $id_scheda, $id_user);
        mysqli_stmt_execute($stmt);
        
        if (mysqli_affected_rows($conn) > 0) {
            echo "ok";
        } else {
            echo "ERROR";
        }
        
    } catch (mysqli_sql_exception $e) {
        echo "ERROR";
    }
}

// GET /esercizi/{id_scheda} - Esercizi NON nella scheda
elseif ($method == "GET" && $table == 'esercizi' && isset($request[0])) {
    
    $id_scheda = (int)$request[0];
    
    try {
        $query = "SELECT esercizi.nome, esercizi.gruppo FROM esercizi 
                  WHERE esercizi.nome NOT IN (SELECT e_s.esercizio
                                             FROM e_s, schede, esercizi 
                                             WHERE e_s.scheda = schede.id 
                                             AND e_s.esercizio = esercizi.nome 
                                             AND e_s.scheda = ?)";
        
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, "i", $id_scheda);
        mysqli_stmt_execute($stmt);
        $res = mysqli_stmt_get_result($stmt);
        
        $rows = [];
        while ($row = mysqli_fetch_assoc($res)) {
            $rows[] = $row;
        }
        
        echo json_encode($rows);
        
    } catch (mysqli_sql_exception $e) {
        echo json_encode([]);
    }
}

// PUT /schede/{id_scheda}/{data_inizio}/modify - Modifica scheda
elseif ($method == 'PUT' && $table == 'schede' && isset($request[0]) && isset($request[1]) && isset($request[2])) {
    
    $id_scheda = (int)$request[0];
    $data_inizio = $request[1];
    
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Elimina esercizi esistenti
        $query = "DELETE FROM `e_s` WHERE scheda = ?";
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, "i", $id_scheda);
        mysqli_stmt_execute($stmt);
        
        // Inserisci nuovi esercizi
        if (is_array($input) && !empty($input)) {
            $query = "INSERT INTO `e_s`(`esercizio`, `scheda`, `serie`, `ripetizioni`, `recupero`) VALUES (?,?,?,?,?)";
            
            foreach ($input as $exercise) {
                if (isset($exercise["nome"]) && isset($exercise["n_serie"]) && isset($exercise["n_rep"]) && isset($exercise["rec"])) {
                    $stmt = mysqli_prepare($conn, $query);
                    mysqli_stmt_bind_param($stmt, "siiii", $exercise["nome"], $id_scheda, $exercise["n_serie"], $exercise["n_rep"], $exercise["rec"]);
                    mysqli_stmt_execute($stmt);
                }
            }
        }
        
        echo "ok";
        
    } catch (mysqli_sql_exception $e) {
        echo "error";
    }
}

// POST /e_s/{nome}/{serie}/{ripetizioni}/{recupero} - Aggiungi esercizio alla scheda attuale
elseif ($method == "POST" && $table == "e_s" && isset($request[0]) && isset($request[1]) && isset($request[2]) && isset($request[3])) {
    
    $id_scheda = getSchedaFromUserID($conn, $id_user);
    
    if (!$id_scheda) {
        echo 'error';
        exit;
    }
    
    $nome = $request[0];
    $serie = (int)$request[1];
    $ripetizioni = (int)$request[2];
    $recupero = (int)$request[3];
    
    try {
        $query = "INSERT INTO `e_s`(`esercizio`, `scheda`, `serie`, `ripetizioni`, `recupero`) VALUES (?,?,?,?,?)";
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, "siiii", $nome, $id_scheda, $serie, $ripetizioni, $recupero);
        $res = mysqli_stmt_execute($stmt);
        
        if ($res) {
            echo 'ok';
        } else {
            echo 'error';
        }
        
    } catch (mysqli_sql_exception $e) {
        echo 'error';
    }
}

// GET /e_s/attuale - Esercizi della scheda attuale
elseif ($method == 'GET' && $table == 'e_s' && isset($request[0]) && $request[0] == 'attuale') {
    
    $id_scheda = getSchedaFromUserID($conn, $id_user);
    
    if (!$id_scheda) {
        echo json_encode([]);
        exit;
    }
    
    try {
        $query = "SELECT esercizio FROM e_s WHERE scheda=?";
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, "i", $id_scheda);
        mysqli_stmt_execute($stmt);
        $res = mysqli_stmt_get_result($stmt);
        
        $rows = [];
        while ($row = mysqli_fetch_array($res)) {
            $rows[] = $row;
        }
        
        echo json_encode($rows);
        
    } catch (mysqli_sql_exception $e) {
        echo json_encode([]);
    }
}

// DELETE /e_s/{esercizio} - Elimina esercizio dalla scheda attuale
elseif ($method == "DELETE" && $table == "e_s" && isset($request[0])) {
    
    $id_scheda = getSchedaFromUserID($conn, $id_user);
    
    if (!$id_scheda) {
        echo "ERROR";
        exit;
    }
    
    $esercizio = $request[0];
    
    try {
        $query = "DELETE FROM e_s WHERE scheda=? AND esercizio=?";
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, "is", $id_scheda, $esercizio);
        mysqli_stmt_execute($stmt);
        
        if (mysqli_affected_rows($conn) > 0) {
            echo "ok";
        } else {
            echo "ERROR";
        }
        
    } catch (mysqli_sql_exception $e) {
        echo "ERROR";
    }
}

?>
