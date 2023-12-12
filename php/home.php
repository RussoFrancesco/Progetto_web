<?php
session_start();

include 'conn.php';

// Verifica il metodo e il percorso inseriti
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'], '/'));
$table = preg_replace('/[^a-z0-9_]+/i', '', array_shift($request));



if ($table == "users" and $method =="GET") {
    $query="SELECT nome,cognome FROM users where session_id =?";
    $stmt = mysqli_prepare($conn, $query);

    if ($stmt) {
        mysqli_stmt_bind_param($stmt, "s", session_id());
        mysqli_stmt_execute($stmt);

        $res = mysqli_stmt_get_result($stmt);
        $num_rows = mysqli_num_rows($res);

        if ($num_rows == 1) {
            $row = mysqli_fetch_array($res);
            $nome = $row['nome'];
            $cognome = $row['cognome'];

            echo $nome." ".$cognome;     
        }    
    }
}


?>