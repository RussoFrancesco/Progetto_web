var id = window.location.search.substring(0).replace("?id=", "");
var attuale = false; //FLAG PER VEDERE SE LA SCHEDA È ATTUALE O PASSATA

window.onload = function(){
    get_scheda();
    document.getElementById('modifica_scheda').addEventListener('click', abilita_modifica);
    document.getElementById('termina_scheda').addEventListener('click', termina_scheda);
}

function get_scheda() {
    var req = new XMLHttpRequest();
    
    console.log(id);

    req.onload = function(){
        if (this.responseText == 'ERROR'){
            alert("Errore");
            window.location.href = "schede.php";
        }
        if (this.responseText['data_fine']==null){
            attuale = true;
        }
        get_esercizi_from_scheda();
    }


    req.open('GET', "php/logicaSchede.php/scheda/"+id, true);
    req.send();
}


function get_esercizi_from_scheda(){
    console.log(attuale);
    var req = new XMLHttpRequest();

    req.onload = function(){
        console.log(this.responseText);
        var data = JSON.parse(req.responseText);

        // Creazione di un set di gruppi unici dai dati ricevuti per dividere la scheda in gruppi muscolari separati
        var gruppi = new Set();
        for(var i=0; i<data.length; i++){
            gruppi.add(data[i]['gruppo']);
        }

        // Trasformazione del set in un array
        gruppi = Array.from(gruppi);

        console.log(typeof(gruppi));

        // Per ogni gruppo, crea un elemento 'ul' e un elemento 'h4'
        gruppi.forEach(gruppo => {
            var ul = document.createElement("ul");
            ul.setAttribute("class", "list-group list-group-flush");
            ul.setAttribute("id", gruppo);
            var h4 = document.createElement("h4");
            h4.innerHTML = gruppo;
            document.getElementById("scheda_attuale").appendChild(h4);
            document.getElementById("scheda_attuale").appendChild(ul);
        });

        // Per ogni esercizio nei dati, crea un elemento 'li' e lo aggiunge al relativo 'ul' del gruppo
        for(i=0; i<data.length; i++){
            var li = document.createElement("li");
            li.setAttribute("class", "list-group-item");
            li.setAttribute("id", data[i]['esercizio']);
            li.innerHTML=data[i]['esercizio']+": "+data[i]['serie']+"x"+data[i]['ripetizioni']+" recupero "+data[i]["recupero"];
            document.getElementById(data[i]['gruppo']).appendChild(li);
        }

        if(attuale){
            document.getElementById("termina_scheda").style.display="block";
        }
        
    }

    req.open('GET', "php/logicaSchede.php/e_s/schede/esercizi/"+id, true);
    req.send();
}

function conferma_terminazione_scheda(){
    
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
        if (this.responseText == 'ok'){
            window.location.href = "schede.php";
        }
        console.log(this.responseText);
    }

    req.open('PUT', "php/logicaSchede.php/scheda/"+id+"/"+formattedDate, true);
    req.send();

}

function abilita_modifica(){

    var li_elements = document.getElementById("scheda_attuale").getElementsByTagName("li");
    console.log(li_elements);
}

function convert_checkbox(li_ele){
    
}