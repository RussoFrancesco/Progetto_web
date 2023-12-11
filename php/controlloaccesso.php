<?php
session_start();
if(!isset($_SESSION['login']) || $_SESSION['login']==false )echo "NOT_LOGGED_IN";//Accesso riservato agli uteti autenticati
else echo "LOGGED_IN";
?>