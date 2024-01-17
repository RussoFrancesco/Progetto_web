<?php

session_start();
// Connessione al database
include 'conn.php';
//import delle funzioni uili
include 'getUserFromSession.php';
include 'getSchedaFromUserID.php';

// Verifica il metodo e il percorso inseriti
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'], '/'));

// Recupera la tabella dal percorso
$table = preg_replace('/[^a-z0-9_]+/i', '', array_shift($request));
//recupero l'id dell'user
$id_user=getUserFromSession($conn);

//RECUPERO STORICO DELLE SCHEDE (da mostrare nella pagina schede.php)
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

}//inserimento della scheda 
elseif($method=='POST' && $table=='scheda'){

    //Recupera i dati da inserire nella tabella schede
    
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
    
    //faccio un ciclo con più query per inserire tutti gli esercizi sulla scheda selezionata  
    for($i=0; $i<count($input); $i++){
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, "siiii", $input[$i]["nome"], $id_scheda, $input[$i]["n_serie"], $input[$i]["n_rep"], $input[$i]["rec"]);
        mysqli_stmt_execute($stmt);
    }

    //messaggio mandato al client
    echo "ok";

}//RECUPERO DELLA SCHEDA CON ID PASSATO DALL'URI (per vedere quelle passate)
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
//select degli esercizi da una scheda, con id passato dall'URI
elseif ($method == 'GET' && $table == 'e_s' && $request[0]=='schede' && $request[1]='esercizi' && isset($request[2])) {
    $id_scheda=$request[2];

    // query
    $query="SELECT e_s.esercizio,e_s.serie,e_s.ripetizioni,e_s.recupero,esercizi.gruppo
    FROM e_s,schede,esercizi 
    WHERE e_s.scheda=schede.id AND e_s.esercizio=esercizi.nome AND e_s.scheda=?";
    
    $stmt=mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "i", $id_scheda);
    mysqli_stmt_execute($stmt);
    $res = mysqli_stmt_get_result($stmt);

    //inserimento in un array formattato in JSON che poi viene restitutito
    $rows=[];
    while($row=mysqli_fetch_assoc($res)){
        $rows[]=$row; // Aggiungi ogni riga all'array $rows
    }
    $rows=json_encode($rows);
    echo $rows;
}
//modifica in cui settiamo la data di fine
elseif ($method == 'PUT' && $table == 'schede' && isset($request[0]) && isset($request[1]) && !isset($request[2])) {
    
    //recuepero variabili dall'URI
    $id_scheda=array_shift($request);
    $data_fine=array_shift($request);
    
    //echo "ID Scheda: $id_scheda, Data Fine: $data_fine, UserID: $userId";

    //  query
    $query="UPDATE `schede` SET `data_fine`=? WHERE id=? AND user=?";
    $stmt=mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "ssi",$data_fine, $id_scheda, $id_user);
    mysqli_stmt_execute($stmt);
    if(mysqli_affected_rows($conn) > 0){
        echo "ok";
    }
    else{
        echo "ERROR";
    }
    
}
//query per recuperare gli esercizi non inseriti nella scheda
elseif ($method == "GET" && $table == 'esercizi' && isset($request[0])){
    $id_scheda=array_shift($request);

    // Query per selezionare i nomi degli esercizi e i loro gruppi che NON sono associati alla scheda scelta 
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

}
//modifica della scheda
elseif($method == 'PUT' && $table == 'schede' && isset($request[0]) && isset($request[1]) && isset($request[2])){

    
    $id_scheda=array_shift($request);
    $data_inizio = array_shift($request);
    //inpur mandato nel send() della richiesta AJAX 
    $input = json_decode(file_get_contents('php://input'),true);

    $query = "DELETE FROM `e_s` WHERE scheda = ?";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "i", $id_scheda);
    mysqli_stmt_execute($stmt);

    $query="INSERT INTO `e_s`(`esercizio`, `scheda`, `serie`, `ripetizioni`, `recupero`) VALUES (?,?,?,?,?)";
    
    for($i=0; $i<count($input); $i++){
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, "siiii", $input[$i]["nome"], $id_scheda, $input[$i]["n_serie"], $input[$i]["n_rep"], $input[$i]["rec"]);
        mysqli_stmt_execute($stmt);
    }

    echo "ok";

}
//Inserimento dell'esercizio nella tabella e_s 
elseif($method == "POST" && $table == "e_s"){
    $id_scheda = getSchedaFromUserID($conn, $id_user);
    
    //recupero valori dall'URI
    $nome = array_shift($request);
    $serie = array_shift($request);
    $ripetizioni = array_shift($request);
    $recupero = array_shift($request);
    
    //query
    $query="INSERT INTO `e_s`(`esercizio`, `scheda`, `serie`, `ripetizioni`, `recupero`) VALUES (?,?,?,?,?)";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "siiii", $nome, $id_scheda, $serie, $ripetizioni, $recupero);
    $res = mysqli_stmt_execute($stmt);
    
    //risposta
    if($res){
        echo 'ok';
    }
    else{
        echo 'error';
    }
}
//recupero gli esercizi della scheda attuale
elseif($method == 'GET' && $table == 'e_s' && $request[0]=='attuale'){
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
        

}
//Eliminazione dell'esercizio dalla scheda
elseif ($method == "DELETE" && $table == "e_s" && isset($request[0])){
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

?>