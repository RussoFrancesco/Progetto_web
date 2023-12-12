<?php
// Connessione al database
include 'conn.php';
// Verifica il metodo e il percorso inseriti
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'], '/'));

// Recupera la tabella dal percorso
$table = preg_replace('/[^a-z0-9_]+/i', '', array_shift($request));

$eventoRichiesto=array_shift($request);

if($method=='GET' && $eventoRichiesto=="storico" && $table=='schede'){

    $query="SELECT id FROM users where session_id =?";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "s", session_id());
    mysqli_stmt_execute($stmt);

    $res = mysqli_stmt_get_result($stmt);
    $num_rows = mysqli_num_rows($res);
    $row = mysqli_fetch_array($res);
    $id_user = $row['id'];



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


?>