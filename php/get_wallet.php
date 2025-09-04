<?php
include 'conn.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$userId = $_GET['user_id'] ?? null;

if (!$userId || !is_numeric($userId)) {
    http_response_code(400);
    exit(json_encode([
        'success' => false,
        'error' => 'Valid User ID required'
    ]));
}

try {
    $sql = "SELECT id, address, txid, created_at FROM user_wallets WHERE user_id = ? LIMIT 1";
    $stmt = mysqli_prepare($conn, $sql);
    
    if (!$stmt) {
        throw new Exception('Database prepare failed: ' . mysqli_error($conn));
    }
    
    mysqli_stmt_bind_param($stmt, "i", $userId);
    
    if (!mysqli_stmt_execute($stmt)) {
        throw new Exception('Database execute failed: ' . mysqli_stmt_error($stmt));
    }
    
    $result = mysqli_stmt_get_result($stmt);
    
    if ($row = mysqli_fetch_assoc($result)) {
        echo json_encode([
            'success' => true,
            'wallet' => [
                'id' => (int)$row['id'],
                'address' => $row['address'],
                'txid' => $row['txid'],
                'created_at' => $row['created_at'],
            ],
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Wallet not ready yet',
            'user_id' => (int)$userId,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    }
    
    mysqli_stmt_close($stmt);
    
} catch (Exception $e) {
    error_log("get_wallet.php error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Internal server error',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
} finally {
    if (isset($conn)) {
        mysqli_close($conn);
    }
}
?>
