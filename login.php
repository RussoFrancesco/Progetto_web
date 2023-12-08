<?php

//METHOD e Path inseriti
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));

//connesione al db 
$conn=new mysqli ("localhost","utenti","utenti","web");
mysqli_set_charset($conn,'utf8');



// retrieve the table from the path
$table = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));

if ($table=="users") {

    $email=$_GET['email'];
    $password=$_GET['password'];

    
    echo $email." ".$password;

    //Prepared statement
    $stmt = $mysqli->prepare("SELECT nome,cognome FROM users WHERE email =? AND password =?");
    $stmt->bind_param("ss", $email, $password);
    $stmt->execute();

    // Ottieni il risultato
    $result = $stmt->get_result();

    // Ottieni il numero di righe restituite
    $num_rows = $result->num_rows;

    if ($num_rows == 1) {
        $row=$result->fetch_assoc();
        $nome=$row['nome'];
        $cognome=$row['cognome'];
        echo "OK";
    }
    else{
        echo "ERROR";    }
}



?>