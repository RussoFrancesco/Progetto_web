
window.onload = function() {
    home();

    //recupero il bottone di inizia allenamento e gli bindo l'evento
    const iniziaAllenamento=document.getElementById('add_allenamento');
    iniziaAllenamento.addEventListener('click', function(){  window.location.href = 'allenamento.php'; });

    visualizzazioneStoricoAllenamenti();
}

//funzione per visualizzare lo storico allenamenti dell'utente
function visualizzazioneStoricoAllenamenti() {
    var req= new XMLHttpRequest();

    req.onload=function(){
        if(this.responseText == 'Denied'){
            invalid_token();
        }

        console.log(req.responseText);
        caricaStoricoAllenamentiAll(JSON.parse(req.responseText));
    }

    req.open("GET", "php/logicaAllenamento.php/allenamenti/storico", true);
    req.setRequestHeader('Token', token);
    req.send();
}

//funzione per creare la visualizzazione dei singoli allenamenti
function caricaStoricoAllenamentiAll(data) {
    var div= document.getElementById("storico_allenamenti");
    data.forEach(allenamento => {
        //formattazione della data
        let partiData = allenamento.data.split('-');
        let anno = partiData[0];
        let mese = partiData[1];
        let giorno = partiData[2];
        allenamento.data = `${giorno}-${mese}-${anno}`;
        
        //creazione dell'elemento card e dei suoi figli
        var card = document.createElement("div");
        card.setAttribute("class", "card mt-2");
        
        var card_body = document.createElement("div");
        card_body.setAttribute("class", "card-body");
        
        var link= document.createElement("a");
        link.setAttribute("href", "allenamento_passato.php?id="+allenamento.id);
        
        var h3 = document.createElement("h3");
        h3.innerHTML = "Allenamento del: "+allenamento.data;

        div.appendChild(card);
        card.appendChild(card_body);
        card_body.appendChild(link);
        link.appendChild(h3);
    });
}

