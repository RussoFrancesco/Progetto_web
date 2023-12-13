window.onload = function() {
    get_esercizi();
}

function get_esercizi() {
    var req = new XMLHttpRequest();
    
    req.onload = function() {
        var data = this.responseText;
        data = JSON.parse(data);
        insert_esercizi(data);
    }

    req.open('get', 'php/get_esercizi.php/esercizi', true);
    req.send();

}

function insert_esercizi(data) {
    const gruppiDiv = {
        pettorali: 'pettorali',
        dorsali: 'dorsale',
        spalle: 'spalle',
        tricipiti: 'tricipiti',
        bicipiti: 'bicipiti',
        addome: 'addome',
        gambe: 'gambe'
    };

    data.forEach(esercizio => {
        const gruppo = esercizio['gruppo'];
        const nome = esercizio['nome'];

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = nome;
        checkbox.id = nome;
        checkbox.classList.add('form-check-input');

        const label = document.createElement('label');
        label.htmlFor = nome;
        label.classList.add('form-check-label')
        label.appendChild(document.createTextNode(nome));

        const div = document.getElementById(gruppiDiv[gruppo]);
        if (div) {
            div.appendChild(checkbox);
            div.appendChild(label);
            div.appendChild(document.createElement('br'));
        }
    });
}

    

