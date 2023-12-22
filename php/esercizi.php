<?php 
session_start();
include 'conn.php';

// Verifica il metodo e il percorso inseriti
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'], '/'));
$table = preg_replace('/[^a-z0-9_]+/i', '', array_shift($request));
$user=getUserFromSession($conn);



if($method="GET" && $table=="esercizi"){
    $query = "SELECT * FROM esercizi ORDER BY gruppo";
    $res = mysqli_query($conn, $query);
    $rows = [];

    if($res){
        while($row = mysqli_fetch_array($res)){
            $rows[] = $row;
        }
    }

    $rows = json_encode($rows);
    echo $rows;

}elseif($method=="GET" && $table=="e_s"){
    
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

function getSchedaFromUserID($conn, $id_user){
    $query="SELECT `id` FROM `schede` WHERE user = ? AND data_fine IS NULL;";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "i", $id_user);
    mysqli_stmt_execute($stmt);

    $res = mysqli_stmt_get_result($stmt);
    $num_rows = mysqli_num_rows($res);

    if ($num_rows==1){
        $row = mysqli_fetch_array($res);
        $id_scheda = $row['id'];
        return $id_scheda;
    }
    else{
        return null;
    }
}

?>