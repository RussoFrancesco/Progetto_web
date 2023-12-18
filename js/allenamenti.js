//aggiunge un event listener al click di un elemento con ID 'add_allenamento',
// reindirizzando l'utente a 'allenamento.php' quando viene cliccato.
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

var id_scheda = 0;

// Se l'URL corrente corrisponde a 'http://localhost/Progetto_web/allenamento.php',
// viene eseguita una funzione quando la finestra si carica.
if(window.location.href == 'http://localhost/Progetto_web/allenamento.php'){
    window.onload = function(){
        recuperaEserciziDallaScheda();
        document.getElementById('modifica_scheda').addEventListener('click', function(){
            window.location.href = "pagina_scheda.php?id="+id_scheda;
        });
    }
}

function allenamento(){
    document.getElementById("selezione").style.display = "none";
    document.getElementById("inizia_allenamento").style.display = "none";
    document.getElementById("allenamento").style.display = "block";
    
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
        p_esercizio.innerHTML = esercizi[i]['nome']+" "+esercizi[i]['serie']+"x"+esercizi[i]['ripetizioni']+" "+esercizi[i]['recupero']+"\"";
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
            break
        }
    }
    
    if(checkedOne){
        allenamento();
    }else{
        alert("Selezionare almeno un gruppo muscolare!");
    }



    
}


