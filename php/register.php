<?php
include 'conn.php';

$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
$input = json_decode(file_get_contents('php://input'),true);
$table = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));


if(isset($input)){
    $columns = preg_replace('/[^a-z0-9_]+/i','',array_keys($input));
    $values = array_map(function ($value) use ($conn) {
    if ($value===null) return null;
    return mysqli_real_escape_string($conn,(string)$value);
  },array_values($input));
}

if(isset($input)){
    $set = '';
    for ($i=0;$i<count($columns);$i++) {
      $set.=($i>0?',':'').'`'.$columns[$i].'`=';
      $set.=($values[$i]===null?'NULL':'"'.$values[$i].'"');
    }
}
  
$sql = "insert into `$table` set $set";

$result = mysqli_query($conn,$sql);

if (!$result) {
    http_response_code(404);
    die(mysqli_error($conn));
}
  
?>