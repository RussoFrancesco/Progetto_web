<?php
require "vendor/autoload.php";
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$key = "baxjkbxsb";

function createToken($id, $email){
    global $key;
    $payload = [
        'id' => $id,
        'email' => $email
    ];

    $jwt = JWT::encode($payload, $key, 'HS256');
    return $jwt;
}


function validateToken($jwt){
    global $key;
    try{
        $decoded = JWT::decode($jwt, new Key($key, 'HS256'));
        echo json_encode(array( 
			"message" => "Access granted:"
		));
    }
    catch(Exception $e){
        echo json_encode(array( 
			"message" => "Access denied.", 
			"error" => $e->getMessage() 
		)); 
    }
}



