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
    req = new XMLHttpRequest();

    req.onload = function(){
        if(req.readyState == 4 && req.status == 200){
            var data = JSON.parse(req.responseText);

            console.log(data);

            // Itera su ogni scheda ricevuta dalla risposta JSON
            data.forEach(scheda => {
                var div;
                // Determina se la scheda è nel div dello storico o nell'attuale
                if(scheda.data_fine != null){
                    div = storico_schede;
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

                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.name = 'id_scheda'; // Nome del campo per identificarlo
                hiddenInput.value = scheda.id_scheda;
                hiddenInput.id = scheda.id_scheda;
                card_body.appendChild(hiddenInput);
            
            
                h3.innerHTML = "Scheda del "+scheda.data_inizio;
                
                // Se la scheda è nell'attuale, crea e aggiunge un bottone "Termina la scheda"
                if(div == scheda_attuale){
                    var button_chiusura = document.createElement("button");
                    button_chiusura.classList = "btn btn-primary";
                    button_chiusura.textContent = "Termina la scheda ";
                    button_chiusura.setAttribute("id", "button_chiusura");
                    button_chiusura.style.float = "right";
                    card_body.appendChild(button_chiusura);
                }
            });
        }
    }



    req.open("GET", "php/logicaSchede.php/schede/storico", true);
    req.send();


}