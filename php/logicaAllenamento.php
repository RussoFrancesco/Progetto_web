<?php 
session_start();
include 'conn.php';

// Verifica il metodo e il percorso inseriti
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'], '/'));
$table = preg_replace('/[^a-z0-9_]+/i', '', array_shift($request));
$user=getUserFromSession($conn);

if ($method=='POST' && $table=="allenamenti" && isset($request[0])){
    $data_allenamento=array_shift($request);
    $scheda=getSchedaFromUserID($conn,$user);

    //echo "scheda: ".$scheda." user:".$user;
    
    $query="INSERT INTO allenamenti (`data`, `user`, `scheda`) VALUES (?,?,?)";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt,"sii",$data_allenamento,$user, $scheda);
    mysqli_stmt_execute($stmt);
    
    // Recupera l'ID dell'allenamento appena inserito
    $newAllenamentoID = mysqli_insert_id($conn);

    
    
    if (mysqli_stmt_affected_rows($stmt) > 0) {
        $response=array(
            "status" => "ok",
            "id_allenamento" =>  $newAllenamentoID,
            "user" =>$user,
            "scheda" =>$scheda,
            "data_allenamento" =>$data_allenamento,
        );
        echo json_encode($response);
    }
    else{
        echo "ERROR";
    }
}elseif($method=='GET' && $table=="schede"){
    
    $id_scheda = getSchedaFromUserID($conn,$user);
    
    $query="SELECT nome, serie, ripetizioni, recupero, gruppo FROM e_s,esercizi WHERE scheda=? AND esercizi.nome=e_s.esercizio";
    $stmt=mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt,"i", $id_scheda);
    mysqli_stmt_execute($stmt);
    $result=mysqli_stmt_get_result($stmt);
    $rows=[];
    while($row=mysqli_fetch_assoc($result)){
        $rows[]=$row;
    }
    $rows=json_encode($rows);
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