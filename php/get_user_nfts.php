<?php
session_start();
require 'conn.php';
require 'jwt.php';
include 'getUserFromSession.php';
require '../vendor/autoload.php';

use CircularProtocol\Api\CircularProtocolAPI;

$user_id = getUserFromSession($conn);

try {
    $query = "SELECT txid, reward_type, created_at FROM nft WHERE id_user = ? ORDER BY created_at DESC";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, 'i', $user_id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    $circular = new CircularProtocolAPI();
    $blockchain = "0x8a20baa40c45dc5055aeb26197c203e576ef389d9acb171bd62da11dc5ad72b2";

    $nfts = [];

    while ($row = mysqli_fetch_assoc($result)) {
        $txid = $row['txid'];
        $txDetails = $circular->getTransactionOutcome($blockchain, $txid, 20);

        // ✅ Nuova struttura JSON: dati direttamente nella root
        if ($txDetails && isset($txDetails->Status) && $txDetails->Status === 'Executed') {
            $payloadHex = $txDetails->Payload ?? null;
            
            if ($payloadHex) {
                // Decodifica il payload da hex a JSON
                $payloadJson = hex2bin($payloadHex);
                $payload = json_decode($payloadJson, true);

                $row['asset'] = $payload['Asset'] ?? null;
                $row['amount'] = $payload['Amount'] ?? null;

                // Recupera URL dell'asset se disponibile
                if (!empty($row['asset'])) {
                    try {
                        $assetData = $circular->getAsset($blockchain, $row['asset']);
                        $row['url'] = $assetData->Response->URL;
                        error_log("Asset URL per '{$row['asset']}': " . ($row['url'] ?? 'NULL'));
                    } catch (Exception $e) {
                        error_log("getAsset fallito per '{$row['asset']}': " . $e->getMessage());
                        $row['url'] = null;
                    }
                } else {
                    $row['url'] = null;
                }
            } else {
                // Payload vuoto
                $row['asset'] = null;
                $row['amount'] = null;
                $row['url'] = null;
                $row['memo'] = null;
            }
        } else {
            // Transazione non eseguita o fallita
            $row['asset'] = null;
            $row['amount'] = null;
            $row['url'] = null;
            $row['memo'] = null;
            $row['status'] = $txDetails->Status ?? 'Unknown';
        }

        $nfts[] = $row;
    }

    echo json_encode([
        'success' => true,
        'nfts' => $nfts,
        'count' => count($nfts)
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Errore nel recupero degli NFT: ' . $e->getMessage()
    ]);
}
?>
