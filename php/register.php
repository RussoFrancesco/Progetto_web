<?php
include 'conn.php';

//recupero array con campi dell'uri l'input (in send()) e la tabella (1o campo che viene validato)
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
$input = json_decode(file_get_contents('php://input'),true);
$table = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));

//se c'è l'input 
if(isset($input)){
    //recupero le chiavi del JSON che saranno le colonne 
    $columns = preg_replace('/[^a-z0-9_]+/i','',array_keys($input));
    //recupero i valori 

    // Applica mysqli_real_escape_string a ciascun valore dell'array $input per prevenire attacchi di tipo SQL injection
    //array_map esegue la funzione per ogni valore dell'array 
    $values = array_map(function ($value) use ($conn) {
    if ($value===null) return null;
    return mysqli_real_escape_string($conn,(string)$value);
  },array_values($input));
}

//se l'array $input è definito per procedere con la costruzione della query 
if(isset($input)){
    // Inizializzazione di una stringa vuota 
    $set = '';
    // Aggiunta delle colonne con i rispettivi valori al set di aggiornamento (SET clause)
    for ($i=0;$i<count($columns);$i++) {
      // Aggiunta delle colonne con i rispettivi valori al set di aggiornamento (SET clause)
      $set.=($i>0?',':'').'`'.$columns[$i].'`=';
      // Verifica se il valore è nullo; se sì, viene aggiunto come NULL, altrimenti viene aggiunto come stringa racchiusa tra virgolette
      $set.=($values[$i]===null?'NULL':'"'.$values[$i].'"');
    }
}

// Costruzione della query SQL di inserimento
$sql = "insert into `$table` set $set";

$result = mysqli_query($conn,$sql);

if (!$result) {
   // Se la query ha fallito, restituisce un errore 404 con il messaggio di errore di MySQL
    http_response_code(404);
    die(mysqli_error($conn));
}
  
?>