<?php

session_start();
// Connessione al database
include 'conn.php';
// Verifica il metodo e il percorso inseriti
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'], '/'));

// Recupera la tabella dal percorso
$table = preg_replace('/[^a-z0-9_]+/i', '', array_shift($request));
$id_user=getUserFromSession($conn);

if($method=='GET' && $request[0]=="storico" && $table=='schede'){

    

    $query="SELECT schede.id as id_scheda, data_inizio, data_fine
    FROM `schede` 
    WHERE user=? ORDER BY data_fine DESC";
    
    $stmt=mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "i", $id_user);
    mysqli_stmt_execute($stmt);

    $res = mysqli_stmt_get_result($stmt);
    $num_rows = mysqli_num_rows($res);
    
    $rows = array();
    while($row=mysqli_fetch_assoc($res)){
       $rows[] = $row; // Aggiungi ogni riga all'array $rows
    }
    
    echo json_encode($rows);

}
elseif($method=='POST' && $table=='scheda'){

    //Recupera i dati da insertare nella tabella schede
    
    $data_inizio = array_shift($request);

    //echo $id_scheda.' data '.$data_inizio.' user '.$id_user;

   

    //Query che inserisce i dati nel database nella tabella schede
    $query = "INSERT INTO `schede` (`data_inizio`,`user`) VALUES (?,?)";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "si",$data_inizio, $id_user);
    mysqli_stmt_execute($stmt);
    $id_scheda=mysqli_insert_id($conn);
    

    //Recupero oggetto JSON con esercizi nella scheda 
    $input = json_decode(file_get_contents('php://input'),true);
    $query="INSERT INTO `e_s`(`esercizio`, `scheda`, `serie`, `ripetizioni`, `recupero`) VALUES (?,?,?,?,?)";
    
    for($i=0; $i<count($input); $i++){
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, "siiii", $input[$i]["nome"], $id_scheda, $input[$i]["n_serie"], $input[$i]["n_rep"], $input[$i]["rec"]);
        mysqli_stmt_execute($stmt);
    }

    echo "ok";

}//RECUPERO SCHEDA CON ID 
elseif ($method == 'GET' && $table == 'scheda' && isset($request[0]) ) {


    $id_scheda = array_shift($request);
    $query = "SELECT * FROM `schede` WHERE id=? AND user=?";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "ii", $id_scheda, $id_user);
    mysqli_stmt_execute($stmt);
    
    
    //cotrollo errore
    $res = mysqli_stmt_get_result($stmt);
    if ($res && mysqli_num_rows($res) == 1) {
        $row=mysqli_fetch_assoc($res);
        echo json_encode($row);
    }else{
    echo "ERROR";
    }
}
elseif ($method == 'GET' && $table == 'e_s' && $request[0]=='schede' && $request[1]='esercizi' && isset($request[2])) {
    $id_scheda=$request[2];

    $query="SELECT e_s.esercizio,e_s.serie,e_s.ripetizioni,e_s.recupero,esercizi.gruppo
    FROM e_s,schede,esercizi 
    WHERE e_s.scheda=schede.id AND e_s.esercizio=esercizi.nome AND e_s.scheda=?";
    
    $stmt=mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "i", $id_scheda);
    mysqli_stmt_execute($stmt);
    $res = mysqli_stmt_get_result($stmt);
    $rows=[];
    while($row=mysqli_fetch_assoc($res)){
        $rows[]=$row; // Aggiungi ogni riga all'array $rows
    }
    $rows=json_encode($rows);
    echo $rows;
}elseif ($method == 'PUT' && $table == 'schede' && isset($request[0]) && isset($request[1]) && !isset($request[2])) {
    $id_scheda=array_shift($request);
    $data_fine=array_shift($request);
    

    //echo "ID Scheda: $id_scheda, Data Fine: $data_fine, UserID: $userId";

    
    $query="UPDATE `schede` SET `data_fine`=? WHERE id=? AND user=?";
    $stmt=mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "ssi",$data_fine, $id_scheda, $userId);
    mysqli_stmt_execute($stmt);
    if(mysqli_affected_rows($conn) > 0){
        echo "ok";
    }
    else{
        echo "ERROR";
    }
    
}elseif ($method == "GET" && $table == 'esercizi' && isset($request[0])){
    $id_scheda=array_shift($request);

    $query = "SELECT esercizi.nome, esercizi.gruppo FROM esercizi 
              WHERE esercizi.nome NOT IN (SELECT e_s.esercizio
                                            FROM e_s, schede, esercizi 
                                            WHERE e_s.scheda = schede.id 
                                            AND e_s.esercizio = esercizi.nome 
                                            AND e_s.scheda = ?)";
    
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "i", $id_scheda);
    mysqli_stmt_execute($stmt);
    $res = mysqli_stmt_get_result($stmt);
    $rows=[];
    while($row=mysqli_fetch_assoc($res)){
        $rows[]=$row; // Aggiungi ogni riga all'array $rows
    }
    $rows=json_encode($rows);
    echo $rows;

}elseif($method == 'PUT' && $table == 'schede' && isset($request[0]) && isset($request[1]) && isset($request[2])){

    
    $id_scheda=array_shift($request);
    $data_inizio = array_shift($request);
    $input = json_decode(file_get_contents('php://input'),true);

    $query = "DELETE FROM `e_s` WHERE scheda = ?";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "i", $id_scheda);
    mysqli_stmt_execute($stmt);

    //Query che inserisce i dati nel database nella tabella schede
    $query = "INSERT INTO `schede` (`id`,`data_inizio`,`user`) VALUES (?,?,?)";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "isi",$id_scheda,$data_inizio, $id_user);
    mysqli_stmt_execute($stmt);

    $query="INSERT INTO `e_s`(`esercizio`, `scheda`, `serie`, `ripetizioni`, `recupero`) VALUES (?,?,?,?,?)";
    
    for($i=0; $i<count($input); $i++){
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, "siiii", $input[$i]["nome"], $id_scheda, $input[$i]["n_serie"], $input[$i]["n_rep"], $input[$i]["rec"]);
        mysqli_stmt_execute($stmt);
    }

    echo "ok";

}elseif($method == "POST" && $table == "e_s"){
    $id_scheda = getSchedaFromUserID($conn, $id_user);
    
    $nome = array_shift($request);
    $serie = array_shift($request);
    $ripetizioni = array_shift($request);
    $recupero = array_shift($request);
    

    $query="INSERT INTO `e_s`(`esercizio`, `scheda`, `serie`, `ripetizioni`, `recupero`) VALUES (?,?,?,?,?)";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "siiii", $nome, $id_scheda, $serie, $ripetizioni, $recupero);
    $res = mysqli_stmt_execute($stmt);
    
    if($res){
        echo 'ok';
    }
    else{
        echo 'error';
    }
}elseif($method == 'GET' && $table == 'e_s' && $request[0]=='attuale'){
    $id_scheda = getSchedaFromUserID($conn, $id_user);

    $query = "SELECT esercizio FROM e_s WHERE scheda=?";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "i", $id_scheda);
    mysqli_stmt_execute($stmt);
    $res = mysqli_stmt_get_result($stmt);
    $rows = [];

    while($row = mysqli_fetch_array($res)){
        $rows[] = $row;
    }

    $rows=json_encode($rows);
    echo $rows;
        

}elseif ($method == "DELETE" && $table == "e_s" && isset($request[0])){
    $id_scheda = getSchedaFromUserID($conn, $id_user);
    $esercizio = array_shift($request);

    $query = "DELETE FROM e_s WHERE scheda=? AND esercizio=?";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "is", $id_scheda, $esercizio);
    mysqli_stmt_execute($stmt);

    if(mysqli_affected_rows($conn) > 0){
        echo "ok";
    }
    else{
        echo "ERROR";
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

    return "$id_user";
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