<?php
session_start();

include 'conn.php';
$query="UPDATE users SET session_id=NULL WHERE session_id =?";
$stmt=mysqli_prepare($conn, $query);
mysqli_stmt_bind_param($stmt, "s", session_id());
mysqli_stmt_execute($stmt);


// remove all session variables
session_unset();
// destroy the session
session_destroy();

session_abort();

//Reindirizza alla home page
echo "SESSION_CLOSED";

?>