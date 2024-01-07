window.onload = function() {
    home(); //recupero info e attivo la modalità di logout 
    get_esercizi(); //recuepro info sugli esercizi
    get_esercizi_scheda();  // Recupera informazioni sugli esercizi per la scheda
    document.getElementById("confirm_button").addEventListener("click", checkform);  // Aggiunge un listener al click sul pulsante di conferma
    document.getElementById("delete_button").addEventListener("click", elimina_esercizio); // Aggiunge un listener al click sul pulsante di eliminazione

}

// Funzione per recuperare informazioni sugli esercizi
function get_esercizi() {
    var req = new XMLHttpRequest();
    
    req.onload = function() {
        var data = JSON.parse(req.responseText);
        //FORMATO DELLA RISPOSTA: array con tutti fli esercizi nel formato
        //{0: "plank", 1: "addome", nome: "plank", gruppo: "addome"}
        //questo formato consente di accedere sia in con indice numerico che indice associativo
        //console.log(data);
        put_esercizi(data);
    }

    req.open('GET','php/esercizi.php/esercizi/attuale',true);
    req.send();
}

function get_esercizi_scheda() {
    var req = new XMLHttpRequest();

    req.onload = function() {
        
        var data = JSON.parse(req.responseText);
        console.log(data);
        modifica_bottoni(data);
    }

    req.open('GET','php/logicaSchede.php/e_s/attuale',true);
    req.send();
}

//funzione per visualizzare gli esercizi
function put_esercizi(esercizi) {
    
    // Per ogni esercizio vado ad eseguire il codice
    esercizi.forEach(esercizio => {

        //recupero il fiv del gruppo ne creo u'altro di dimensione 4 (il valore massimo è 12, avremo 3 foto per riga), 
        // e lo apopendo al div del gruppo muscolare 
        const div = document.getElementById(esercizio.gruppo);
        const div_col = document.createElement('div');
        div_col.classList.add('col-md-4');
        div.appendChild(div_col);
        
        //creo i div per la card contente l'esercizio e l'appendo al div col
        const card = document.createElement('div');
        card.classList.add('card', 'exercise-card');
        div_col.appendChild(card);
    
        //creo il card header con le adeguate classi bootstrap 
        const card_header = document.createElement('div');
        card_header.classList.add(
            'card-header' , // Stile di base per l'header della card
            'd-flex', // Utilizza Flexbox per il posizionamento flessibile degli elementi figlio
            'justify-content-between', // Distribuisce uniformemente gli elementi lungo l'asse orizzontale
            'align-items-center'// Centra gli elementi all'interno dell'header della card
            );
        card.appendChild(card_header);
    
        // Crea un elemento h5 per il nome dell'esercizio e lo aggiunge all'header della card
        const h5 = document.createElement('h5');
        h5.classList.add('mb-0'); // Aggiunge una classe Bootstrap per il margine inferiore
        h5.innerHTML = esercizio.nome; // Imposta il testo dell'h5 con il nome dell'esercizio
        card_header.appendChild(h5);
        
        // Crea un bottone per aggiungere l'esercizio alla scheda e lo aggiunge all'header della card
        const btn = document.createElement('button');
        btn.setAttribute('class', 'btn btn-primary');
        btn.setAttribute('id', esercizio.nome); // Imposta l'ID del bottone con il nome dell'esercizio
        btn.setAttribute("data-toggle", "modal");// Abilita la modalità di visualizzazione modale
        btn.setAttribute("data-target", "#insertModal"); // Specifica il target per la modal
        btn.innerHTML = 'Aggiungi alla scheda'; 
        card_header.appendChild(btn);
        btn.addEventListener('click', set_modal_insert) // Aggiunge un listener al click sul bottone per gestire l'apertura della modalità di inserimento

        // Crea un elemento per il body della card e lo aggiunge alla card
        const card_body = document.createElement('div');
        card_body.classList.add('card-body');
        card.appendChild(card_body);
    
        // Aggiunta della GIF (supponendo la funzione caricaGif())
        card_body.appendChild(caricaGif(esercizio.nome));
    });    
}

//funzione per inserire la gif dell'esercizio ogni gif è del tipo "nome_esercizio.gif"
function caricaGif(esercizio){
    //console.log(esercizio);
    //sostituisco gli spazi con _ e metto l'estnsione
    esercizio=esercizio.replaceAll(" ","_");
    esercizio+=".gif";

    //creo l'elemento e lo ritorno 
    const gif = document.createElement("img");
    gif.src="gif/"+esercizio;
    gif.setAttribute("class", "card-img-top");
    gif.setAttribute("alt", esercizio);
    
    return gif
    
}

//Funzione per controllare i campi input nel modal che riciede le info aggiuntive sull'esercizio
function checkform(){
    // Ottiene tutti gli elementi di input nel documento
    var form_fields = document.getElementsByTagName("input");

    
    for (var i = 0; i < form_fields.length; i++) {
        //controllo sul tipo dell'input 
        if(form_fields[i].type=="number"){
            //controllo sul valore del campo ed eventuale alert 
            if(isNaN(form_fields[i].value) || form_fields[i].value<=0){
                return alert("Compilare i campi numerici in modo corretto (valori maggiori o uguali a 1)")
            }
        }
    }
    // Ottiene i valori dai campi del form
    var nome = form_fields[0].value;
    var serie = form_fields[1].value;
    var ripetizioni = form_fields[2].value;
    var recupero = form_fields[3].value;
    //console.log(nome, serie, ripetizioni, recupero);

    insert_esercizio(nome, serie, ripetizioni, recupero); //faccio l'insert 
}

//funzione per inserire l'esrcizio nel DB  
function insert_esercizio(nome, serie, ripetizioni, recupero) {
    
    var req = new XMLHttpRequest();

    req.onload = function(){
        console.log(this.responseText);
        if(this.responseText == 'ok'){
            location.reload();
        }
    };

    //richiesta AJAX post con i dati nell'URI
    req.open("POST", "php/logicaSchede.php/e_s/"+nome+"/"+serie+"/"+ripetizioni+"/"+recupero, true);
    req.send(esercizio);
}


function set_modal_insert(){
    const modal = document.getElementById("insertModal");
    const input = modal.querySelector(".hidden_esercizio");

    input.setAttribute("value", this.id);
}

function set_modal_delete(){
    const modal = document.getElementById("deleteModal");
    const input = modal.querySelector(".hidden_esercizio_elimina");

    input.setAttribute("value", this.id);
}

function modifica_bottoni(data){
    const buttons = document.querySelectorAll("button");
    for(let i = 0; i < buttons.length; i++){
        for(let j = 0; j < data.length; j++){
            if(buttons[i].id == data[j].esercizio){
                buttons[i].removeEventListener("click", set_modal_insert);
                buttons[i].setAttribute("data-target", "#deleteModal");
                buttons[i].setAttribute("class", "btn btn-danger");
                buttons[i].innerHTML = "Rimuovi dalla scheda";
                buttons[i].addEventListener("click", set_modal_delete);
            }
        }
    }
}


function elimina_esercizio(){
    const id_esercizio = document.querySelector(".hidden_esercizio_elimina").value;

    var req = new XMLHttpRequest();

    req.onload = function(){
        if(this.responseText=='ok'){
            location.reload();
        }
    };

    req.open("DELETE", "php/logicaSchede.php/e_s/"+id_esercizio, true);
    req.send();

}