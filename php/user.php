<?php
session_start();

include 'conn.php';
include 'getUserFromSession.php';
include 'jwt.php';

// Verifica il metodo e il percorso inseriti
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'], '/'));
$table = preg_replace('/[^a-z0-9_]+/i', '', array_shift($request));

if(!validateToken()){
    echo "Denied";
}
else{
    //recupero l'user dal sessionID attuale 
        if ($table == "users" and $method =="GET") {
        $query="SELECT * FROM users where session_id =?";
        $stmt = mysqli_prepare($conn, $query);

        if ($stmt) {
            mysqli_stmt_bind_param($stmt, "s", session_id());
            mysqli_stmt_execute($stmt);

            $res = mysqli_stmt_get_result($stmt);
            $num_rows = mysqli_num_rows($res);

            if ($num_rows==1){
                //recuopero i dati restituiti dal db 
                $user_data = mysqli_fetch_assoc($res);
                //li metto in una stringa in formato JSON
                $user_object = json_encode($user_data);
                echo $user_object;
            }
            else{
                echo "ERROR";
            }

        
        }
    }//modifica User
    elseif($table=="users" and $method=="PUT"){
        //recuoero l'input e lo assegno alle variabili 
        $input = json_decode(file_get_contents('php://input'),true);
        $nome=$input["nome"];
        $cognome=$input["cognome"];
        $email=$input["email"];
        $phone=$input["phone"];
        $userid=getUserFromSession($conn);

        //Controllo che se è stata inserita, la nuova mail non sia gia presente nel db 
        $query = "SELECT email,id as user FROM users WHERE email=?";
        $stmt = mysqli_prepare($conn,$query);
        mysqli_stmt_bind_param($stmt, "s", $email);
        mysqli_stmt_execute($stmt);
        $result=mysqli_stmt_get_result($stmt);
        $row=mysqli_fetch_assoc($result);
        //se c'è gia nel db ritorno l'email
        if($row['user']!=$userid){
            echo "email";
        }
        //altrimenti faccio la query di update 
        else{
            //faccio la query di Update
            $query="UPDATE `users` SET `nome`=?,`cognome`=?,`email`=?,`telefono`=? WHERE id=? ";
            $stmt=mysqli_prepare($conn,$query);
            mysqli_stmt_bind_param($stmt,"ssssi",$nome,$cognome,$email,$phone,$userid);
            mysqli_stmt_execute($stmt);
            $rows = mysqli_stmt_affected_rows($stmt);

            if ($rows==1){
                echo "OK";
            }
            else{
                echo "ERROR";
            }
        }
    }//query per eliminare l'utente
    elseif($table == "users" and $method=="DELETE"){
        $userid = getUserFromSession($conn);

        $query = "DELETE FROM `users` WHERE id=?";
        $stmt = mysqli_prepare($conn, $query);

        if ($stmt) {
            mysqli_stmt_bind_param($stmt, "i", $userid);
            mysqli_stmt_execute($stmt);
            $rows = mysqli_stmt_affected_rows($stmt);

            if ($rows == 1) {
                echo "eseguita";
            } else {
                echo "Nessuna riga eliminata";
            }

            mysqli_stmt_close($stmt);
        } else {
            echo "Errore nella preparazione dello statement: " . mysqli_error($conn);
        }
    }

}
