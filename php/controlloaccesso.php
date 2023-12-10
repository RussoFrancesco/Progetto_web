<?php
session_start();
if(!isset($_SESSION['login']))header("location: login.html"); //Accesso riservato agli uteti autenticati
?>