<?php
//inizio la sessione 
session_start();
//includo la connesione al db
include 'conn.php';
//rendo il session id del db NULL
$query="UPDATE users SET session_id=NULL WHERE session_id =?";
$stmt=mysqli_prepare($conn, $query);
mysqli_stmt_bind_param($stmt, "s", session_id());
mysqli_stmt_execute($stmt);


// rimuovo le variabili di sessione 
session_unset();
//distruggo la sessione
session_destroy();

session_abort();

//Reindirizza alla home page
echo "SESSION_CLOSED";

?>