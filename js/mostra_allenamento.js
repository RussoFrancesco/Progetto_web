window.onload = function() {
    home(); // Richiama la funzione home per eseguire delle operazioni iniziali
    get_data_from_server();  // Richiama la funzione per ottenere dati dal server 
}

// Funzione per ottenere dati dal server
function get_data_from_server() {
    // Ottiene il parametro 'id' dall'URL della pagina
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    var req=new XMLHttpRequest();

    req.onload=function() {
        // Se la risposta indica un errore, reindirizza l'utente a 'allenamenti.php'
        if(this.responseText == "ERROR"){
            window.location.href = "allenamenti.php";
        }
        else{
            var data = JSON.parse(this.responseText);
            //FORMATO DELLA RISPOSTA: {allenamento: 24, esercizio: "leg press", peso: 20, gruppo: "gambe", serie: 1, …}
            console.log(data);
            smista_esercizi(data);
        }
    };

    //richiedo l'allenamento dalla tabella a_e 
    req.open('GET',"php/logicaAllenamento.php/a_e/"+id,true);
    req.setRequestHeader('Token', token);
    req.send();
}

//funzione per mostare a schermo l'allenamento
function smista_esercizi(data){

    // Estrae la data dall'oggetto data ottenuto dal server
    let partiData = data[0]['data'].split('-');
    let anno = partiData[0];
    let mese = partiData[1];
    let giorno = partiData[2];

    // Aggiunge la data all'elemento con ID "allenamento"
    document.getElementById("allenamento").innerHTML += " "+`${giorno}-${mese}-${anno}`;
    for(var i=0; i<data.length; i++){
        
        // Mostra la card corrispondente al gruppo di esercizi
        document.getElementById("card_"+data[i]['gruppo']).style.display="block";
        // Ottiene l'elemento card corrispondente al gruppo
        var card = document.getElementById(data[i]['gruppo']);
        // Crea un elemento paragrafo per ogni esercizio
        var p = document.createElement("p");
        // Costruisce il testo per l'esercizio, serie, ripetizioni e recupero
        p.innerHTML = data[i]["esercizio"]+" "+data[i]["serie"]+"x"+data[i]["ripetizioni"]+" "+data[i]["recupero"]+"\"";

        // Se è specificato un peso per l'esercizio, aggiungi questa informazione al testo
        if(data[i]['peso']!=0){
            p.innerHTML += " svolto con "+data[i]['peso']+"kg";
        }
        
        //appendo il paragrafo 
        card.appendChild(p);
    }
}