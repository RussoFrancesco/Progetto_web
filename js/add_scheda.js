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
        var data = this.responseText;
        data = JSON.parse(data);
        insert_esercizi(data);
    }

    req.open('get', 'php/esercizi.php/esercizi', true);
    req.send();

}

//funzione per l'inserimento degli esercizi
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

        //creo una checkbox per ogni esercizio con id= al nome dell'esercizio stesso 
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = nome;
        checkbox.id = nome;
        checkbox.classList.add('form-check-input');

        //Creo la rispettiva label 
        const checkboxLabel = document.createElement('label');
        checkboxLabel.htmlFor = nome;
        checkboxLabel.classList.add('form-check-label');
        checkboxLabel.appendChild(document.createTextNode(nome));

        //recupero il div per il singolo gruppo
        const div = document.getElementById(gruppiDiv[gruppo]);

        if (div) {

            //appendo al DOM la checkbox la laber ed un <br>
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
    req.open('post', 'php/logicaSchede.php/scheda/'+data_inizio, true);
    req.send(form_data_json);
}