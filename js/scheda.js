window.onload = bindEvents();
var storico_schede = document.getElementById("storico_schede");
var scheda_attuale = document.getElementById("scheda_attuale");

function bindEvents() {
    visualizzaSchede();
    var add_scheda = document.getElementById("add_scheda");
    
    add_scheda.addEventListener("click",function(event){
        if(scheda_attuale.hasChildNodes()){
            alert("chiudi la scheda attuale");
        }
        else{
            window.location.href="add_scheda.php";
        }
    });
}

function visualizzaSchede(){
    req=new XMLHttpRequest();

    req.onload=function(){
        if(req.readyState==4 && req.status==200){
           var data = JSON.parse(req.responseText);

           console.log(data);
           data.forEach(scheda => {
                var div;
                if(scheda.data_fine!=null){
                    div = storico_schede;
                }
                else{
                    div = scheda_attuale;
                }
                const card = document.createElement("div");
                card.setAttribute("class","card mt-2 span");
                div.appendChild(card);
                const card_body = document.createElement("div");
                card_body.setAttribute("class","card-body");
                card.appendChild(card_body);
                const h3 = document.createElement("h3");
                card_body.appendChild(h3);

                var botton_chiusura=document.createElement("button");
                botton_chiusura.classList("btn btn-primary");
                



                //const d = new Date(scheda.data_inizio);
                //console.log(d);
                h3.innerHTML = "Scheda del "+scheda.data_inizio;
           });
        }
    }

    req.open("GET", "php/logicaSchede.php/schede/storico", true);
    req.send();


}