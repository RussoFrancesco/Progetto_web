var id = window.location.search.substring(0).replace("?id=", "");
var gruppi = new Set();


window.onload = function(){
    get_scheda();
    document.getElementById("modifica_scheda").addEventListener('click', abilita_modifica);
    document.getElementById('button_terminazione_scheda').addEventListener('click', termina_scheda);
}

function get_scheda() {
    var req = new XMLHttpRequest();
    
    console.log(id);

    req.onload = function(){
        var data = JSON.parse(this.responseText);
        if (this.responseText == 'ERROR'){
            alert("Errore");
            window.location.href = "schede.php";
        }
        if (data['data_fine']==null){
            document.getElementById('button_terminazione_scheda').style.display = "block";
        }
        get_esercizi_from_scheda();
    }


    req.open('GET', "php/logicaSchede.php/scheda/"+id, true);
    req.send();
}


function get_esercizi_from_scheda(){
    var req = new XMLHttpRequest();

    req.onload = function(){
        console.log(this.responseText);
        var data = JSON.parse(req.responseText);

        // Creazione di un set di gruppi unici dai dati ricevuti per dividere la scheda in gruppi muscolari separati
        for(var i=0; i<data.length; i++){
            gruppi.add(data[i]['gruppo']);
        }

        // Trasformazione del set in un array
        gruppi = Array.from(gruppi);

        console.log(typeof(gruppi));

        // Per ogni gruppo, crea un elemento 'ul' e un elemento 'h4'
        // Creazione delle card per ciascun gruppo
gruppi.forEach(gruppo => {
    var card = document.createElement("div");
    card.setAttribute("class", "card mt-3");
    card.setAttribute("id", gruppo);

    var card_header = document.createElement("div");
    card_header.setAttribute("class", "card-header");
    card_header.innerHTML = `<h4>${gruppo}</h4>`;

    var card_body = document.createElement("div");
    card_body.setAttribute("class", "card-body");

    card.appendChild(card_header);
    card.appendChild(card_body);

    document.getElementById("scheda_attuale").appendChild(card);
});

// Aggiunta degli esercizi alle rispettive card
for (var i = 0; i < data.length; i++) {
    var card_body = document.getElementById(data[i]['gruppo']).getElementsByClassName('card-body')[0];

    var li = document.createElement("div");
    li.setAttribute("id", data[i]['esercizio']);

    var text = document.createElement("p");
    text.innerHTML = data[i]['esercizio'] + ": " + data[i]['serie'] + "x" + data[i]['ripetizioni'] + " recupero " + data[i]["recupero"];

    li.appendChild(text);
    card_body.appendChild(li);
}

        
    }

    req.open('GET', "php/logicaSchede.php/e_s/schede/esercizi/"+id, true);
    req.send();
}

function termina_scheda(){

    var req = new XMLHttpRequest();

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Aggiunge lo zero iniziale se il mese è inferiore a 10
    const day = String(today.getDate()).padStart(2, '0'); // Aggiunge lo zero iniziale se il giorno è inferiore a 10
    const formattedDate = `${year}-${month}-${day}`;
    console.log(formattedDate);

    req.onload = function(){

        console.log("risposta server: "+this.responseText);

        if (this.responseText == 'ok'){
            window.location.href = "schede.php";
        }

    }

    req.open('PUT', "php/logicaSchede.php/schede/"+id+"/"+formattedDate, true);
    req.send();

}

function abilita_modifica() {
    console.log(gruppi);
    for(i=0; i<gruppi.length; i++) {
        console.log(document.getElementById(gruppi[i]));
    }
}

