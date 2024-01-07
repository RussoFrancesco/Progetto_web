home(); //funzione per inserire il logout ed il nome utente nella sezione utente

//aggiungo un event listener al click del bottone con ID 'inizia_allenamento',
// chiamando la funzione 'allenamento' quando viene cliccato.
if(document.getElementById('inizia_allenamento')){
    const iniziaAllenamento=document.getElementById('inizia_allenamento');
    iniziaAllenamento.addEventListener('click', check_checkbox);
}


//VARIABILI GLOBALI
var id_scheda = null; //id_scheda recuperata dopo con recupera esercizi dalla scheda
var gruppi_selezionati = []; //variable per i gruppi selezionati nella checkbox iniziale
var json_pesi={}; //json per i pesi utilizzati a fine allenamento
var countdownTimer;

// Se l'URL corrente corrisponde a 'http://localhost/Progetto_web/allenamento.php',
// viene eseguita la funzione  recuperaEserciziDallaScheda(); quando la finestra si carica.
// inoltre rendo attivo il bottone di modifica scheda che riporta alla pagina della scheda con l'id passato tramite url
if(window.location.href == 'http://localhost/Progetto_web/allenamento.php' ||window.location.href == 'http://localhost:8080/Progetto_web/allenamento.php'){
    window.onload = function(){
        recuperaEserciziDallaScheda();
        document.getElementById('modifica_scheda').addEventListener('click', function(){
            window.location.href = "pagina_scheda.php?id="+id_scheda;
        });
    }
}

//FUnzione per eseguire l'allenamento
function allenamento(){
    //cambiamo visualizzazione della pagina 
    document.getElementById("selezione").style.display = "none";
    document.getElementById("modifica_scheda").style.display = "none";
    document.getElementById("inizia_allenamento").style.display = "none";
    document.getElementById("allenamento").style.display = "block";
    var termina = document.getElementById("termina_allenamento");
    termina.style.display = "block";
    //document.getElementById("continua").style.display = "block";
    const json_all = createJSON(); //creo un oggetto JSON per l'allenamento 
       
    const button = document.getElementById('continua');
    const button_recupero = document.getElementById('recupera');
    var serie_rimanenti = document.getElementById("serie_rimanenti");

    //USIAMO LA VARIABILE GLOBALE 'GRUPPI_SELEZIONATI' PER RISALIRE ALLE KEYS DEL JSON CONTENENTE L'ALLENAMENTO
    // Dichiarazione degli indici per tenere traccia della posizione negli array
    let indice_gruppi=0; // Indice per i gruppi muscolari selezionati le keys del JSON
    let indice_array_interno_json=0; // Indice per l'array interno value del JSON[key]
    
    //inizializziamo la schermata con esercizio e gruppo 
    set_page(gruppi_selezionati[indice_gruppi], json_all[gruppi_selezionati[indice_gruppi]][indice_array_interno_json]);
    

    //incrementiamo l'indice dell'array interno del JSON
    indice_array_interno_json++;

    termina.addEventListener("click", function(){
        //se il json dei pesi contiene qualche esercizio completato, viene inserito nel db, sennò si ritorna alla pagina di allenamenti
        if(JSON.stringify(json_pesi).replace("{}", "").length != 0){
            inserimento_allenamento();
        }
        else{
            window.location.href = "allenamenti.php";
        }
    })

    //evento sul tasto recupera
    button_recupero.addEventListener("click", function(){
        //quando viene cliccato si azzera la barra e si recupera i secondi per il timer
        var progress_bar = document.getElementById('progress-bar');
        progress_bar.setAttribute('aria-valuenow', '0');
        progress_bar.style.width = '0%';
        progress_bar.style.backgroundColor = "#4e73df";
        var recupero = parseInt(document.getElementById("info_recupero").innerHTML.split(":")[1])
        
        //chiamo la funzione start_timer con una funzione di callback, l'oggetto timerData che serve per avere un passaggio di variabili per rifefrimento e i secondi per il timer
        let timerData = { seconds: recupero};
        start_timer(update_timer, timerData, recupero);
    })
    
    
    button.addEventListener('click', function() {
        /*console.log("gruppi: "+indice_gruppi);
        console.log("esercizio: "+indice_array_interno_json);
        console.log("numero di esercizi: "+json_all[gruppi_selezionati[indice_gruppi]].length)
        console.log("json: "+JSON.stringify(json_all));*/
        if (issetPeso()){
            addPeso();
            //console.log(json_pesi);
            
            //se l'indice della key attuale è <= del totale delle chiavi del JSON-1 (il -1 serve per evitare di uscire dal massimo indice delle keys disponibili)
            if (indice_gruppi <= gruppi_selezionati.length-1 ) {
                //se l'indice interno all'array del JSON è >= alla lunghezza dell'array
                //e continua ad essere verificata la condizione precedente
                //riporto a 0 l'indice dell'array interno del JSON ed incrementiamo l'indice della key del JSON 
                //il -1 serve per evitare di uscire dal massimo indice delle keys disponibili
                // riscriviamo la schermata con esercizio e gruppo
                if (indice_array_interno_json >= json_all[gruppi_selezionati[indice_gruppi]].length 
                    && indice_gruppi < gruppi_selezionati.length - 1) {
                    //console.log("if "+indice_gruppi+" "+indice_array_interno_json);
                    indice_array_interno_json = 0;
                    indice_gruppi++;
                    set_page(gruppi_selezionati[indice_gruppi], json_all[gruppi_selezionati[indice_gruppi]][indice_array_interno_json]);
                    indice_array_interno_json++;
                }
                //altrimenti cambiamo solo l'eserzio 
                else if (indice_array_interno_json < json_all[gruppi_selezionati[indice_gruppi]].length) {
                    //console.log("else "+indice_gruppi+" "+indice_array_interno_json)
                    set_page(null, json_all[gruppi_selezionati[indice_gruppi]][indice_array_interno_json]);
                    indice_array_interno_json++;
                }
                //controllo sulla fine dell'allenamento se siamo a fine dei gruppi e l'ultimo esercizio su quel gruppo
                else{
                        inserimento_allenamento();
                    }
            }   
        }else alert("Inserisci il peso maggiore di 0");
    }); 
    
}

function inserimento_allenamento() {
    const today=new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Aggiunge lo zero iniziale se il mese è inferiore a 10 +1 perchè parte da 0
    const day = String(today.getDate()).padStart(2, '0'); // Aggiunge lo zero iniziale se il giorno è inferiore a 10
    const formattedDate = `${year}-${month}-${day}`;

    var req = new XMLHttpRequest();

    req.onload = function(){
        console.log(this.responseText);
        if(this.responseText == 'ok'){
            window.location.href = "allenamenti.php";
        }
    }

    req.open('POST', "php/logicaAllenamento.php/allenamenti/"+formattedDate, true);
    req.send(JSON.stringify(json_pesi));
}

        
function scheda(esercizi) {
    // Array contenente i nomi dei gruppi muscolari presenti nei rispoettivi div
    const gruppiDiv = [
        'pettorali',
        'dorsali',
        'spalle',
        'tricipiti',
        'bicipiti',
        'addome',
        'gambe'
    ];

     // Recupera l'elemento con ID 'scheda' 
    const div_scheda = document.getElementById('scheda');

     // Ciclo per ogni gruppo muscolare nell'array
    for (let i = 0; i < gruppiDiv.length; i++) {
        // Creazione della card
        const card = document.createElement("div");
        card.setAttribute("class", "card mt-3");
        card.setAttribute("id", "card_" + gruppiDiv[i]);
        card.style.display = "none";

        // Header della card
        const card_header = document.createElement("div");
        card_header.setAttribute("class", "card-header");
        card_header.innerHTML = `<h4>${gruppiDiv[i]}</h4>`;

        // Corpo della card
        const card_body = document.createElement("div");
        card_body.setAttribute("class", "card-body");
        card_body.setAttribute("id", gruppiDiv[i] + "_body");

        // Checkbox e label
        const checkboxDiv = document.createElement('div');
        checkboxDiv.classList.add('form-check');

        // Creazione di un elemento checkbox e label per il gruppo muscolare
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'checkbox_' + gruppiDiv[i];
        checkbox.id = 'checkbox_' + gruppiDiv[i];
        checkbox.classList.add('form-check-input');

        const checkboxLabel = document.createElement('label');
        checkboxLabel.htmlFor = 'checkbox_' + gruppiDiv[i];
        checkboxLabel.classList.add('form-check-label');
        checkboxLabel.appendChild(document.createTextNode(gruppiDiv[i]));

        // Aggiunge un event listener per il cambio dello stato del checkbox
        checkbox.addEventListener('change', function () {
            const div_gruppo = document.getElementById('card_' + gruppiDiv[i]);
            if (this.checked) {
                div_gruppo.style.display = 'block'; // Mostra la card se il checkbox è selezionato
            } else {
                div_gruppo.style.display = 'none';  // Nasconde la card se il checkbox è deselezionato
            }
        });

        // Aggiunta degli elementi al DOM
        checkboxDiv.appendChild(checkbox);
        checkboxDiv.appendChild(checkboxLabel);
       
        card.appendChild(card_header);
        card.appendChild(card_body);
        div_scheda.appendChild(checkboxDiv);
        div_scheda.appendChild(card);
    }

    // Ciclo sugli esercizi
    for(i=0; i<esercizi.length; i++) {
        // Recupera il gruppo muscolare dell'esercizio corrente
        const gruppo = esercizi[i]['gruppo'];
        // Recupera l'elemento del corpo della card corrispondente al gruppo muscolare
        const div_card = document.getElementById(gruppo+"_body");
        // Crea un paragrafo per mostrare i dettagli dell'esercizio e lo aggiunge alla card
        const p_esercizio = document.createElement("p");
        p_esercizio.id = esercizi[i]['nome'];
        p_esercizio.innerHTML = esercizi[i]['nome']+": "+esercizi[i]['serie']+"x"+esercizi[i]['ripetizioni']+" "+esercizi[i]['recupero']+"\"";
        div_card.appendChild(p_esercizio);
    };

    //rendo non cliccabili le checkbox con gruppi non contenenti esercizi nella scheda 
    for(i=0; i<gruppiDiv.length; i++){
        const div_gruppo = document.getElementById(gruppiDiv[i]+"_body");
        if(!div_gruppo.hasChildNodes()){
            const gruppo_checkbox = document.getElementById("checkbox_"+gruppiDiv[i]);
            gruppo_checkbox.disabled = true;
        }
    }
}

//funzione per il cambio di esercizio e/o di gruppo muscolare
function set_page(gruppo, esercizio){
    if (gruppo != null){
        var h3 = document.getElementById("gruppo_muscolare");
        h3.innerHTML = gruppo;
    }
    var progress_bar = document.getElementById('progress-bar');
    progress_bar.setAttribute('aria-valuenow', '0');
    progress_bar.style.width = '0%';
    progress_bar.style.backgroundColor = "#4e73df";
    progress_bar.style.display = "block";
    var gif=document.getElementById("gif_esercizio");
    var h4 = document.getElementById("singolo_esercizio");
    var serie_rimanenti = document.getElementById("serie_rimanenti");   
    h4.innerHTML = esercizio;
    info = getInfoEsercizioFromP(esercizio);
    setInfoSuEsercizio(info[0], info[1], info[2]);
    serie_rimanenti.innerHTML = "Numero di serie rimanenti: "+info[0];
    caricaGif(esercizio);
    document.getElementById("continua").style.display = "none";
    document.getElementById("peso").style.display = "none";
    document.getElementById("peso").value = "";
    document.getElementById('recupera').style.display = "block";
}

// Funzione per recuperare gli esercizi dalla scheda. E recuperare l'id della scheda
function recuperaEserciziDallaScheda(){
    req=new XMLHttpRequest();

    req.onload = function(){
        var data = JSON.parse(this.responseText);
        id_scheda = data.pop();
        scheda(data);
    };

    req.open("GET", "php/logicaAllenamento.php/schede/", true);
    req.send();

}

// Funzione per verificare se almeno un checkbox è selezionato.
function check_checkbox(){
    const form= document.querySelectorAll("input[type=checkbox]");
    checkedOne=false;

    for(i=0; i<form.length; i++){
        if(form[i].checked){
            checkedOne=true;
            gruppi_selezionati.push(form[i].id.replace("checkbox_", ""));
        }
    }
    
    if(checkedOne){
        allenamento();
    }else{
        alert("Selezionare almeno un gruppo muscolare!");
    }
    
}

// Funzione per creare un oggetto JSON dai dati ottenuti dall'interfaccia utente
function createJSON(){
    var jsonText ='{';

    for (var i = 0; i < gruppi_selezionati.length; i++) {
        const gruppo_body = document.getElementById(gruppi_selezionati[i]+"_body"); 
        jsonText += '"'+gruppi_selezionati[i]+'": ['; // Inizia la stringa JSON per il gruppo corrente
        const esercizi = gruppo_body.childNodes;
        for(const esercizio of esercizi){ 
            jsonText += '"'+esercizio.id+'", '; // Aggiunge gli esercizi al JSON
        };
        jsonText=jsonText.substring(0, jsonText.length-2); // Rimuove la virgola finale
        jsonText += "], "; // Chiude la lista di esercizi per il gruppo corrente
    };
    jsonText=jsonText.substring(0, jsonText.length-2); // Rimuove la virgola finale
    jsonText += "}"; // Chiude la stringa JSON
    jsonText = JSON.parse(jsonText); // Converte la stringa JSON in un oggetto JSON
    console.log(jsonText);
    return jsonText;
}

// Funzione per ottenere informazioni sull'esercizio da una stringa
function getInfoEsercizioFromP(stringa){
    console.log(stringa);
    stringa = document.getElementById(stringa).innerHTML; // Ottiene il contenuto dell'elemento HTML con l'ID corrispondente
    let arr=stringa.split(":");
    arr=arr[1];
    arr=arr.split("x");

    let serie=arr[0].trim();
    
    arr= arr[1].split(" ");
    let ripetizioni = arr[0].trim();
    let recupero = arr[1].replace("\"", "").trim();

    //console.log(serie, ripetizioni, recupero);

    return [serie, ripetizioni, recupero];
}

// Funzione per impostare le informazioni sull'esercizio nell'interfaccia utente
function setInfoSuEsercizio(serie, ripetizioni, recupero){
    let h5_serie=document.getElementById("info_serie")
    let h5_ripetizioni=document.getElementById("info_ripetizioni");
    let h5_recupero=document.getElementById("info_recupero");

    h5_serie.innerHTML="Numero di serie: "+serie;
    h5_ripetizioni.innerHTML="Numero di ripetizioni: "+ripetizioni;
    h5_recupero.innerHTML="Tempo di recupero: "+recupero;
}

function caricaGif(esercizio){
    //console.log(esercizio);
    let gif =document.getElementById("gif_esercizio"); // Ottiene l'elemento HTML per la GIF
    esercizio=esercizio.replaceAll(" ","_");
    esercizio+=".gif";

    gif.src="gif/"+esercizio;
    gif.style.display="block";
    
}

//funzione per vedere se l'input del peso è riempito correttamente
function issetPeso(){
    let peso=document.getElementById("peso");
    peso=peso.value;
    if(peso === "" || peso < 0){
        return false
    }
    return true
}

//funzione per aggiungere il peso al json
function addPeso(){
    let esercizio=document.getElementById("singolo_esercizio").innerHTML;
    let peso=document.getElementById("peso").value;
    json_pesi[esercizio]=peso;
    
}

// Funzione per avviare un timer di countdown
function start_timer(callback, timerData, totalSeconds) { 
    if (!countdownTimer) { // Controlla se il timer non è già attivo
        // Imposta un intervallo di tempo (ogni secondo) per richiamare la callback fornita
        countdownTimer = setInterval(function() {
        callback(timerData, totalSeconds); // Richiama la callback con i dati del timer e i secondi totali
      }, 1000); // Intervallo di 1000 millisecondi (1 secondo)
    }
}

// Funzione per aggiornare il timer e la barra di avanzamento
function update_timer(timerData, totalSeconds) {
    const progressBar = document.getElementById('progress-bar'); // Ottiene l'elemento della barra di avanzamento
  
    if (timerData.seconds > 0) { // Se ci sono ancora secondi nel timer
      timerData.seconds--; // Decrementa il numero di secondi rimanenti
      const percentage = (((totalSeconds - timerData.seconds) / totalSeconds) * 100).toFixed(2); // Calcolo della percentuale basata sul tempo trascorso
  
      progressBar.style.width = percentage + '%';
      progressBar.setAttribute('aria-valuenow', percentage); // Aggiorna il valore della barra di avanzamento per l'accessibilità
    } else { //quando il tempo è scaduto
      clearInterval(countdownTimer); // Interrompe il timer
      countdownTimer = null;
      progressBar.style.width = '100%'; // Imposta la barra di avanzamento al 100% di completamento
      progressBar.style.backgroundColor = "#1cc88a"; // Cambia il colore di sfondo della progress bar quando il tempo è scaduto
      var serie_rimanenti = document.getElementById("serie_rimanenti");
    
      // Aggiorna il numero di serie rimanenti sottraendo uno
      let serie_aggiornato = (parseInt(serie_rimanenti.innerHTML.split(":")[1])) - 1;
      serie_rimanenti.innerHTML = "Numero di serie rimanenti: " + serie_aggiornato;

      // Verifica se le serie sono finite se si mostro il bottone continua e l'input del peso
        if (serie_aggiornato === 0) {
            document.getElementById('recupera').style.display = "none";
            document.getElementById('progress-bar').style.display = "none";
            document.getElementById("continua").style.display = "block";
            document.getElementById("peso").style.display = "block";
        }
    }
}
