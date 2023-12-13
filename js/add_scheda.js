window.addEventListener('load', function() {
    get_esercizi();
});

function get_esercizi() {
    req = new XMLHttpRequest();
    
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

            
            const hiddenInput1 = document.createElement('input');
            hiddenInput1.type = 'text';
            hiddenInput1.id = 'n_serie_'+nome;
            hiddenInput1.classList.add('form-control', 'hidden-fields'); // Aggiungi classi per lo stile e per nascondere i campi
            hiddenInput1.style.display = 'none'; // Nascondi i campi di testo inizialmente
            hiddenInput1.setAttribute('data-checkbox', nome); // Imposta un attributo personalizzato per collegare i campi di testo alla checkbox
            div.appendChild(hiddenInput1);

            const hiddenInput2 = document.createElement('input');
            hiddenInput2.type = 'text';
            hiddenInput2.id = 'n_rep_'+nome;
            hiddenInput2.classList.add('form-control', 'hidden-fields'); // Aggiungi classi per lo stile e per nascondere i campi
            hiddenInput2.style.display = 'none'; // Nascondi i campi di testo inizialmente
            hiddenInput2.setAttribute('data-checkbox', nome); // Imposta un attributo personalizzato per collegare i campi di testo alla checkbox
            div.appendChild(hiddenInput2);

            const hiddenInput3 = document.createElement('input');
            hiddenInput3.type = 'text';
            hiddenInput3.id = 'rec_'+nome;
            hiddenInput3.classList.add('form-control', 'hidden-fields'); // Aggiungi classi per lo stile e per nascondere i campi
            hiddenInput3.style.display = 'none'; // Nascondi i campi di testo inizialmente
            hiddenInput3.setAttribute('data-checkbox', nome); // Imposta un attributo personalizzato per collegare i campi di testo alla checkbox
            div.appendChild(hiddenInput3);
            

            // Aggiungi un event listener al cambio di stato della checkbox
            checkbox.addEventListener('change', function() {
                const nomeCheckbox = this.id;
                const hiddenFields = div.querySelectorAll('.hidden-fields');
                hiddenFields.forEach(field => {
                    if (field.getAttribute('data-checkbox') === nomeCheckbox) {
                        field.style.display = this.checked ? 'block' : 'none';
                    }
                });
            });
        }
    });
}


function submitForm(){

}


    

