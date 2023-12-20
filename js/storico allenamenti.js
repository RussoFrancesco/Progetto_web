window.onload = function() {
    visualizzazioneStoricoAllenamenti();
}

function visualizzazioneStoricoAllenamenti() {
    var req= new XMLHttpRequest();

    req.onload=function(){}

    req.open("GET", "php/logicaAllenamento.php/allenamenti/storico", true);
    req.send();
}

function caricaStoricoAllenamentiAll() {
    var div= document.getElementById("storico_allenamenti");
}