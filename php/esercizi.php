<?php 
//Inizio la sessione
session_start();
//includo i file per connesione e quello con la funzione per ottenere l'user id dal session id corrente
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
//recupero gli esercizi dalla tabella esercizi
// Se il metodo è GET e la tabella è "esercizi"
else{
if($method=="GET" && $table=="esercizi"){
    // Query per selezionare tutti i dati dalla tabella 'esercizi' ordinati per 'gruppo'
    $query = "SELECT * FROM esercizi ORDER BY gruppo";
    $res = mysqli_query($conn, $query);
    $rows = [];

    // Carica l'array 'rows' con i risultati della query
    if($res){
        while($row = mysqli_fetch_array($res)){
            $rows[] = $row;
        }
    }

    //
    $rows = json_encode($rows);
    echo $rows;

}
//se il metodo è get la tabella è a_e e l'elemento dell'uri successivo alla table
//metodo utilizzato per il grafico della dashboard sui progressi
elseif($method=="GET" && $table=="a_e" && $request[0]=="progressi"){
    //eseguo query
    $query="SELECT allenamenti.data, a_e.peso,a_e.esercizio FROM a_e,allenamenti WHERE user =? AND allenamenti.id=a_e.allenamento";
    $stmt=mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "i", $user);
    mysqli_stmt_execute($stmt);
    $result=mysqli_stmt_get_result($stmt);
    $rows = mysqli_num_rows($result);
    
   //se ci sono record tornati dalla query
    if ($rows > 0) {
        //vado a prendere un indice random
        $randomIndex = rand(0, $rows - 1);
        //con mysqli_data_seek vado a trovare il record in posizione i 
        mysqli_data_seek($result, $randomIndex);
        //recupero i dati dell'eserzio 
        $exerciseData = mysqli_fetch_assoc($result);
        $selectedExercise = $exerciseData['esercizio'];
        }

        mysqli_data_seek($result, 0);

        //recupero date ed pesi utilizzati per l'esercizio
        $date = [];
        $weights = [];

        //controllo tutti i record tornati
        while ($row = mysqli_fetch_assoc($result)) {
            //se l'esercizio coinvolto nel record è quello selezionato
            if ($row['esercizio'] === $selectedExercise) {
                //Salvo i dati negli array
                $dates[] = $row['data'];
                $weights[] = $row['peso'];
            }
        }
        //creo un json del tipio {esercizio:"nome",date:["d1","d2"], pesi:["2","3"]}
        $json = [
            "esercizio" => $selectedExercise,
            "date" => $dates,
            "pesi" => $weights
        ];

        //ritorno la stringa in formato JSON 
        echo json_encode($json);

}elseif($method=="GET" && $table=="a_e" && $request[0]=="gruppi"){
        $query="SELECT esercizi.gruppo, COUNT(*) as occorrenze 
            FROM `a_e`,allenamenti,esercizi 
            WHERE esercizi.nome=a_e.esercizio AND a_e.allenamento=allenamenti.id AND allenamenti.user=? 
            GROUP BY esercizi.gruppo";
        $stmt=mysqli_prepare($conn,$query);
        mysqli_stmt_bind_param($stmt,"i",$user);
        mysqli_stmt_execute($stmt);

        $res = mysqli_stmt_get_result($stmt);
        
        $rows=[];

        while ($row = mysqli_fetch_array($res)){
            $rows[$row["gruppo"]] = $row["occorrenze"];
        }

        echo json_encode($rows);
        
    }  
}
?>