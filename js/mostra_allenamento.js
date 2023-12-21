window.onload = function() {
    get_data_from_server();
}

function get_data_from_server() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    var req=new XMLHttpRequest();

    req.onload=function() {
        if(this.responseText == "ERROR"){
            window.location.href = "allenamenti.php";
        }
        else{
            var data = JSON.parse(this.responseText);
            console.log(data);
            smista_esercizi(data);
        }
    };

    req.open('GET',"php/logicaAllenamento.php/a_e/"+id,true);
    req.send();
}

function smista_esercizi(data){
    let partiData = data[0]['data'].split('-');
    let anno = partiData[0];
    let mese = partiData[1];
    let giorno = partiData[2];
    document.getElementById("allenamento").innerHTML += " "+`${giorno}-${mese}-${anno}`;
    for(var i=0; i<data.length; i++){

        document.getElementById("card_"+data[i]['gruppo']).style.display="block";
        var card = document.getElementById(data[i]['gruppo']);
        var p = document.createElement("p");
        p.innerHTML = data[i]["esercizio"]+" "+data[i]["serie"]+"x"+data[i]["ripetizioni"]+" "+data[i]["recupero"]+"\"";
        if(data[i]['peso']!=0){
            p.innerHTML += " svolto con "+data[i]['peso']+"kg";
        }
        
        card.appendChild(p);
    }
}