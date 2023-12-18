window.onload = function() {
    document.getElementById("calcola_bmi").addEventListener("click", validaForm);
}

function validaForm() {
    const form = document.forms['bmi'];
    for(let i = 0; i < form.length; i++) {
        if(form[i].type == 'number'){
            const valore = form[i].value;
            const regex = /^[0-9.]+$/;
            if (!regex.test(valore)) {
                return alert("Inserire dei valori maggiori di 0, per i valori decimali usare un punto");
            }
        }
    }

    calcola_bmi();
}



function calcola_bmi(){
    const peso = document.getElementById("peso").value;
    const altezza = document.getElementById("altezza").value/100;
    const bmi = peso / (altezza*altezza);

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

}