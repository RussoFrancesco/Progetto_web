<?php 
session_start();
include 'conn.php';
include 'getUserFromSession.php';
include 'getSchedaFromUserID.php';
include 'jwt.php';

// Verifica il metodo e il percorso inseriti
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'], '/'));
$table = preg_replace('/[^a-z0-9_]+/i', '', array_shift($request));
$user=getUserFromSession($conn);

if(!validateToken()){
    echo "Denied";
}
//inserimento dell'allenamento nel db
else{
if ($method=='POST' && $table=="allenamenti" && isset($request[0])){
    $data_allenamento=array_shift($request);
    $scheda=getSchedaFromUserID($conn,$user);
    

    //echo "scheda: ".$scheda." user:".$user;
    //query di inseriemento nella tabella allenamenti
    $query="INSERT INTO allenamenti (`data`, `user`, `scheda`) VALUES (?,?,?)";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt,"sii",$data_allenamento,$user, $scheda);
    mysqli_stmt_execute($stmt);
    
    // Recupera l'ID dell'allenamento appena inserito
    $newAllenamentoID = mysqli_insert_id($conn);

    //riempio allenamenti_esercizi
    $input=json_decode(file_get_contents('php://input'), true);
    $query="INSERT INTO `a_e`(`allenamento`, `esercizio`, `peso`) VALUES (?,?,?)";
    
    //eseguo la query per ogni esercizio-peso effettuato
    foreach($input as $esercizio => $peso){
        $stmt=mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt,"isi", $newAllenamentoID, $esercizio, $peso);
        mysqli_stmt_execute($stmt);
    }

    echo "ok";
       
}//recupero esercizi della scheda 
elseif($method=='GET' && $table=="schede"){
    
    //recupero dell'id della scheda attiva dell'user attuale 
    $id_scheda = getSchedaFromUserID($conn,$user);
    
    //query per le info della scheda
    $query="SELECT nome, serie, ripetizioni, recupero, gruppo FROM e_s,esercizi WHERE scheda=? AND esercizi.nome=e_s.esercizio";
    $stmt=mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt,"i", $id_scheda);
    mysqli_stmt_execute($stmt);
    $result=mysqli_stmt_get_result($stmt);
    //creo l'array rows in cui metterò tutti i record
    $rows=[];
    //ciclo per inseire i record in rows
    while($row=mysqli_fetch_assoc($result)){
        $rows[]=$row;
    }
    //inserisco l'id della scheda
    $rows[] = $id_scheda;
    //converto in stringa in formato JSON
    $rows=json_encode($rows);
    //lo ritorno
    echo $rows;

}//recupero degli allenamenti passati
elseif($method=='GET' && $table=="allenamenti" && $request[0]=="storico"){
    //query 
    $query="SELECT * FROM allenamenti WHERE user=? ORDER BY id DESC";
    $stmt=mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt,'i',$user);
    mysqli_stmt_execute($stmt);
    $result=mysqli_stmt_get_result($stmt);
    //array per metterci i record
    $rows=[];
    //ciclo per insierli 
    while($row=mysqli_fetch_assoc($result)){
        $rows[]=$row;
    }
    //formattazione in JSON e risposta al client
    $rows=json_encode($rows);
    echo $rows;

}//recupero gli esercizi di un allenamento
elseif($method=='GET' && $table=="a_e" && isset($request[0])){
    //recupero l'id dall'URI
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
    $query="SELECT a_e.allenamento, a_e.esercizio, a_e.peso, esercizi.gruppo, e_s.serie, e_s.ripetizioni, e_s.recupero, allenamenti.data
    FROM a_e,esercizi,allenamenti,e_s,schede
    WHERE a_e.allenamento=allenamenti.id AND a_e.esercizio=esercizi.nome AND e_s.esercizio=esercizi.nome 
    AND e_s.scheda=schede.id AND schede.id=allenamenti.scheda AND allenamenti.id=?";

    $stmt=mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt,'i', $id_allenamento);
    mysqli_stmt_execute($stmt);
    $result=mysqli_stmt_get_result($stmt);
    //array rows per salvare i record
    $rows=[];
    //ciclo per inserirli 
    while($row=mysqli_fetch_assoc($result)){
        $rows[]=$row;
    }
    //creo il json e lo ritorno
    $json=json_encode($rows);
    echo $json;
}
}
?>