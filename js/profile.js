//elementi del form del profilo
var firstNamefield=document.getElementById("FirstName");
var lastnamefield=document.getElementById("LastName");
var emailfield=document.getElementById("Email");
var phonefield=document.getElementById("Phone");

//flag per la modifica dei campi del form
var nomeModificato=false;
var cognomeModificato=false;
var emailModificata=false;
var phoneModificato=false;

window.onload=bindEvent();

function bindEvent(){
    home();
    compilaForm();  //recupero info dell'utente
    
    //se uno dei campi viene modificato si setta la relativa flag a true
    firstNamefield.addEventListener("change",function(){nomeModificato=true;});
    lastnamefield.addEventListener("change",function(){cognomeModificato=true;});
    emailfield.addEventListener("change",function(){emailModificata=true;});
    phonefield.addEventListener("change",function(){phoneModificato=true;});

    document.getElementById("button_modifica").addEventListener("click", modifica);
}

//funzione per recuperare le info dell'utente
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

//funzione per inviare le modifiche all'utente
function modifica(){
    if(nomeModificato || cognomeModificato || emailModificata || phoneModificato){
        //creazione dell'oggetto con i valori da inviare
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
            //gestione della risposta dal server
            if(req.responseText=="email"){
                alert("Email già associata a un account");
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