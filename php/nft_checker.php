<?php
require 'conn.php';
require_once '/var/www/html/Progetto_web/vendor/autoload.php';

use CircularProtocol\Api\CircularProtocolAPI;

function logMessage($message) {
    echo "[" . date('Y-m-d H:i:s') . "] $message\n";
}

logMessage("🚀 Inizio verifica rewards NFT");

try {
    $circular = new CircularProtocolAPI();
    $blockchain = "0x8a20baa40c45dc5055aeb26197c203e576ef389d9acb171bd62da11dc5ad72b2";
    
    // 1. Query aggiornata per recuperare anche wallet_address
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
    
    logMessage("👥 Trovati " . count($eligible_users) . " utenti idonei per NFT");
    
    foreach ($eligible_users as $user) {
        try {
            logMessage("🎯 Processando: {$user['nome']} {$user['cognome']} ({$user['confirmed_workouts']} workout) - Wallet: {$user['wallet_address']}");

            $address     = "0x01faadee1edf7b5ba5673adb28ccf652a42ed1dd942aca65e9ac1cb7cb0e461d";
            $receiver    = $user['wallet_address'];  // ✅ Ora usa l'indirizzo wallet dell'utente
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
            
            // 2. Invia la transazione NFT reward
            $nftTransaction =$circular->fetch($circular->getNAGURL() . 'Circular_AddTransaction_', $data); 

            logMessage("Risultato invio transazione: " . json_encode($nftTransaction));
            
            if ($nftTransaction && $nftTransaction->Result==200) {
                // 3. Salva nella tabella NFT usando la tua struttura
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
                    logMessage("🎁 NFT reward assegnato! TXID: {$nftTransaction->Response->TxID} -> {$user['wallet_address']}");
                } else {
                    logMessage("❌ Errore salvataggio NFT: " . mysqli_error($conn));
                }
                
                mysqli_stmt_close($stmtNFT);
            } else {
                logMessage("❌ Errore creazione transazione per user {$user['user_id']}");
            }
            
            // Rate limiting
            sleep(3);
            
        } catch (Exception $e) {
            logMessage("💥 Errore per user {$user['user_id']}: " . $e->getMessage());
        }
    }
    
    logMessage("📊 Processamento completato");
    
} catch (Exception $e) {
    logMessage("💥 Errore critico: " . $e->getMessage());
    exit(1);
}

logMessage("🏁 Fine verifica rewards");
?>
