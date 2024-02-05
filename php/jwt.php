<?php
require "../vendor/autoload.php";
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


function validateToken(){
    $header = apache_request_headers();
    $token = $header['Token'];
    global $key;
    try{
        $decoded = JWT::decode($token, new Key($key, 'HS256'));
        return true;
    }
    catch(Exception $e){
        return false;
    }
}



