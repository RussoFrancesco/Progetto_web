//funzione che attiva i 2 comportamenti
let token;
token = document.cookie.split(';')[0].split('=')[1];
function home(){
    userinfo(); //recupero info dell'user
    document.getElementById("logout_button").addEventListener("click", logoutProcedure);
}

function userinfo() {    
    var user = document.getElementById("span_user"); //recupero lo span_user nella topbar 
    req = new XMLHttpRequest();

    req.onload = function() {
        console.log(this.responseText);
        user.innerHTML = this.responseText; //setto l'inner HTML con il nome ed il cognome tornati dal db
    }

    req.open("GET", "php/home.php/users/", true);
    req.setRequestHeader('Token', token);
    req.send();
}


//funzione per attivare il bottone di logout, e attivare la procedura di logout
function logoutProcedure(){
    console.log("logout");
    req=new XMLHttpRequest();
    req.onload=function () {
        if (req.status==200 && req.responseText=="SESSION_CLOSED"){
            window.location.href ='login.html';
        } 
    }
    req.open("get","php/logout.php",true);
    req.setRequestHeader('Token', token);
    req.send();
}