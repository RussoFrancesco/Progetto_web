window.onload = function() {
    home();
    // Aggiunge un event listener al pulsante "calcola_bmi" che chiama la funzione "validaForm" quando viene cliccato
    document.getElementById("calcola_bmi").addEventListener("click", validaForm);
}

// Funzione per validare il form
function validaForm() {
    const form = document.forms['bmi']; // Ottiene il form con nome 'bmi' tra tutti i form del documento
    for(let i = 0; i < form.length; i++) {
        // Itera attraverso gli elementi del modulo per controllare se sono validi
        if(!check_input(form[i])){ // Controlla se l'input non è valido
            return alert("Inserisci un input valido");
        }
    }

    calcola_bmi(); // Se tutti gli input sono validi, calcola il BMI
}

function check_input(input){
    const regex = /^[0-9]+(\.[0-9]+)?$/;  // Espressione regolare per controllare i numeri
    return regex.test(input.value); // Restituisce true se l'input soddisfa la regola
}


// Funzione per calcolare il BMI
function calcola_bmi(){
    const peso = document.getElementById("peso").value;
    const altezza = document.getElementById("altezza").value/100;
    const bmi = (peso / (altezza*altezza)).toFixed(2);

    // Seleziona l'elemento risultato del BMI
    const risultatoBMI = document.getElementById("risultato_bmi");

    // Imposta la classe per allineare il contenuto al centro utilizzando le classi di Bootstrap
    risultatoBMI.classList.add("d-flex", "flex-column", "align-items-center");

    // Mostra il risultato del BMI al centro
    risultatoBMI.innerHTML = "<div class='text-center mb-4'>Il risultato è " + bmi + "</div>";

    // Crea un nuovo elemento div per contenere ulteriori dettagli del risultato
    const divRisultato = document.createElement("div");
    divRisultato.classList.add("text-center");
    risultatoBMI.appendChild(divRisultato);

    // Crea un elemento <h4> per visualizzare ulteriori informazioni sotto il risultato
    const h4 = document.createElement("h4");
    divRisultato.appendChild(h4);

    //valuto il risultato per ogni bmi 
    if (bmi <= 18.5){
        h4.style.color = "#4e73df";
        h4.innerHTML = "Sei sottopeso";
    }
    else if (bmi >= 18.6 && bmi <= 24.9){
        h4.style.color = "#1cc88a";
        h4.innerHTML = "Sei normopeso";
    }
    else if (bmi >= 24.5 && bmi <= 29.9){
        h4.style.color = "#f6c23e";
        h4.innerHTML = "Sei sovrappeso";
    }
    else if (bmi >= 30 && bmi <= 34.9){
        h4.style.color = "#ffa500";
        h4.innerHTML = "Sei obeso";
    }
    else if (bmi >= 35){
        h4.style.color = "#e74a3b";
        h4.innerHTML = "Sei estremamente obeso";
    }

    //data corrente
    const today=new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Aggiunge lo zero iniziale se il mese è inferiore a 10 +1 perchè parte da 0
    const day = String(today.getDate()).padStart(2, '0'); // Aggiunge lo zero iniziale se il giorno è inferiore a 10
    const formattedDate = `${year}-${month}-${day}`;

    // Crea una richiesta AJAX per inviare il BMI e la data al server
    var req = new XMLHttpRequest();

    req.onload = function(){
        if(this.responseText == 'ok'){
            alert("Inserito il bmi nel database");
            window.location.reload();
        }
    };

    
    req.open("POST", "php/bmi.php/bmi/"+bmi+"/"+formattedDate,true) //Faccio insert nella tabella BMI con data corrente
    req.send();

}