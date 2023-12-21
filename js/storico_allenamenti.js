window.onload = function() {
    const iniziaAllenamento=document.getElementById('add_allenamento');
    iniziaAllenamento.addEventListener('click', function(){  window.location.href = 'allenamento.php'; });
    visualizzazioneStoricoAllenamenti();
}

function visualizzazioneStoricoAllenamenti() {
    var req= new XMLHttpRequest();

    req.onload=function(){
        console.log(req.responseText);
        caricaStoricoAllenamentiAll(JSON.parse(req.responseText));
    }

    req.open("GET", "php/logicaAllenamento.php/allenamenti/storico", true);
    req.send();
}


function caricaStoricoAllenamentiAll(data) {
    var div= document.getElementById("storico_allenamenti");
    data.forEach(allenamento => {
        let partiData = allenamento.data.split('-');
        let anno = partiData[0];
        let mese = partiData[1];
        let giorno = partiData[2];
        allenamento.data = `${giorno}-${mese}-${anno}`;
        
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

