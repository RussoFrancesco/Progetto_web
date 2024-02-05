window.onload=bindEvents();

function bindEvents (){
    console.log(document.cookie);
    document.getElementById("login_button").addEventListener("click", loginProcedure);
}

//funzione per il login 
function loginProcedure (){

    //recupero valori inseriti nel form
    var email=document.getElementById("email").value;
    var password=document.getElementById("password").value;

    //modifico la password col sale e la cifro
    password=email.substring(0,5)+password;
    password=sha256(password); 


    var req=new XMLHttpRequest();
    //console.log("req");
    req.onload=function () {
    
    // Se lo stato della richiesta è 200 (OK) e la risposta non è "ERROR"
    // Reindirizza l'utente alla pagina index.php
    if(req.status==200 && this.responseText!= "ERROR"){
            console.log(this.responseText);
            document.cookie = "token="+this.responseText;
            window.location.href="index.php";
        }
    else{
            var divElement = document.getElementById("messaggio_errore");
            // Aggiunta delle classi al div
            divElement.className = "alert alert-danger";
            divElement.innerHTML="Email o password non validi";
        }

    }
    
    //Richiesta AJAX al server (la password è cifrata)
    req.open("get","php/login.php/users/"+email+"/"+password+"/",true);

    console.log("connessione");

    req.send();
    
}



