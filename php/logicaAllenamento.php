<?php 
session_start();
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
        // Inserimento allenamento
        $query = "INSERT INTO allenamenti (`data`, `user`, `scheda`) VALUES (?,?,?)";
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, "sii", $data_allenamento, $user, $scheda);
        mysqli_stmt_execute($stmt);
        
        $newAllenamentoID = mysqli_insert_id($conn);
        
        // Decodifica JSON input per esercizi
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (is_array($input)) {
            // Inserimento esercizi
            $query = "INSERT INTO `a_e`(`allenamento`, `esercizio`, `peso`) VALUES (?,?,?)";
            
            foreach($input as $esercizio => $peso) {
                $stmt = mysqli_prepare($conn, $query);
                mysqli_stmt_bind_param($stmt, "isi", $newAllenamentoID, $esercizio, $peso);
                mysqli_stmt_execute($stmt);
            }
        }
        
        echo "ok";
        
    } catch (mysqli_sql_exception $e) {
        echo "error";
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
        
    } catch (mysqli_sql_exception $e) {
        echo "ERROR";
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
        
    } catch (mysqli_sql_exception $e) {
        echo json_encode([]);
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
        
    } catch (mysqli_sql_exception $e) {
        echo "ERROR";
    }
}

?>
