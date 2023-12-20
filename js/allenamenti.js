
//questo serve p
if(document.getElementById('add_allenamento')){
    const iniziaAllenamento=document.getElementById('add_allenamento');
    iniziaAllenamento.addEventListener('click', function(){  window.location.href = 'allenamento.php'; });
}

//aggiunto un event listener al click di un elemento con ID 'inizia_allenamento',
// chiamando la funzione 'allenamento' quando viene cliccato.
if(document.getElementById('inizia_allenamento')){
    const iniziaAllenamento=document.getElementById('inizia_allenamento');
    iniziaAllenamento.addEventListener('click', check_checkbox);
}


//VARIABILI GLOBALI
var id_scheda = 0;
var gruppi_selezionati = [];
var json_pesi={};
var countdownTimer;

// Se l'URL corrente corrisponde a 'http://localhost/Progetto_web/allenamento.php',
// viene eseguita una funzione quando la finestra si carica.
if(window.location.href == 'http://localhost/Progetto_web/allenamento.php' ||window.location.href == 'http://localhost:8080/Progetto_web/allenamento.php'){
    window.onload = function(){
        recuperaEserciziDallaScheda();
        document.getElementById('modifica_scheda').addEventListener('click', function(){
            window.location.href = "pagina_scheda.php?id="+id_scheda;
        });
    }
}

function allenamento(){
    //cambiamo visualizzazione della pagina
    document.getElementById("selezione").style.display = "none";
    document.getElementById("modifica_scheda").style.display = "none";
    document.getElementById("inizia_allenamento").style.display = "none";
    document.getElementById("allenamento").style.display = "block";
    document.getElementById("termina_allenamento").style.display = "block";
    //document.getElementById("continua").style.display = "block";
    const json_all = createJSON();
       
    const button = document.getElementById('continua');
    const button_recupero = document.getElementById('recupera');
    var serie_rimanenti = document.getElementById("serie_rimanenti");

    //USIAMO LA VARIABILE GLOBALE 'GRUPPI_SELEZIONATI' PER RISALIER ALLE KEYS DEL JSON CONTENENTE L'ALLENAMENTO
    // Dichiarazione degli indici per tenere traccia della posizione negli array
    let indice_gruppi=0; // Indice per i gruppi muscolari selezionati le keys del JSON
    let indice_array_interno_json=0; // Indice per l'array interno value del JSON[key]
    
    //inizializziamo la schermata con esercizio e gruppo 
    set_page(gruppi_selezionati[indice_gruppi], json_all[gruppi_selezionati[indice_gruppi]][indice_array_interno_json]);
    

    //incrementiamo l'indice dell'array interno del JSON
    indice_array_interno_json++;

    
    button_recupero.addEventListener("click", function(){
        var progress_bar = document.getElementById('progress-bar');
        progress_bar.setAttribute('aria-valuenow', '0');
        progress_bar.style.width = '0%';
        progress_bar.style.backgroundColor = "#4e73df";
        var recupero = parseInt(document.getElementById("info_recupero").innerHTML.split(":")[1])
        
        let timerData = { seconds: recupero};
        start_timer(update_timer, timerData, recupero);
    })
    
    
    button.addEventListener('click', function() {
        if (issetPeso()){
        addPeso(json_all[gruppi_selezionati[indice_gruppi]][indice_array_interno_json]);
        console.log(json_pesi);

        //se l'indice della key attuale è <= del totale delle chiavi del JSON-1 (il -1 serve per evitare di uscire dal massimo indice delle keys disponibili)
            if (indice_gruppi <= gruppi_selezionati.length - 1) {
                //se l'indice interno all'array del JSON è >= alla lunghezza dell'array
                //e continua ad essere verificata la condizione precedente
                //riporto a 0 l'indice dell'array interno del JSON ed incrementiamo l'indice della key del JSON 
                //il -1 serve per evitare di uscire dal massimo indice delle keys disponibili
                // riscriviamo la schermata con esercizio e gruppo
                if (indice_array_interno_json >= json_all[gruppi_selezionati[indice_gruppi]].length 
                    && indice_gruppi < gruppi_selezionati.length - 1) {
                    indice_array_interno_json = 0;
                    indice_gruppi++;
                    set_page(gruppi_selezionati[indice_gruppi], json_all[gruppi_selezionati[indice_gruppi]][indice_array_interno_json]);
                }
                //altrimenti cambiamo solo l'eserzio 
                else if (indice_array_interno_json < json_all[gruppi_selezionati[indice_gruppi]].length) {
                    set_page(null, json_all[gruppi_selezionati[indice_gruppi]][indice_array_interno_json])
                    indice_array_interno_json++;
                }
            }
        }else alert("Inserisci il peso");
    }); 
    
    
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

// Funzione per creare un nuovo allenamento inserendolo nel DB con la data attuale.
function create_allenamento(){
    //setto la data attuale 
    const today=new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Aggiunge lo zero iniziale se il mese è inferiore a 10 +1 perchè parte da 0
    const day = String(today.getDate()).padStart(2, '0'); // Aggiunge lo zero iniziale se il giorno è inferiore a 10
    const formattedDate = `${year}-${month}-${day}`;
    
    console.log(formattedDate);
    req=new XMLHttpRequest();

    req.onload = function(){
        /*JSON response:
        $response=array(
            "status" => "ok",
            "id_allenamento" =>  $newAllenamentoID,
            "user" =>$user,
            "scheda" =>$scheda,
            "data_allenamento" =>$data_allenamento,
        ); */ 
        var response= JSON.parse(this.responseText);
        
        if (response['status']=='ok'){
           return response;
        };
    };
    req.open("POST", "php/logicaAllenamento.php/allenamenti/"+formattedDate, true);
    req.send();

}


// Funzione per recuperare gli esercizi dalla scheda.
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


function createJSON(){
    var jsonText ='{';

    for (var i = 0; i < gruppi_selezionati.length; i++) {
        const gruppo_body = document.getElementById(gruppi_selezionati[i]+"_body");
        jsonText += '"'+gruppi_selezionati[i]+'": [';
        const esercizi = gruppo_body.childNodes;
        for(const esercizio of esercizi){
            jsonText += '"'+esercizio.id+'", ';
        };
        jsonText=jsonText.substring(0, jsonText.length-2);
        jsonText += "], ";
    };
    jsonText=jsonText.substring(0, jsonText.length-2);
    jsonText += "}";
    jsonText = JSON.parse(jsonText);
    console.log(jsonText);
    return jsonText;
}

function getInfoEsercizioFromP(stringa){
    console.log(stringa);
    stringa = document.getElementById(stringa).innerHTML;
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

function setInfoSuEsercizio(serie, ripetizioni, recupero){
    let h5_serie=document.getElementById("info_serie")
    let h5_ripetizioni=document.getElementById("info_ripetizioni");
    let h5_recupero=document.getElementById("info_recupero");

    h5_serie.innerHTML="Numero di serie: "+serie;
    h5_ripetizioni.innerHTML="Numero di ripetizioni: "+ripetizioni;
    h5_recupero.innerHTML="Tempo di recupero: "+recupero;
}

function caricaGif(esercizio){
    console.log(esercizio);
    let gif =document.getElementById("gif_esercizio");
    esercizio=esercizio.replaceAll(" ","_");
    esercizio+=".gif";

    gif.src="gif/"+esercizio;
    gif.style.display="block";
    
}

function issetPeso(){
    let peso=document.getElementById("peso");
    peso=peso.value;
    if(peso === ""){
        return false
    }
    return true
}

function addPeso(current_esercizio){
    let peso=document.getElementById("peso").value;
    
}

function start_timer(callback, timerData, totalSeconds) {
    if (!countdownTimer) {
      countdownTimer = setInterval(function() {
        callback(timerData, totalSeconds);
      }, 1000);
    }
}
  
function update_timer(timerData, totalSeconds) {
    const progressBar = document.getElementById('progress-bar');
    console.log(timerData.seconds);
  
    if (timerData.seconds > 0) {
      timerData.seconds--;
      const percentage = (((totalSeconds - timerData.seconds) / totalSeconds) * 100).toFixed(2); // Calcolo della percentuale basata sul tempo trascorso
  
      progressBar.style.width = percentage + '%';
      progressBar.setAttribute('aria-valuenow', percentage);
    } else {
      clearInterval(countdownTimer); // Interrompe il timer
      countdownTimer = null;
      progressBar.style.width = '100%';
      progressBar.style.backgroundColor = "#1cc88a"; // Cambia il colore di sfondo della progress bar quando il tempo è scaduto
      var serie_rimanenti = document.getElementById("serie_rimanenti");

      let serie_aggiornato = (parseInt(serie_rimanenti.innerHTML.split(":")[1])) - 1;
      serie_rimanenti.innerHTML = "Numero di serie rimanenti: " + serie_aggiornato;

        if (serie_aggiornato === 0) {
            document.getElementById('recupera').style.display = "none";
            document.getElementById('progress-bar').style.display = "none";
            document.getElementById("continua").style.display = "block";
            document.getElementById("peso").style.display = "block";
        }
    }
}
