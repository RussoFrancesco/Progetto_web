<?php
require 'conn.php';
require_once '/var/www/html/Progetto_web/vendor/autoload.php';

use CircularProtocol\Api\CircularProtocolAPI;
try {
    $query = "SELECT txid FROM allenamenti_blocks WHERE outcome IS NULL";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $circular = new CircularProtocolAPI();
    $blockchain = "8a20baa40c45dc5055aeb26197c203e576ef389d9acb171bd62da11dc5ad72b2";

    $found = false;
    while ($row = mysqli_fetch_assoc($result)) {
        $found = true;
        $txid = $row['txid'];
        
        $blockData = $circular->getTransactionOutcome($blockchain, $txid, 10000);
        
        if ($blockData && isset($blockData->Status)) {
            
            //Transazione Eseguita con successo
            if ($blockData->Status === "Executed" && isset($blockData->BlockID)) {
                $transaction_outcome = 1;
                $updateQuery = "UPDATE allenamenti_blocks SET outcome = ?, block = ? WHERE txid = ?";
                $updateStmt = mysqli_prepare($conn, $updateQuery);
                mysqli_stmt_bind_param($updateStmt, "iss", $transaction_outcome, $blockData->BlockID, $txid);
                mysqli_stmt_execute($updateStmt);
                mysqli_stmt_close($updateStmt);
                
                error_log("Updated txid: " . $txid . " with status: Executed, BlockID: " . $blockData->BlockID);
            }
            
            //Transazione Rifiutata
            elseif (strpos($blockData->Status, "Rejected") !== false) {
                $transaction_outcome = 0;
                $updateQuery = "UPDATE allenamenti_blocks SET outcome = ? WHERE txid = ?";
                $updateStmt = mysqli_prepare($conn, $updateQuery);
                mysqli_stmt_bind_param($updateStmt, "is", $transaction_outcome, $txid);
                mysqli_stmt_execute($updateStmt);
                mysqli_stmt_close($updateStmt);
                
                error_log("Updated txid: " . $txid . " with status: Rejected - " . $blockData->Status);
            }
            
            //Transazione Pending o altri stati - NON aggiornare
            else {
                error_log("⏳ Txid: " . $txid . " still pending - Status: " . $blockData->Status);
            }
            
        } else {
            error_log("Invalid blockchain response for txid: " . $txid);
        }
    }
    
    // Log quando non ci sono transazioni da controllare
    if (!$found) {
        error_log("No transactions found to check.");
    }
    
    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    
} catch (Exception $e) {
    error_log("Error: " . $e->getMessage());
    if (isset($stmt)) {
        mysqli_stmt_close($stmt);
    }
    if (isset($conn)) {
        mysqli_close($conn);
    }
}
?>
