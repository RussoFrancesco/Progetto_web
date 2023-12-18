//aggiunge un event listener al click di un elemento con ID 'add_allenamento',
// reindirizzando l'utente a 'allenamento.php' quando viene cliccato.
if(document.getElementById('add_allenamento')){
    const iniziaAllenamento=document.getElementById('add_allenamento');
    iniziaAllenamento.addEventListener('click', function(){  window.location.href = 'allenamento.php'; });
}

if(document.getElementById('inizia_allenamento')){
    const iniziaAllenamento=document.getElementById('inizia_allenamento');
    iniziaAllenamento.addEventListener('click', allenamento);
}

console.log(window.location.href);

if(window.location.href == 'http://localhost/Progetto_web/allenamento.php'){
    window.onload = function(){
        recuperaEserciziDallaScheda();
    }
}

function allenamento(){
    var all= create_allenamento();
}

function scheda(esercizi) {
    const gruppiDiv = [
        'pettorali',
        'dorsali',
        'spalle',
        'tricipiti',
        'bicipiti',
        'addome',
        'gambe'
    ];

    const div_scheda = document.getElementById('scheda');

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

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'checkbox_' + gruppiDiv[i];
        checkbox.id = 'checkbox_' + gruppiDiv[i];
        checkbox.classList.add('form-check-input');

        const checkboxLabel = document.createElement('label');
        checkboxLabel.htmlFor = 'checkbox_' + gruppiDiv[i];
        checkboxLabel.classList.add('form-check-label');
        checkboxLabel.appendChild(document.createTextNode(gruppiDiv[i]));

        checkbox.addEventListener('change', function () {
            const div_gruppo = document.getElementById('card_' + gruppiDiv[i]);
            if (this.checked) {
                div_gruppo.style.display = 'block';
            } else {
                div_gruppo.style.display = 'none';
            }
        });

        checkboxDiv.appendChild(checkbox);
        checkboxDiv.appendChild(checkboxLabel);

        // Aggiunta degli elementi al DOM
        card.appendChild(card_header);
        card.appendChild(card_body);
        div_scheda.appendChild(checkboxDiv);
        div_scheda.appendChild(card);
    }

    for(i=0; i<esercizi.length; i++) {
        const gruppo = esercizi[i]['gruppo'];
        const div_card = document.getElementById(gruppo+"_body");
        const p_esercizio = document.createElement("p");
        p_esercizio.innerHTML = esercizi[i]['nome']+" "+esercizi[i]['serie']+"x"+esercizi[i]['ripetizioni']+" "+esercizi[i]['recupero']+"\"";
        div_card.appendChild(p_esercizio);
    };
}



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



function recuperaEserciziDallaScheda(){
    req=new XMLHttpRequest();

    req.onload = function(){
        console.log(this.responseText);
        var data = JSON.parse(this.responseText);
        scheda(data);
    };

    req.open("GET", "php/logicaAllenamento.php/schede/", true);
    req.send();

    }



