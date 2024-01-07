//Recupero il button goback nella pagina e gli metto un eventlistener
document.getElementById("goback").addEventListener("click", function(){
    //recupero la pagina di provenienza con document.referrer
    var paginaProvenienza = document.referrer;

        //controllo pagina di provenienza se è una delle 3 vado comunque nell'index.php
        if (paginaProvenienza.includes('login.html') || paginaProvenienza.includes('index.php') || paginaProvenienza.includes('register.html') ){
            window.location.href = 'index.php';
        }
        else{
            window.history.back(); // Altrimenti, comportamento predefinito 
        }

    });