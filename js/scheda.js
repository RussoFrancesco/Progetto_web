window.onload = bindEvents();

//recupero div della pagina html
var storico_schede = document.getElementById("storico_schede");
var scheda_attuale = document.getElementById("scheda_attuale");

function bindEvents() {
    home();
    visualizzaSchede();
    var add_scheda = document.getElementById("add_scheda");
    
    add_scheda.addEventListener("click",function(){
        if(scheda_attuale.hasChildNodes()){
            alert("chiudi la scheda attuale");
        }
        else{
            window.location.href="add_scheda.php";
        }
    });
}

//funzione per smistare le schede
function visualizzaSchede(){
    req = new XMLHttpRequest();

    //richiesta che recupera tutte le schede dell'utente
    req.onload = function(){
        if(req.readyState == 4 && req.status == 200){
            var data = JSON.parse(req.responseText);

            console.log(data);

            // Itera su ogni scheda ricevuta dalla risposta JSON
            data.forEach(scheda => {
                var div;

                let partiData = scheda.data_inizio.split('-');
                let anno = partiData[0];
                let mese = partiData[1];
                let giorno = partiData[2];
                scheda.data_inizio = `${giorno}-${mese}-${anno}`;

                // Determina se la scheda è nel div dello storico o nell'attuale
                if(scheda.data_fine != null){
                    div = storico_schede;
                    let partiData = scheda.data_fine.split('-');
                    let anno = partiData[0];
                    let mese = partiData[1];
                    let giorno = partiData[2];
                    scheda.data_fine = `${giorno}-${mese}-${anno}`;
                } else {
                    div = scheda_attuale;
                }

                // Crea un elemento div per la card e lo aggiunge al div corretto
                const card = document.createElement("div");
                card.setAttribute("class", "card mt-2 span");
                div.appendChild(card);
                // Crea un elemento div per il corpo della card e lo aggiunge alla card
                const card_body = document.createElement("div");
                card_body.setAttribute("class", "card-body");
                card.appendChild(card_body);
                
                // Creazione dell'elemento 'a' per il link
                const link = document.createElement("a");
                link.href = "pagina_scheda.php?id=" + scheda.id_scheda; // URL con il parametro ID
                link.style.textDecoration = "none"; // Rimuovi la sottolineatura
                card_body.appendChild(link);

                const h3 = document.createElement("h3");
                link.appendChild(h3);

                //a ogni scheda appendo un hidden input con l'id che servirà in seguito(?)
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.name = 'id_scheda'; // Nome del campo per identificarlo
                hiddenInput.value = scheda.id_scheda;
                hiddenInput.id = scheda.id_scheda;
                card_body.appendChild(hiddenInput);
            
                //se il div è quello dello storico visualizzo anche la data di fine sennò no
                if(div == storico_schede){
                    h3.innerHTML = "Scheda del "+scheda.data_inizio+", chiusa il "+scheda.data_fine;
                }else{
                    h3.innerHTML = "Scheda del "+scheda.data_inizio;
                }
            });
        }
    }



    req.open("GET", "php/logicaSchede.php/schede/storico", true);
    req.send();


}