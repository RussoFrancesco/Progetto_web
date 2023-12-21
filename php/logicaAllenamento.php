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

    //riempio allenamenti_esercizi
    $input=json_decode(file_get_contents('php://input'), true);
    $query="INSERT INTO `a_e`(`allenamento`, `esercizio`, `peso`) VALUES (?,?,?)";
    
    foreach($input as $esercizio => $peso){
        $stmt=mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt,"isi", $newAllenamentoID, $esercizio, $peso);
        mysqli_stmt_execute($stmt);
    }

    echo "ok";
       
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
    $rows[] = $id_scheda;
    $rows=json_encode($rows);
    echo $rows;

}elseif($method=='GET' && $table=="allenamenti" && $request[0]=="storico"){
    $query="SELECT * FROM allenamenti WHERE user=? ORDER BY `data` DESC";
    $stmt=mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt,'i',$user);
    mysqli_stmt_execute($stmt);
    $result=mysqli_stmt_get_result($stmt);
    $rows=[];
    while($row=mysqli_fetch_assoc($result)){
        $rows[]=$row;
    }
    $rows=json_encode($rows);
    echo $rows;

}elseif($method=='GET' && $table=="a_e" && isset($request[0])){
    $id_allenamento=array_shift($request);
    
    //query 1 verfichimo che l'user richieda un allenamento di sua proprietà e salviamo l'id della scheda
        $query="SELECT scheda FROM allenamenti WHERE id=? AND user=?";
        $stmt=mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt,'ii',$id_allenamento, $user);
        mysqli_stmt_execute($stmt);

        $result=mysqli_stmt_get_result($stmt);
        $num_rows=mysqli_num_rows($result);

        if($num_rows==0){
            echo "ERROR";
        }

        $row=mysqli_fetch_assoc($result);
        $id_scheda=$row['scheda'];
        
    //query 2 recuperiamo tutti gli esercizi dell'allenamento
    $query="SELECT a_e.esercizio,a_e.allenamento,a_e.peso,esercizi.gruppo 
    FROM `a_e`,esercizi 
    WHERE esercizi.nome=a_e.esercizio AND allenamento=? ORDER BY esercizi.gruppo";

    $stmt=mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt,'i', $id_allenamento);
    mysqli_stmt_execute($stmt);
    $result=mysqli_stmt_get_result($stmt);
    $rows=[];
    while($row=mysqli_fetch_assoc($result)){
        $rows[]=$row;
    }
    $json=json_encode($rows);
    echo $json;
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