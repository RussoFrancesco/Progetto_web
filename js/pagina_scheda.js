var id = window.location.search.substring(0).replace("?id=", "");
var gruppi = new Set();
var data;

var chiudi_scheda = document.getElementById('button_terminazione_scheda');
var modifica_scheda = document.getElementById("modifica_scheda");
var div_modifica = document.getElementById("modifica_buttons");
var annulla_modifica = document.getElementById("annulla_modifica");
var conferma_modifica = document.getElementById("conferma_modifica");


window.onload = function(){
    get_scheda();

    modifica_scheda.addEventListener('click', abilita_modifica);

    chiudi_scheda.addEventListener('click', termina_scheda);

    annulla_modifica.addEventListener('click', function(){
        location.reload();
    });

    conferma_modifica.addEventListener('click', check_scheda)

}

function get_scheda() {
    var req = new XMLHttpRequest();
    
    console.log(id);

    req.onload = function(){
        data = JSON.parse(this.responseText);
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
        data = JSON.parse(req.responseText);

        // Creazione di un set di gruppi unici dai dati ricevuti per dividere la scheda in gruppi muscolari separati
        for(var i=0; i<data.length; i++){
            gruppi.add(data[i]['gruppo']);
        }

        crea_div();

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

function crea_div(){
    // Trasformazione del set in un array
    gruppi_array = Array.from(gruppi);
        // Per ogni gruppo, crea un elemento 'ul' e un elemento 'h4'
        // Creazione delle card per ciascun gruppo
    gruppi_array.forEach(gruppo => {
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

        var div = document.createElement("div");
        div.setAttribute("id", data[i]['esercizio']);

        var text = document.createElement("p");
        text.innerHTML = data[i]['esercizio'] + ": " + data[i]['serie'] + "x" + data[i]['ripetizioni'] + " recupero " + data[i]["recupero"];

        div.appendChild(text);
        card_body.appendChild(div);
    }
}

function abilita_modifica() {
    for (var i = 0; i < data.length; i++) {
        var esercizio = document.getElementById(data[i]['esercizio']); // Recupera l'elemento esercizio

        // Creazione di un div per contenere la checkbox, la label e i campi input
        var container = document.createElement('div');
        container.classList.add('form-check', 'd-flex', 'flex-row', 'align-items-center');

        // Creazione della checkbox
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        checkbox.id = data[i]['esercizio'];
        checkbox.name = data[i]['esercizio'];
        checkbox.classList.add('form-check-input'); // Aggiungi classe per lo stile Bootstrap (o personalizzato)

        // Creazione della label associata alla checkbox
        var label_checkbox = document.createElement('label');
        label_checkbox.htmlFor = data[i]['esercizio'];
        label_checkbox.classList.add('form-check-label', 'mr-3'); // Aggiungi classe per lo stile Bootstrap (o personalizzato)
        label_checkbox.innerHTML = data[i]['esercizio'];

        // Aggiunta della checkbox e della label al contenitore
        container.appendChild(checkbox);
        container.appendChild(label_checkbox);

        const createInput = (id, label, value) => {
            const input = document.createElement('input');
            input.type = 'number';
            input.id = id;
            input.setAttribute('value', value);
            input.setAttribute('min', '1');
            input.classList.add('form-control', 'form-control-user');
        
            const labelElement = document.createElement('label');
            labelElement.htmlFor = input.id;
            labelElement.id = "label" + input.id;
            labelElement.classList.add('form-control-label');
            labelElement.innerHTML = label;
        
            const colDiv = document.createElement('div');
            colDiv.classList.add('col-auto');
            colDiv.appendChild(labelElement);
            colDiv.appendChild(input);
        
            return colDiv;
        };

        container.appendChild(createInput('n_serie_'+data[i]['esercizio'], 'Numero di serie', data[i]['serie']));
        container.appendChild(createInput('n_rep_'+data[i]['esercizio'], 'Numero di ripetizioni per serie', data[i]['ripetizioni']));
        container.appendChild(createInput('rec_'+data[i]['esercizio'], 'Recupero tra le serie(sec)', data[i]['recupero']));
        

        // Sostituzione del paragrafo dell'esercizio con il contenitore della checkbox, della label e dei campi input
        if (esercizio && esercizio.getElementsByTagName('p').length > 0) {
            var paragrafoEsercizio = esercizio.getElementsByTagName('p')[0]; // Recupera il paragrafo dell'esercizio
            esercizio.removeChild(paragrafoEsercizio); // Rimuove il paragrafo dell'esercizio
            esercizio.appendChild(container); // Aggiunge il contenitore al posto del paragrafo
        }
    }

    modifica_scheda.style.display = 'none';
    div_modifica.style.display = 'block';
    get_esercizi_from_db();
}

function get_esercizi_from_db(){
    var req = new XMLHttpRequest();

    req.onload = function(){
            console.log('get_esercizi_from_db');
            var h3 = document.createElement('h3');
            h3.innerHTML = "Esercizi non presenti nella tua scheda";
            document.getElementById('esercizi_mancanti').appendChild(h3);
            var add_esercizi = JSON.parse(this.responseText);
            put_esercizi_mancanti(add_esercizi);
    }

    req.open('GET', 'php/logicaSchede.php/esercizi/'+id, true);
    req.send();
}

function put_esercizi_mancanti(esercizi){


    const gruppiDiv = {
        pettorali: 'pettorali',
        dorsali: 'dorsali',
        spalle: 'spalle',
        tricipiti: 'tricipiti',
        bicipiti: 'bicipiti',
        addome: 'addome',
        gambe: 'gambe'
    };

    for(i = 0; i < esercizi.length; i++){
        gruppi.add(esercizi[i]['gruppo']);
    }

    gruppi_array = Array.from(gruppi);

    gruppi_array.forEach(gruppo => {
        var card = document.createElement("div");
        card.setAttribute("class", "card mt-3");

        var card_header = document.createElement("div");
        card_header.setAttribute("class", "card-header");
        card_header.innerHTML = `<h4>${gruppo}</h4>`;

        var card_body = document.createElement("div");
        card_body.setAttribute("class", "card-body");
        card_body.setAttribute("id", gruppo+"_mancante");

        card.appendChild(card_header);
        card.appendChild(card_body);

        document.getElementById("esercizi_mancanti").appendChild(card);
    });

    esercizi.forEach(esercizio => {

        const container = document.createElement('div');
        container.classList.add('form-check', 'd-flex', 'flex-row', 'align-items-center');

        const gruppo = esercizio['gruppo'];
        const nome = esercizio['nome'];

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = nome;
        checkbox.id = nome;
        checkbox.classList.add('form-check-input');

        const checkboxLabel = document.createElement('label');
        checkboxLabel.htmlFor = nome;
        checkboxLabel.classList.add('form-check-label', 'mr-3');
        checkboxLabel.appendChild(document.createTextNode(nome));

        container.appendChild(checkbox);
        container.appendChild(checkboxLabel);

        const div = document.getElementById(gruppiDiv[gruppo]+"_mancante");
        if (div) {
            
            const hiddenInputGroup = document.createElement('div');
            hiddenInputGroup.classList.add('row');

            const createHiddenInput = (id, label) => {
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'number';
                hiddenInput.id = id;
                hiddenInput.setAttribute('min', '1');
                hiddenInput.classList.add('form-control', 'hidden-fields', 'form-control-user');
                hiddenInput.style.display = 'none';
                hiddenInput.setAttribute('data-checkbox', nome);

                const labelHidden = document.createElement('label');
                labelHidden.htmlFor = hiddenInput.id;
                labelHidden.id = "label"+hiddenInput.id;
                labelHidden.classList.add('form-control-label', 'hidden-fields');
                labelHidden.style.display = 'none';
                labelHidden.setAttribute('data-checkbox', nome);
                labelHidden.innerHTML = label;

                const colDiv = document.createElement('div');
                colDiv.classList.add('col-auto');
                colDiv.appendChild(labelHidden);
                colDiv.appendChild(hiddenInput);

                return colDiv;
            };

            hiddenInputGroup.appendChild(createHiddenInput('n_serie_' + nome, 'Numero di serie'));
            hiddenInputGroup.appendChild(createHiddenInput('n_rep_' + nome, 'Numero di ripetizioni per serie'));
            hiddenInputGroup.appendChild(createHiddenInput('rec_' + nome, 'Recupero tra le serie(sec)'));

            container.appendChild(hiddenInputGroup);

            div.appendChild(container);

            
            // Aggiungi un event listener al cambio di stato della checkbox
            checkbox.addEventListener('change', function() {
                const nomeCheckbox = this.id;
                //const hiddenFields = div.querySelectorAll('.hidden-fields');
                const hiddenFields = [];
                hiddenFields.push(document.getElementById('n_serie_' + nome));
                hiddenFields.push(document.getElementById('n_rep_' + nome));
                hiddenFields.push(document.getElementById('rec_' + nome));
                hiddenFields.forEach(field => {
                    if (field.getAttribute('data-checkbox') === nomeCheckbox) {
                        var label = document.getElementById("label"+field.id);
                        label.style.display = this.checked ? 'block' : 'none';
                        field.style.display = this.checked ? 'block' : 'none';
                    }
                });
            });
        }
    });

}

function check_scheda() {
    var form_fields = document.getElementsByTagName("input");
    for (var i = 0; i < form_fields.length; i++) {
        /*controllo che gli input siano type checkbox e che sono stati cliccati, se cosi' prendo i dati correlati
            numero di serie, numero di ripetizioni, numero di recupero tra le serie e li metto in un'array*/
        if (form_fields[i].type == "checkbox" && form_fields[i].checked == true) {
            // Controllo che i valori dei campi numerici siano maggiori o uguali a 1
            var n_serie = parseInt(form_fields[i + 1].value);
            var n_rep = parseInt(form_fields[i + 2].value);
            var rec = parseInt(form_fields[i + 3].value);

            if (isNaN(n_serie) || isNaN(n_rep) || isNaN(rec) || n_serie < 1 || n_rep < 1 || rec < 1) {
                return alert("Compilare i campi numerici in modo corretto (valori maggiori o uguali a 1)");
            }
        }
    }
    componiScheda();
}

function componiScheda(){
    //Composizione data inizio
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
            esercizio.nome=form_fields[i].id;
            esercizio.n_serie = form_fields[i+1].value;
            esercizio.n_rep = form_fields[i+2].value;
            esercizio.rec = form_fields[i+3].value;
            console.log(esercizio);
            form_data.push(esercizio);
        }
    }
    //console.log("array: ",...form_data);

    var form_data_json = JSON.stringify(form_data);
    console.log(form_data_json);

    var req= new XMLHttpRequest();
    req.onload = function() {
        if(this.responseText=='ok'){
            window.location.href="schede.php";
        }
    }
    req.open('put', 'php/logicaSchede.php/scheda/'+id+'/'+data_inizio, true);
    req.send(form_data_json);
}

