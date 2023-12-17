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
    var data=new Date();
    console.log(data);
    
    req=new XMLHttpRequest();

    req.onload = function(){};

    req.open("POST", "allenamento.php", true);

}