window.onload=bindEvents();

function bindEvents (){
    document.getElementById("login_button").addEventListener("click", loginProcedure);
}


function loginProcedure (){

    //recupero valori inseriti nel form
    var email=document.getElementById("email").value;
    var password=document.getElementById("password").value;

    password=email.substring(0,5)+password;

    password=sha256(password);


    var req=new XMLHttpRequest();
    console.log("req");
    req.onload=function () {
        
        if(req.status==200 && this.responseText== "OK"){
            window.location.href="index.html";
        }
        else{

            var divElement = document.getElementById("messaggio_errore");
            // Aggiunta delle classi al div
            divElement.className = "alert alert-danger";
            divElement.innerHTML="Email o password non validi";
        }

    }
    

    req.open("get","php/login.php/users/"+email+"/"+password+"/",true);

    console.log("connessione");

    req.send();
    
}



