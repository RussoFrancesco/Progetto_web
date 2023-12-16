document.getElementById("goback").addEventListener("click", function(){
    var paginaProvenienza = document.referrer;

        //controllo pagina di provenienza
        if (paginaProvenienza.includes('login.html') || paginaProvenienza.includes('index.php') || paginaProvenienza.includes('register.html') ){
            window.location.href = 'index.php';
        }
        else{
            window.history.back(); // Altrimenti, comportamento predefinito 
        }

    });