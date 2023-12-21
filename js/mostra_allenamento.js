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
            console.log(this.responseText);
        }
    };

    req.open('GET',"php/logicaAllenamento.php/a_e/"+id,true);
    req.send();
}



function costruisci_allenamento() {

}