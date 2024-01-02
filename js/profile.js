var firstNamefield=document.getElementById("FirstName");
var lastnamefield=document.getElementById("LastName");
var emailfield=document.getElementById("Email");
var phonefield=document.getElementById("Phone");

var nomeModificato=false;
var cognomeModificato=false;
var emailModificata=false;
var phoneModificato=false;

window.onload=bindEvent();

function bindEvent(){
    home();
    compilaForm();    
    
    firstNamefield.addEventListener("change",function(){nomeModificato=true;});
    lastnamefield.addEventListener("change",function(){cognomeModificato=true;});
    emailfield.addEventListener("change",function(){emailModificata=true;});
    phonefield.addEventListener("change",function(){phoneModificato=true;});

    document.getElementById("button_modifica").addEventListener("click",modifica);
}


function compilaForm(){
    req=new XMLHttpRequest();
    req.onload=function () {
        if (req.status==200 ){
            user=JSON.parse(req.responseText);
            firstNamefield.value=user.nome;
            lastnamefield.value=user.cognome;
            emailfield.value=user.email;
            phonefield.value=user.telefono;
        } 
    }
    

    req.open("get","php/user.php/users/profile",true);
    req.send();}

function modifica(){
    if(nomeModificato || cognomeModificato || emailModificata || phoneModificato){
        oggetto={
            nome:firstNamefield.value.trim(),
            cognome:lastnamefield.value.trim(),
            email:emailfield.value.trim(),
            phone:phonefield.value.trim()
        };
        console.log(JSON.stringify(oggetto));
        req=new XMLHttpRequest();
        req.onload=function(){
            console.log(req.responseText);
            if(req.responseText=="email"){
                alert("Emai già associata a un account");
            }
            if(req.responseText=="OK"){
                alert("Modifiche eseguite con successo \n Verrai reindirizzato alla pagina iniziale");
                window.location.href="index.php";
            }
        }
        req.open('PUT',"php/user.php/users",true);
        req.send(JSON.stringify(oggetto));
    }

    
}