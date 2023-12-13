<?php 
include 'conn.php';

// Verifica il metodo e il percorso inseriti
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'], '/'));
$table = preg_replace('/[^a-z0-9_]+/i', '', array_shift($request));


if ($table == 'esercizi' && $method == 'GET'){
    $query = 'SELECT * FROM esercizi';
    $res = mysqli_query($conn, $query);

    if ($res) {
        if (mysqli_num_rows($res) != 0){
            $rows = mysqli_fetch_all($res, MYSQLI_ASSOC);
            $object = json_encode($rows);
            echo $object;
        } else {
            echo "Nessun risultato trovato";
        }
    } else {
        echo "Errore nella query: " . mysqli_error($conn);
    }
}




?>