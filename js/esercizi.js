window.onload = function() {
    home();
    get_esercizi();
    get_esercizi_scheda();
    document.getElementById("confirm_button").addEventListener("click", checkform);
    document.getElementById("delete_button").addEventListener("click", elimina_esercizio);

}

function get_esercizi() {
    var req = new XMLHttpRequest();
    
    req.onload = function() {
        var data = JSON.parse(req.responseText);
        console.log(data);
        put_esercizi(data);
    }

    req.open('GET','php/esercizi.php/esercizi/attuale',true);
    req.send();
}

function get_esercizi_scheda() {
    var req = new XMLHttpRequest();

    req.onload = function() {
        
        var data = JSON.parse(req.responseText);
        console.log(data);
        modifica_bottoni(data);
    }

    req.open('GET','php/logicaSchede.php/e_s/attuale',true);
    req.send();
}

function put_esercizi(esercizi) {
    
    // Esempio di utilizzo della classe Bootstrap per migliorare la visualizzazione
esercizi.forEach(esercizio => {
    const div = document.getElementById(esercizio.gruppo);
    const div_col = document.createElement('div');
    div_col.classList.add('col-md-4');
    div.appendChild(div_col);
  
    const card = document.createElement('div');
    card.classList.add('card', 'exercise-card');
    div_col.appendChild(card);
  
    const card_header = document.createElement('div');
    card_header.classList.add('card-header', 'd-flex', 'justify-content-between', 'align-items-center');
    card.appendChild(card_header);
  
    const h5 = document.createElement('h5');
    h5.classList.add('mb-0');
    h5.innerHTML = esercizio.nome;
    card_header.appendChild(h5);
  
    const btn = document.createElement('button');
    btn.setAttribute('class', 'btn btn-primary');
    btn.setAttribute('id', esercizio.nome);
    btn.setAttribute("data-toggle", "modal");
    btn.setAttribute("data-target", "#insertModal");
    btn.innerHTML = 'Aggiungi alla scheda';
    card_header.appendChild(btn);
    btn.addEventListener('click', set_modal_insert)

    const card_body = document.createElement('div');
    card_body.classList.add('card-body');
    card.appendChild(card_body);
  
    // Aggiunta della GIF (supponendo la funzione caricaGif())
    card_body.appendChild(caricaGif(esercizio.nome));
  });
  
    
}

function caricaGif(esercizio){
    //console.log(esercizio);
    esercizio=esercizio.replaceAll(" ","_");
    esercizio+=".gif";

    const gif = document.createElement("img");
    gif.src="gif/"+esercizio;
    gif.setAttribute("class", "card-img-top");
    gif.setAttribute("alt", esercizio);
    
    return gif
    
}

function checkform(){
    var form_fields = document.getElementsByTagName("input");
    for (var i = 0; i < form_fields.length; i++) {
        if(form_fields[i].type=="number"){
            if(isNaN(form_fields[i].value) || form_fields[i].value<0){
                return alert("Compilare i campi numerici in modo corretto (valori maggiori o uguali a 1)")
            }
        }
    }
    var nome = form_fields[0].value;
    var serie = form_fields[1].value;
    var ripetizioni = form_fields[2].value;
    var recupero = form_fields[3].value;
    console.log(nome, serie, ripetizioni, recupero);

    insert_esercizio(nome, serie, ripetizioni, recupero);
}

function insert_esercizio(nome, serie, ripetizioni, recupero) {
    
    var req = new XMLHttpRequest();

    req.onload = function(){
        console.log(this.responseText);
        if(this.responseText == 'ok'){
            location.reload();
        }
    };

    req.open("POST", "php/logicaSchede.php/e_s/"+nome+"/"+serie+"/"+ripetizioni+"/"+recupero, true);
    req.send(esercizio);
}

function set_modal_insert(){
    const modal = document.getElementById("insertModal");
    const input = modal.querySelector(".hidden_esercizio");

    input.setAttribute("value", this.id);
}

function set_modal_delete(){
    const modal = document.getElementById("deleteModal");
    const input = modal.querySelector(".hidden_esercizio_elimina");

    input.setAttribute("value", this.id);
}

function modifica_bottoni(data){
    const buttons = document.querySelectorAll("button");
    for(let i = 0; i < buttons.length; i++){
        for(let j = 0; j < data.length; j++){
            if(buttons[i].id == data[j].esercizio){
                buttons[i].removeEventListener("click", set_modal_insert);
                buttons[i].setAttribute("data-target", "#deleteModal");
                buttons[i].setAttribute("class", "btn btn-danger");
                buttons[i].innerHTML = "Rimuovi dalla scheda";
                buttons[i].addEventListener("click", set_modal_delete);
            }
        }
    }
}

function elimina_esercizio(){
    const id_esercizio = document.querySelector(".hidden_esercizio_elimina").value;

    var req = new XMLHttpRequest();

    req.onload = function(){
        if(this.responseText=='ok'){
            location.reload();
        }
    };

    req.open("DELETE", "php/logicaSchede.php/e_s/"+id_esercizio, true);
    req.send();

}