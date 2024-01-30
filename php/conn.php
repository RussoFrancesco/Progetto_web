<?php 
//Creo connesione al DB e definisco il charset
$conn = mysqli_connect("172.17.0.1", "root", "root", "web");
//$conn = mysqli_connect("localhost", "utenti", "utenti", "web");
mysqli_set_charset($conn, 'utf8');

?>