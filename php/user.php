<?php
session_start();

include 'conn.php';

// Verifica il metodo e il percorso inseriti
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'], '/'));
$table = preg_replace('/[^a-z0-9_]+/i', '', array_shift($request));



if ($table == "users" and $method =="GET") {
    $query="SELECT * FROM users where session_id =?";
    $stmt = mysqli_prepare($conn, $query);

    if ($stmt) {
        mysqli_stmt_bind_param($stmt, "s", session_id());
        mysqli_stmt_execute($stmt);

        $res = mysqli_stmt_get_result($stmt);
        $num_rows = mysqli_num_rows($res);

        if ($num_rows==1){
            $user_data = mysqli_fetch_assoc($res);
            $user_object = json_encode($user_data);
            echo $user_object;
        }
        else{
            echo "ERROR";
        }

     
    }
}elseif($table=="users" and $method=="PUT"){
    $input = json_decode(file_get_contents('php://input'),true);
    $nome=$input["nome"];
    $cognome=$input["cognome"];
    $email=$input["email"];
    $phone=$input["phone"];
    $userid=getUserFromSession($conn);

    $query = "SELECT email FROM users WHERE email = ?";
    $stmt = mysqli_prepare($conn,$query);
    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);
    $rows = mysqli_stmt_affected_rows($stmt);
    if($rows!=0){
        echo "email";
    }
    else{
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
}


function getUserFromSession($conn){
    $query="SELECT id FROM users where session_id =?";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "s", session_id());
    mysqli_stmt_execute($stmt);

    $res = mysqli_stmt_get_result($stmt);
    $num_rows = mysqli_num_rows($res);
    $row = mysqli_fetch_array($res);
    $id_user = $row['id'];

    return $id_user;
}