<?php
session_start();

// remove all session variables
session_unset();
// destroy the session
session_destroy();

session_abort();

//Reindirizza alla home page
echo "SESSION_CLOSED";

?>