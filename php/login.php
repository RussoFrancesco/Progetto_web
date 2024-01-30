<?php
// Connessione al database
include 'conn.php';
include 'jwt.php';

// Verifica il metodo e il percorso inseriti
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'], '/'));



// Recupera la tabella dal percorso
$table = preg_replace('/[^a-z0-9_]+/i', '', array_shift($request));

//se la tabella  è users
if ($table == "users") {
    
    //recuopero dell'email e la passrword (mmysqli_real_escape_string crea una stringa valida SQL)
    $email = mysqli_real_escape_string($conn, array_shift($request));
    $password = mysqli_real_escape_string($conn, array_shift($request));

    // Prepared statement per recuperare le info dell'user corrispondente nel db
    $query = "SELECT id,nome,cognome FROM users WHERE email=? AND pswrd=?";
    $stmt = mysqli_prepare($conn, $query);
    
    if ($stmt) {
        mysqli_stmt_bind_param($stmt, "ss", $email, $password);
        mysqli_stmt_execute($stmt);
        
        $res = mysqli_stmt_get_result($stmt);
        
        $num_rows = mysqli_num_rows($res);

        //se è stato trovato il record corrispondente all'user 
        if ($num_rows == 1) {
            $row = mysqli_fetch_array($res);
        
            //AVVIO LA SESSIONE AL LOGIN
            session_start();
            //Rigenero l'id della sessione 
            session_regenerate_id();
            //Lo assegno alla variabile sessionid
            $sessionid=session_id();
            $id=$row['id'];

            //modifico l'id della sessione salvato nel db con quello nuovo 
            $query="UPDATE users SET session_id=? WHERE id=?";
            $stmt=mysqli_prepare($conn, $query);
            mysqli_stmt_bind_param($stmt, "ss", $sessionid, $id);
            mysqli_stmt_execute($stmt);
            
            //Setto variabile di sessione 
            $_SESSION['login'] =true;

            //messaggio all'user 
            echo createToken($id, $email);

        } 
        //caso d'errore
        else {
            echo "ERROR";
        }
    }
    //se c'è errore sullo statement
    else {
        echo "Statement preparation error: " . mysqli_error($conn);
    }
}

?>
