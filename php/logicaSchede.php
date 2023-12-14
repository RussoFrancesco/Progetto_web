<?php
session_start();
// Connessione al database
include 'conn.php';
// Verifica il metodo e il percorso inseriti
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'], '/'));

// Recupera la tabella dal percorso
$table = preg_replace('/[^a-z0-9_]+/i', '', array_shift($request));


if($method=='GET' && $request[0]=="storico" && $table=='schede'){

    $id_user=getUserFromSession();

    $query="SELECT schede.id as id_scheda, data_inizio,data_fine
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

    //Query che recupera l'id dell'ultima scheda inserita, utile per avere da parte l'id di una nuova scheda
    $query="SELECT * FROM `schede` ORDER BY id DESC LIMIT 1";
    $stmt=mysqli_prepare($conn, $query);
    mysqli_stmt_execute($stmt);
    $res = mysqli_stmt_get_result($stmt);
    $row=mysqli_fetch_assoc($res);
    $last_id=$row['id'];

    //Recupera i dati da insertare nella tabella schede
    $id_user=getUserFromSession($conn);
    $data_inizio = array_shift($request);
    $id_scheda=$last_id+1;

    //echo $id_scheda.' data '.$data_inizio.' user '.$id_user;

   

    //Query che inserisce i dati nel database nella tabella schede
    $query = "INSERT INTO `schede` (`id`,`data_inizio`,`user`) VALUES (?,?,?)";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "isi",$id_scheda,$data_inizio, $id_user);
    mysqli_stmt_execute($stmt);
    
    

    //Recupero oggetto JSON con esercizi nella scheda 
    $input = json_decode(file_get_contents('php://input'),true);
    $query="INSERT INTO `e_s`(`esercizio`, `scheda`, `n_serie`, `n_rep`, `rec`) VALUES ";
    
    for($i=0; $i<count($input)-1; $i++){
        $query.="(".$input[$i]['nome'].", ".$id_scheda.", ".$input[$i]['n_serie'].
        ", ".$input[$i]['n_rep'].", ".$input[$i]['rec']."),";
    }
    $query.="(".$input[count($input)-1]['nome'].", ".$id_scheda.", ".$input[count($input)-1]['n_serie'].
        ", ".$input[count($input)-1]['n_rep'].", ".$input[count($input)-1]['rec'].")";

   
    echo $query;

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

?>