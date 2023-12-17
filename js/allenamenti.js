if(document.getElementById('add_allenamento')){
    const iniziaAllenamento=document.getElementById('add_allenamento');
    iniziaAllenamento.addEventListener('click', function(){  window.location.href = 'allenamento.php'; });
}

if(document.getElementById('inizia_allenamento')){
    const iniziaAllenamento=document.getElementById('inizia_allenamento');
    iniziaAllenamento.addEventListener('click', allenamento);
}

function allenamento(){
    create_allenamento();
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
        console.log(this.responseText);
        
        
    };

    req.open("POST", "php/logicaAllenamento.php/allenamenti/"+formattedDate, true);
    req.send();

}

costruisci_allenamento();
