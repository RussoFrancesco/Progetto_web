window.addEventListener('load', function() {
    //quando carica la finestra 
    home(); //funzione per inserire il nome dell'user nella scheda utente e per attivare il logout 
    get_esercizi(); 
    document.getElementById("invio_scheda").addEventListener('click', check_scheda); 
});


// funzione per recuperare gli esercizi dal db 
function get_esercizi() {
    req = new XMLHttpRequest();
    
    req.onload = function() {
        var data = this.responseText; //recupero dati ottenuti dal server in una stringa in formato JSON
        data = JSON.parse(data);    //li converto con metodo PARSE in un oggetto JavaScript
        insert_esercizi(data);  
    }

    req.open('get', 'php/esercizi.php/esercizi', true); //Richiesta AJAX con metodo GET (è una select) sulla tabella esercizi
    req.setRequestHeader('Token', token);
    req.send();

}

//funzione per l'inserimento degli esercizi nella scheda
function insert_esercizi(data) {

    // gruppi muscolari in un oggetto utile per inserire l'esercizio nel div
    const gruppiDiv = {
        pettorali: 'pettorali',
        dorsali: 'dorsali',
        spalle: 'spalle',
        tricipiti: 'tricipiti',
        bicipiti: 'bicipiti',
        addome: 'addome',
        gambe: 'gambe'
    };

    //ciclo per creare la checkbox degli esercizi dall'oggetto json tornato dal DB con dentro gli esercizi
    data.forEach(esercizio => {

        //recupero esercizio e gruppo dell'esercizio
        const gruppo = esercizio['gruppo']; 
        const nome = esercizio['nome'];

        //creo una checkbox per ogni esercizio con nome ed id= al nome dell'esercizio stesso 
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = nome;
        checkbox.id = nome;
        checkbox.classList.add('form-check-input');

        //Creo la rispettiva label 
        const checkboxLabel = document.createElement('label');
        checkboxLabel.htmlFor = nome; //assegno la label alla checkbox
        checkboxLabel.classList.add('form-check-label');
        checkboxLabel.appendChild(document.createTextNode(nome)); // Aggiunge un nodo di testo contenente il valore di  'nome' al nodo 'checkboxLabel'

        //recupero il div per il singolo gruppo
        const div = document.getElementById(gruppiDiv[gruppo]);

        if (div) {

            //appendo all'elemento div appena recuperato dal DOM la checkbox la label ed un <br>
            div.appendChild(checkbox);
            div.appendChild(checkboxLabel);
            div.appendChild(document.createElement('br'));

            //creo il div hidden per gli input di serie,ripetizioni,recupero e gli metto la classe row
            const hiddenInputGroup = document.createElement('div');
            hiddenInputGroup.classList.add('row');

            //funzione con arrow function per creare hidden input
            const createHiddenInput = (id, label) => {

                //creo 1 un input type number con id uguale al parametro min=1 display=none 
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'number';
                hiddenInput.id = id;
                hiddenInput.setAttribute('min', '1');
                hiddenInput.classList.add('form-control', 'hidden-fields', 'form-control-user');
                hiddenInput.style.display = 'none';
                hiddenInput.setAttribute('data-checkbox', nome);

                //creo la label 
                const labelHidden = document.createElement('label');
                labelHidden.htmlFor = hiddenInput.id;
                labelHidden.id = "label"+hiddenInput.id;
                labelHidden.classList.add('form-control-label', 'hidden-fields');
                labelHidden.style.display = 'none';
                labelHidden.setAttribute('data-checkbox', nome);
                labelHidden.innerHTML = label;

                //creo un div col-auto a cui appendo sia l'hidden input che la label
                const colDiv = document.createElement('div');
                colDiv.classList.add('col-auto');
                colDiv.appendChild(labelHidden);
                colDiv.appendChild(hiddenInput);

                return colDiv;
            };

            //utilizzo la funzione appena creata e la utilizzo per appendere gli input al div hiddenInputGroup
            hiddenInputGroup.appendChild(createHiddenInput('n_serie_' + nome, 'Numero di serie'));
            hiddenInputGroup.appendChild(createHiddenInput('n_rep_' + nome, 'Numero di ripetizioni per serie'));
            hiddenInputGroup.appendChild(createHiddenInput('rec_' + nome, 'Recupero tra le serie(sec)'));

            div.appendChild(hiddenInputGroup);

            
            // Aggiungi un event listener al cambio di stato della checkbox
            checkbox.addEventListener('change', function() {
                const nomeCheckbox = this.id; // Ottiene l'ID della checkbox attivata

                //const hiddenFields = div.querySelectorAll('.hidden-fields');

                const hiddenFields = []; // Crea un array per memorizzare i campi nascosti associati alla checkbox

                // Aggiunge i riferimenti ai campi nascosti nell'array hiddenFields
                hiddenFields.push(document.getElementById('n_serie_' + nome));
                hiddenFields.push(document.getElementById('n_rep_' + nome));
                hiddenFields.push(document.getElementById('rec_' + nome));

                // Per ogni campo nascosto associato alla checkbox
                hiddenFields.forEach(field => {
                    // Verifica se il campo corrente è associato alla checkbox attivata
                    if (field.getAttribute('data-checkbox') === nomeCheckbox) {
                        // Ottiene il riferimento all'elemento di label corrispondente al campo
                        var label = document.getElementById("label"+field.id);
                        //Imposta lo stile di visualizzazione della label e del campo in base allo stato della checkbox
                        label.style.display = this.checked ? 'block' : 'none';
                        field.style.display = this.checked ? 'block' : 'none';
                    }
                });
            });
        }
    });
}

//funzione che valida l'input della scheda
function check_scheda() {
    var form_fields = document.getElementsByTagName("input"); //prende tutti gli elementi input 
    for (var i = 0; i < form_fields.length; i++) {
        /*controllo che gli input siano type checkbox e che sono stati cliccati, se cosi' prendo i dati correlati
            numero di serie, numero di ripetizioni, numero di recupero tra le serie e li metto in un'array*/
        if (form_fields[i].type == "checkbox" && form_fields[i].checked == true) {
            // Controllo che i valori dei campi numerici siano maggiori o uguali a 1
            var n_serie = parseInt(form_fields[i + 1].value);
            var n_rep = parseInt(form_fields[i + 2].value);
            var rec = parseInt(form_fields[i + 3].value);

            //se un campo ha un valore non consentito do un alert
            if (isNaN(n_serie) || isNaN(n_rep) || isNaN(rec) || n_serie < 1 || n_rep < 1 || rec < 1) {
                return alert("Compilare i campi numerici in modo corretto (valori maggiori o uguali a 1)");
            }
        }
    }
    componiScheda(); 
}


function componiScheda(){

    //Composizione data inizio alla data di oggi 
    const data=new Date();
    var data_inizio=data.toISOString().split('T')[0];

    //recupero tutti gli input elements 
    var form_fields=document.getElementsByTagName("input");

    var form_data = []; 
    
    for(var i=0;i<form_fields.length;i++){
        /*controllo che gli input siano type checkbox e che sono stati cliccati, se cosi' prendo i dati correlati
            numero di serie, numero di ripetizioni, numero di recupero tra le serie  e li metto in un'array    */
        if (form_fields[i].type=="checkbox" && form_fields[i].checked == true){
            var esercizio = {};
            esercizio.nome=form_fields[i].id; //prendo l'id della checkbox che sarà il nome dell'esercizio
            esercizio.n_serie = form_fields[i+1].value; //prendo il valore del campo serie che sarà subito dopo la checkbox
            esercizio.n_rep = form_fields[i+2].value; //prendo il valore del campo serie che sarà 2 posizioni dopo
            esercizio.rec = form_fields[i+3].value; //prendo il valore del campo serie che sarà 3 posizioni
            console.log(esercizio); 
            form_data.push(esercizio); //infine inserisco l'oggetto esercizio nell'array 
        }
    }
    //console.log("array: ",...form_data);

    var form_data_json = JSON.stringify(form_data); //rendo un l'array una stringa in formato JSON 
    console.log(form_data_json);

    //Mando richiesta al server per inserire la scheda (Invio anche il Json con gli esercizi)
    var req= new XMLHttpRequest(); 
    req.onload = function() {
        if(this.responseText=='ok'){
            window.location.href="schede.php"; //se va a buon fine ritorno alla pagina che mostra le schede 
        }
    }
    req.open('post', 'php/logicaSchede.php/scheda/'+data_inizio, true); //richiesta di insert
    req.setRequestHeader('Token', token); 
    req.send(form_data_json); //mando anche i dati in una stringa con formato JSON contenenti gli esercizi
}