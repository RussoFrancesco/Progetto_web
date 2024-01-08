<?php 
session_start();
include 'conn.php';

// Verifica il metodo e il percorso inseriti
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'], '/'));
$table = preg_replace('/[^a-z0-9_]+/i', '', array_shift($request));
$user=getUserFromSession($conn);

//richiesta di inserimento della misurazione
if($method == 'POST' && $table="bmi" && isset($request[0]) && isset($request[1])){

    //recupero le variabili da inserire
    $bmi = array_shift($request);
    $data = array_shift($request);

    //query per l'inserimento
    $query = "INSERT INTO bmi(user, bmi, data) VALUES (?, ?, ?)";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "ids", $user, $bmi, $data);
    $res = mysqli_stmt_execute($stmt);
    
    //response del server
    if($res){
        echo 'ok';
    }
    else{
        echo 'error';
    }

}
//richiesta di recupero delle misurazioni di un certo utente
elseif($method == "GET" && $table="bmi"){
    $query = "SELECT * FROM bmi WHERE user = ? ORDER by data ASC";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "i", $user);
    mysqli_stmt_execute($stmt);
    $res = mysqli_stmt_get_result($stmt);
    
    
    $labels=[];
    $data=[];

    while($row = mysqli_fetch_assoc($res)){
        $labels[]=$row['data'];
        $data[]=$row['bmi'];
    }

    $rows=[
        "labels"=>$labels,
        "data"=>$data
    ];

    $rows = json_encode($rows);
    echo $rows;

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



?>