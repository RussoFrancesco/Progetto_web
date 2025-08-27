<?php 
// Inizio la sessione
session_start();

// Includo i file necessari
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
$user = getUserFromSession($conn);

// Verifica token JWT
if (!validateToken()) {
    echo "Denied";
    exit;
}

// Gestisci le richieste

// GET /esercizi - Lista tutti gli esercizi
if ($method == "GET" && $table == "esercizi") {
    
    $query = "SELECT * FROM esercizi ORDER BY gruppo";
    $res = mysqli_query($conn, $query);
    $rows = [];

    if ($res) {
        while ($row = mysqli_fetch_array($res)) {
            $rows[] = $row;
        }
    }

    echo json_encode($rows);
}

// GET /a_e/progressi - Progressi per esercizio random
elseif ($method == "GET" && $table == "a_e" && isset($request[0]) && $request[0] == "progressi") {
    
    try {
        $query = "SELECT allenamenti.data, a_e.peso, a_e.esercizio 
                  FROM a_e, allenamenti 
                  WHERE allenamenti.user = ? AND allenamenti.id = a_e.allenamento";
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, "i", $user);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        
        // Raccoglie tutti i dati in un array invece di usare mysqli_data_seek
        $allData = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $allData[] = $row;
        }
        $rows = count($allData);
        
        if ($rows > 0) {
            // Seleziona un indice random
            $randomIndex = rand(0, $rows - 1);
            $selectedExercise = $allData[$randomIndex]['esercizio'];
            
            // Filtra i dati per l'esercizio selezionato
            $dates = []; // Fix: era $date nel codice originale
            $weights = [];
            
            foreach ($allData as $row) {
                if ($row['esercizio'] === $selectedExercise) {
                    $dates[] = $row['data'];
                    $weights[] = $row['peso'];
                }
            }
            
            // Mantiene la struttura JSON originale
            $json = [
                "esercizio" => $selectedExercise,
                "date" => $dates,
                "pesi" => $weights
            ];
            
            echo json_encode($json);
        } else {
            // Return empty structure se nessun dato
            echo json_encode([
                "esercizio" => "",
                "date" => [],
                "pesi" => []
            ]);
        }
        
    } catch (mysqli_sql_exception $e) {
        // Return empty structure in caso di errore
        echo json_encode([
            "esercizio" => "",
            "date" => [],
            "pesi" => []
        ]);
    }
}

// GET /a_e/gruppi - Statistiche gruppi muscolari
elseif ($method == "GET" && $table == "a_e" && isset($request[0]) && $request[0] == "gruppi") {
    
    try {
        $query = "SELECT esercizi.gruppo, COUNT(*) as occorrenze 
                  FROM `a_e`, allenamenti, esercizi 
                  WHERE esercizi.nome = a_e.esercizio 
                  AND a_e.allenamento = allenamenti.id 
                  AND allenamenti.user = ? 
                  GROUP BY esercizi.gruppo";
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, "i", $user);
        mysqli_stmt_execute($stmt);
        $res = mysqli_stmt_get_result($stmt);
        
        $rows = [];
        while ($row = mysqli_fetch_array($res)) {
            $rows[$row["gruppo"]] = $row["occorrenze"];
        }
        
        echo json_encode($rows);
        
    } catch (mysqli_sql_exception $e) {
        // Return empty object in caso di errore
        echo json_encode(new stdClass());
    }
}

?>
