<?php
// Inizio la sessione 
session_start();

// Includo la connessione al db
include 'conn.php';

try {
    // Ottieni session ID corrente per evitare il warning "Only variables should be passed by reference"
    $current_session_id = session_id();
    
    // Verifica che ci sia una connessione database
    if (!$conn) {
        error_log("Database connection failed during logout");
    } else {
        // Rendi il session id del db NULL
        $query = "UPDATE users SET session_id=NULL WHERE session_id=?";
        $stmt = mysqli_prepare($conn, $query);
        
        if ($stmt) {
            mysqli_stmt_bind_param($stmt, "s", $current_session_id);
            mysqli_stmt_execute($stmt);
            
            // Log per debug (opzionale)
            $affected_rows = mysqli_affected_rows($conn);
            if ($affected_rows > 0) {
                error_log("Session cleared for user with session_id: $current_session_id");
            }
        } else {
            error_log("Failed to prepare statement for session cleanup");
        }
    }
    
} catch (mysqli_sql_exception $e) {
    error_log("Database error during logout: " . $e->getMessage());
} catch (Exception $e) {
    error_log("General error during logout: " . $e->getMessage());
}

// Rimuovi le variabili di sessione 
session_unset();

// Distruggi la sessione
session_destroy();

// session_abort() è deprecato in PHP 8.2, sostituito da session_destroy()
// Non è più necessario chiamarlo dopo session_destroy()

// Response al client (mantiene struttura originale)
echo "SESSION_CLOSED";

?>
