<?php 
session_start();
include 'conn.php';

// Verifica il metodo e il percorso inseriti
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'], '/'));
$table = preg_replace('/[^a-z0-9_]+/i', '', array_shift($request));
$user=getUserFromSession($conn);


//recupero gli esercizi dalla tabella esercizi
if($method=="GET" && $table=="esercizi"){
    $query = "SELECT * FROM esercizi ORDER BY gruppo";
    $res = mysqli_query($conn, $query);
    $rows = [];

    //carico l'array rows con i risultati della query
    if($res){
        while($row = mysqli_fetch_array($res)){
            $rows[] = $row;
        }
    }

    $rows = json_encode($rows);
    echo $rows;

}
elseif($method=="GET" && $table=="a_e" && $request[0]=="progressi"){
    
    $query="SELECT allenamenti.data, a_e.peso,a_e.esercizio FROM a_e,allenamenti WHERE user =? AND allenamenti.id=a_e.allenamento";
    $stmt=mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "i", $user);
    mysqli_stmt_execute($stmt);
    $result=mysqli_stmt_get_result($stmt);
    $rows = mysqli_num_rows($result);
    
   
    if ($rows > 0) {
        $randomIndex = rand(0, $rows - 1);
        mysqli_data_seek($result, $randomIndex);

        $exerciseData = mysqli_fetch_assoc($result);
        $selectedExercise = $exerciseData['esercizio'];
        }

        mysqli_data_seek($result, 0);

        $dates = [];
        $weights = [];

        while ($row = mysqli_fetch_assoc($result)) {
            if ($row['esercizio'] === $selectedExercise) {
                $dates[] = $row['data'];
                $weights[] = $row['peso'];
            }
        }

        $json = [
            "esercizio" => $selectedExercise,
            "date" => $dates,
            "pesi" => $weights
        ];

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