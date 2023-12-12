<?php
session_start();

include 'conn.php';

// Verifica il metodo e il percorso inseriti
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'], '/'));
$table = preg_replace('/[^a-z0-9_]+/i', '', array_shift($request));



if ($table == "users" and $method =="GET") {
    $query="SELECT * FROM users where session_id =?";
    $stmt = mysqli_prepare($conn, $query);

    if ($stmt) {
        mysqli_stmt_bind_param($stmt, "s", session_id());
        mysqli_stmt_execute($stmt);

        $res = mysqli_stmt_get_result($stmt);
        $num_rows = mysqli_num_rows($res);

        if ($num_rows==1){
            $user_data = mysqli_fetch_assoc($res);
            $user_object = json_encode($user_data);
            echo $user_object;
        }
        else{
            echo "ERROR";
        }

     
    }
}