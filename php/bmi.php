<?php 

//Avviamo la sessione 
session_start();
//includiamo il file con la connesione al DB 
include 'conn.php'; 
//includiamo il file con la funzione per ottenre l'user id con il session id corrente
include 'getUserFromSession.php';
include 'jwt.php';

// Verifica il metodo e il percorso inseriti
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'], '/'));
//recupero il 1o elemento di request che corrisponde alla tabella, (viene validato)
$table = preg_replace('/[^a-z0-9_]+/i', '', array_shift($request));
//recupero l'user sulla base della 
$user=getUserFromSession($conn);

//richiesta di inserimento della misurazione
//METODO : POST (insert), controllo se sono impostati i valori di reuqest 
if(!validateToken()){
    echo "Denied";
}else{
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
//METODO GET (SELECT)
elseif($method == "GET" && $table=="bmi"){
    // Prepara la query SQL per selezionare i dati dalla tabella 'bmi' per un utente specifico e ordinarli per 'data'
    $query = "SELECT * FROM bmi WHERE user = ? ORDER by data ASC";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "i", $user);
    mysqli_stmt_execute($stmt);
    $res = mysqli_stmt_get_result($stmt);
    
    // Inizializza gli array per memorizzare labels e dati
    $labels=[];
    $data=[];

     // Recupera i dati dal database e memorizzali negli array
    while($row = mysqli_fetch_assoc($res)){
        $labels[]=$row['data'];
        $data[]=$row['bmi'];
    }

    // Memorizza labels e dati in un array 'rows' per poi formattarlo in formato JSON
    $rows=[
        "labels"=>$labels,
        "data"=>$data
    ];

    $rows = json_encode($rows);
    //Torno al client il risultato 
    echo $rows;

}
}





?>