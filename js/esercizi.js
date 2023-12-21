window.onload = function() {
    get_esercizi();
    //get_esercizi_scheda();
    document.getElementById("confirm_button").addEventListener("click", checkform);
}

function get_esercizi() {
    var req = new XMLHttpRequest();
    
    req.onload = function() {
        var data = JSON.parse(req.responseText);
        console.log(data);
        put_esercizi(data);
    }

    req.open('GET','php/esercizi.php/esercizi',true);
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
    btn.classList.add('btn', 'btn-primary');
    btn.setAttribute('id', esercizio.nome);
    btn.setAttribute("data-toggle", "modal");
    btn.setAttribute("data-target", "#insertModal");
    btn.innerHTML = 'Aggiungi alla scheda';
    card_header.appendChild(btn);
    btn.addEventListener('click', function(){
        const modal = document.getElementById("insertModal");
        const input = modal.querySelector(".input-hidden");

        input.setAttribute("value", this.id);
        
    })

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
    var esercizio = form_fields[0];
    for (var i = 1; i < form_fields.length; i++) {
        
        
    }
    //insert_esercizi();
}