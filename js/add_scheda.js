window.addEventListener('load', function() {
    get_esercizi();
    document.getElementById("invio_scheda").addEventListener('click', componiScheda);
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
        dorsali: 'dorsali',
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

        const checkboxLabel = document.createElement('label');
        checkboxLabel.htmlFor = nome;
        checkboxLabel.classList.add('form-check-label');
        checkboxLabel.appendChild(document.createTextNode(nome));

        const div = document.getElementById(gruppiDiv[gruppo]);
        if (div) {
            div.appendChild(checkbox);
            div.appendChild(checkboxLabel);
            div.appendChild(document.createElement('br'));

            const hiddenInputGroup = document.createElement('div');
            hiddenInputGroup.classList.add('row');

            const createHiddenInput = (id, label) => {
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'number';
                hiddenInput.id = id;
                hiddenInput.classList.add('form-control', 'hidden-fields', 'form-control-user');
                hiddenInput.style.display = 'none';
                hiddenInput.setAttribute('data-checkbox', nome);

                const labelHidden = document.createElement('label');
                labelHidden.htmlFor = hiddenInput.id;
                labelHidden.classList.add('form-control-label', 'hidden-fields');
                labelHidden.style.display = 'none';
                labelHidden.setAttribute('data-checkbox', nome);
                labelHidden.innerHTML = label;

                const colDiv = document.createElement('div');
                colDiv.classList.add('col-auto');
                colDiv.appendChild(labelHidden);
                colDiv.appendChild(hiddenInput);

                return colDiv;
            };

            hiddenInputGroup.appendChild(createHiddenInput('n_serie_' + nome, 'Numero di serie'));
            hiddenInputGroup.appendChild(createHiddenInput('n_rep_' + nome, 'Numero di ripetizioni per serie'));
            hiddenInputGroup.appendChild(createHiddenInput('rec_' + nome, 'Recupero tra le serie'));

            div.appendChild(hiddenInputGroup);

            
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



function componiScheda(){
    //Composizione data inizio
    const data=new Date();
    const data_inizio=data.getFullYear()+'-'+(data.getMonth()+1)+'-'+data.getDate();

    var checkboxes=document.getElementsByTagName("input");
    
    for(var i=0;i<checkboxes.length;i++){
        if (checkboxes[i].type=="checkbox" && checkboxes[i].checked == true){
            var nome=checkboxes[i].id;
        }
    }
}
