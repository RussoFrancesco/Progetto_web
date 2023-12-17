if(document.getElementById('add_allenamento')){
    const iniziaAllenamento=document.getElementById('add_allenamento');
    iniziaAllenamento.addEventListener('click', function(){  window.location.href = 'allenamento.php'; });
}

if(document.getElementById('inizia_allenamento')){
    const iniziaAllenamento=document.getElementById('inizia_allenamento');
    iniziaAllenamento.addEventListener('click', allenamento);
}

function allenamento(){
    var all= create_allenamento();

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

    req.open("POST", "php/logicaAllenamento.php/allenamenti/"+formattedDate, true);
    req.send();
}
}


function costruisci_allenamento(oggettoJson){
    }



