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

            const hiddenInput1 = document.createElement('input');
            hiddenInput1.type = 'number';
            hiddenInput1.id = 'n_serie_' + nome;
            hiddenInput1.classList.add('form-control', 'hidden-fields', 'form-control-user');
            hiddenInput1.style.display = 'none';
            hiddenInput1.setAttribute('data-checkbox', nome);
            

            const labelHidden1 = document.createElement('label');
            labelHidden1.htmlFor = hiddenInput1.id;
            labelHidden1.classList.add('form-control-label', 'hidden-fields');
            labelHidden1.style.display = 'none';
            labelHidden1.setAttribute('data-checkbox', nome);
            labelHidden1.innerHTML = "Numero di serie";
            div.appendChild(labelHidden1);
            div.appendChild(hiddenInput1);
            
            const hiddenInput2 = document.createElement('input');
            hiddenInput2.type = 'number';
            hiddenInput2.id = 'n_rep_' + nome;
            hiddenInput2.classList.add('form-control', 'hidden-fields', 'form-control-user');
            hiddenInput2.style.display = 'none';
            hiddenInput2.setAttribute('data-checkbox', nome);
            

            const labelHidden2 = document.createElement('label');
            labelHidden2.htmlFor = hiddenInput2.id;
            labelHidden2.classList.add('form-control-label', 'hidden-fields');
            labelHidden2.style.display = 'none';
            labelHidden2.setAttribute('data-checkbox', nome);
            labelHidden2.innerHTML = "Numero di ripetizioni per serie";
            div.appendChild(labelHidden2);
            div.appendChild(hiddenInput2);

            const hiddenInput3 = document.createElement('input');
            hiddenInput3.type = 'number';
            hiddenInput3.id = 'rec_' + nome;
            hiddenInput3.classList.add('form-control', 'hidden-fields', 'form-control-user');
            hiddenInput3.style.display = 'none';
            hiddenInput3.setAttribute('data-checkbox', nome);
            

            const labelHidden3 = document.createElement('label');
            labelHidden3.htmlFor = hiddenInput3.id;
            labelHidden3.classList.add('form-control-label', 'hidden-fields');
            labelHidden3.style.display = 'none';
            labelHidden3.setAttribute('data-checkbox', nome);
            labelHidden3.innerHTML = "Recupero tra le serie";
            div.appendChild(labelHidden3);
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
