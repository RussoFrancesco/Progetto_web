window.onload = bindEvents();

function bindEvents() {
    
}

function visualizzaSchede(){
    var storico_schede = document.getElementById("storico_schede");
    req=new XMLHttpRequest();

    req.onload=function(){
        if(req.readyState==4 && req.status==200){
           
        }
    }

    req.open("GET", "php/logicaSchede.php/schede/storico", true);
    req.send();


}