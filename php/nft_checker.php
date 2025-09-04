<?php
require 'conn.php';
require_once '/var/www/html/Progetto_web/vendor/autoload.php';

use CircularProtocol\Api\CircularProtocolAPI;

function logMessage($message) {
    error_log("[" . date('Y-m-d H:i:s') . "] $message");
}

logMessage("Inizio verifica rewards NFT");

try {
    $circular = new CircularProtocolAPI();
    $blockchain = "0x8a20baa40c45dc5055aeb26197c203e576ef389d9acb171bd62da11dc5ad72b2";
    
    $query = "
        SELECT 
            u.id as user_id,
            u.nome,
            u.cognome,
            uw.address as wallet_address,
            COUNT(CASE WHEN ab.outcome = 1 THEN 1 END) as confirmed_workouts
        FROM users u
        JOIN allenamenti a ON u.id = a.user
        JOIN allenamenti_blocks ab ON a.id = ab.id_allenamento
        LEFT JOIN nft n ON u.id = n.id_user AND n.reward_type = 'workout_milestone'
        JOIN user_wallets uw ON u.id = uw.user_id
        WHERE n.id_user IS NULL  -- Non ha ancora ricevuto reward
        AND uw.address IS NOT NULL  -- Solo utenti con wallet
        GROUP BY u.id, u.nome, u.cognome, uw.address
        HAVING confirmed_workouts >= 5
        LIMIT 20
    ";
    
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    $eligible_users = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $eligible_users[] = $row;
    }
    
    logMessage("Trovati " . count($eligible_users) . " utenti idonei per NFT");
    
    foreach ($eligible_users as $user) {
        try {
            logMessage("Processando: {$user['nome']} {$user['cognome']} ({$user['confirmed_workouts']} workout) - Wallet: {$user['wallet_address']}");

            $address     = "0x01faadee1edf7b5ba5673adb28ccf652a42ed1dd942aca65e9ac1cb7cb0e461d";
            $receiver    = $user['wallet_address'];
            $senderPK    = "0x7a4ee12071dfa8388058bce2759ce89410e15e565589de08d4d5b98da4919e31";

            $from       = $circular->hexFix($address);
            $to         = $circular->hexFix($receiver);
            $senderPK   = $circular->hexFix($senderPK);
            $payload    = [
                    "Asset" => "5 Allenamenti Completati",
                    "Amount" => "1",
                    "Action" => "CP_SEND",
                    "Memo" => "NFT Reward for 5+ workouts - " . $user['nome'] . " " . $user['cognome']
                ];

            $payload    = $circular->stringToHex(json_encode($payload));
            $blockchain = $circular->hexFix($blockchain);
            $nonce      = intval($circular->getWalletNonce($blockchain, $from)->Response->Nonce) + 1;
            $timestamp  = $circular->getFormattedTimestamp();
            $id         = hash("sha256", $blockchain . $from . $to . $payload . strval($nonce) . $timestamp, false);
            $signature  = $circular->signMessage($id, $senderPK);
            $type       = "C_TYPE_COIN";
            $data = [
                "ID"         => $id,
                "From"       => $from,
                "To"         => $to,
                "Timestamp"  => $timestamp,
                "Payload"    => strval($payload),
                "Nonce"      => strval($nonce),
                "Signature"  => $signature,
                "Blockchain" => $blockchain,
                "Type"       => $type,
                "Version"    => $circular->getVersion()
            ];
            
            $nftTransaction =$circular->fetch($circular->getNAGURL() . 'Circular_AddTransaction_', $data); 

            logMessage("Risultato invio transazione: " . json_encode($nftTransaction));
            
            if ($nftTransaction && $nftTransaction->Result==200) {
                $insertNFT = "
                    INSERT INTO nft (txid, id_user, reward_type, created_at) 
                    VALUES (?, ?, 'workout_milestone', NOW())
                ";
                
                $stmtNFT = mysqli_prepare($conn, $insertNFT);
                mysqli_stmt_bind_param($stmtNFT, 'si', 
                    $nftTransaction->Response->TxID, 
                    $user['user_id']
                );
                
                if (mysqli_stmt_execute($stmtNFT)) {
                    logMessage("NFT reward assegnato! TXID: {$nftTransaction->Response->TxID} -> {$user['wallet_address']}");
                } else {
                    logMessage("Errore salvataggio NFT: " . mysqli_error($conn));
                }
                
                mysqli_stmt_close($stmtNFT);
            } else {
                logMessage("Errore creazione transazione per user {$user['user_id']}");
            }
            
            sleep(3);
            
        } catch (Exception $e) {
            logMessage("Errore per user {$user['user_id']}: " . $e->getMessage());
        }
    }
    
    logMessage("Processamento completato");
    
} catch (Exception $e) {
    logMessage("Errore critico: " . $e->getMessage());
    exit(1);
}

// ========== 2. HEAVY LIFTER (50kg+) ==========
try {
    $query_heavy = "
        SELECT 
            u.id as user_id,
            u.nome,
            u.cognome,
            uw.address as wallet_address,
            MAX(ae.peso) as max_lifted_weight
        FROM users u
        JOIN allenamenti a ON u.id = a.user
        JOIN allenamenti_blocks ab ON a.id = ab.id_allenamento
        JOIN a_e ae ON a.id = ae.allenamento
        JOIN user_wallets uw ON u.id = uw.user_id
        LEFT JOIN nft n ON u.id = n.id_user AND n.reward_type = 'heavy_lifter'
        WHERE ab.outcome = 1  
          AND uw.address IS NOT NULL
          AND n.id_user IS NULL
        GROUP BY u.id, u.nome, u.cognome, uw.address
        HAVING max_lifted_weight >= 50
        LIMIT 20
    ";
    
    $stmt_heavy = mysqli_prepare($conn, $query_heavy);
    mysqli_stmt_execute($stmt_heavy);
    $result_heavy = mysqli_stmt_get_result($stmt_heavy);
    
    $heavy_lifters = [];
    while ($row = mysqli_fetch_assoc($result_heavy)) {
        $heavy_lifters[] = $row;
    }
    
    logMessage("🏋️ Trovati " . count($heavy_lifters) . " Heavy Lifters idonei");
    
    foreach ($heavy_lifters as $lifter) {
        try {
            logMessage("Processando Heavy Lifter: {$lifter['nome']} {$lifter['cognome']} - Max: {$lifter['max_lifted_weight']}kg");

            $address     = "0x01faadee1edf7b5ba5673adb28ccf652a42ed1dd942aca65e9ac1cb7cb0e461d";
            $receiver    = $lifter['wallet_address'];
            $senderPK    = "0x7a4ee12071dfa8388058bce2759ce89410e15e565589de08d4d5b98da4919e31";

            $from       = $circular->hexFix($address);
            $to         = $circular->hexFix($receiver);
            $senderPK   = $circular->hexFix($senderPK);

            $payload = [
                "Asset" => "Heavy Lifter",
                "Amount" => "1", 
                "Action" => "CP_SEND",
                "Memo" => "Heavy Lifter Achievement"
            ];
            

            $payload    = $circular->stringToHex(json_encode($payload));
            $blockchain = $circular->hexFix($blockchain);
            $nonce      = intval($circular->getWalletNonce($blockchain, $from)->Response->Nonce) + 1;
            $timestamp  = $circular->getFormattedTimestamp();
            $id         = hash("sha256", $blockchain . $from . $to . $payload . strval($nonce) . $timestamp, false);
            $signature  = $circular->signMessage($id, $senderPK);
            $type       = "C_TYPE_COIN";

            $data = [
                "ID"         => $id,
                "From"       => $from,
                "To"         => $to,
                "Timestamp"  => $timestamp,
                "Payload"    => strval($payload),
                "Nonce"      => strval($nonce),
                "Signature"  => $signature,
                "Blockchain" => $blockchain,
                "Type"       => $type,
                "Version"    => $circular->getVersion()
            ];

            $nftTransaction = $circular->fetch($circular->getNAGURL() . 'Circular_AddTransaction_', $data);

            logMessage("Risultato transazione: " . json_encode($nftTransaction));

            if ($nftTransaction && $nftTransaction->Result == 200) {
                $insertNFT = "
                    INSERT INTO nft (txid, id_user, reward_type, created_at) 
                    VALUES (?, ?, 'heavy_lifter', NOW())
                ";

                $stmtNFT = mysqli_prepare($conn, $insertNFT);
                mysqli_stmt_bind_param($stmtNFT, 'si', 
                    $nftTransaction->Response->TxID,
                    $lifter['user_id']
                );

                if (mysqli_stmt_execute($stmtNFT)) {
                    logMessage("Heavy Lifter NFT assegnato! TXID: {$nftTransaction->Response->TxID}");
                } else {
                    logMessage("Errore salvataggio NFT: " . mysqli_error($conn));
                }

                mysqli_stmt_close($stmtNFT);
            } else {
                logMessage("Errore creazione transazione per user {$lifter['user_id']}");
            }

            sleep(3);
        } catch (Exception $e) {
            logMessage("Errore per user {$lifter['user_id']}: " . $e->getMessage());
        }
    }
} catch (Exception $e) {
    logMessage("Errore critico nella verifica Heavy Lifter: " . $e->getMessage());
}


logMessage("Fine verifica rewards");
?>
