<?php
session_start();

// Connessione al database
include 'conn.php';

// Verifica il metodo e il percorso inseriti
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'], '/'));



// Recupera la tabella dal percorso
$table = preg_replace('/[^a-z0-9_]+/i', '', array_shift($request));

if ($table == "users") {
    $email = mysqli_real_escape_string($conn, array_shift($request));
    $password = mysqli_real_escape_string($conn, array_shift($request));



    // Prepared statement
    $query = "SELECT id FROM users WHERE email=? AND pswrd=?";
    $stmt = mysqli_prepare($conn, $query);
    
    if ($stmt) {
        mysqli_stmt_bind_param($stmt, "ss", $email, $password);
        mysqli_stmt_execute($stmt);
        
        $res = mysqli_stmt_get_result($stmt);
        
        $num_rows = mysqli_num_rows($res);

        if ($num_rows == 1) {
            
            

            $row = mysqli_fetch_array($res);
            $id = $row['id'];
            
            $_SESSION['id'] = $id;

            echo "OK";

        } else {
            echo "ERROR";
        }
    } else {
        echo "Statement preparation error: " . mysqli_error($conn);
    }
}

?>
