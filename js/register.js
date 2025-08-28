// Variabili associate agli elementi del form
const emailInput = document.getElementById('InputEmail');
const passwordInput = document.getElementById('InputPassword');
const repeatPassword = document.getElementById('RepeatPassword');
const form = document.getElementById('register');

// Array per memorizzare le parole italiane
let italianWords = [];
let selectedWords = [];

// ✅ ARRAY PER PRESERVARE L'ORDINE DI SELEZIONE (esattamente 12 parole)
let selectionOrder = [];

// Carica le parole dal file italian.txt
async function loadItalianWords() {
    try {
        const response = await fetch('italian.txt');
        const text = await response.text();
        italianWords = text.split('\n')  // ✅ SISTEMATO: \n invece di \\n
            .map(word => word.trim())
            .filter(word => word.length > 0);
        
        console.log(`Caricate ${italianWords.length} parole italiane`);
        generateRandomWords();
        
    } catch (error) {
        console.error('Errore nel caricamento del file italian.txt:', error);
        // Fallback con parole predefinite
        italianWords = [
            'casa', 'sole', 'mare', 'luna', 'fiore', 'montagna',
            'libro', 'musica', 'amore', 'famiglia', 'strada', 'cielo',
            'tempo', 'vita', 'gioia', 'pace', 'stella', 'acqua',
            'fuoco', 'terra', 'vento', 'bosco', 'giardino', 'porta',
            'finestra', 'ponte', 'fiume', 'lago', 'valle', 'collina',
            'albero', 'foglia', 'radice', 'ramo', 'seme', 'frutto',
            'uccello', 'pesce', 'gatto', 'cane', 'cavallo', 'leone',
            'aquila', 'farfalla', 'ape', 'rosa', 'tulipano', 'girasole'
        ];
        console.log('Utilizzando parole predefinite fallback');
        generateRandomWords();
    }
}

// Genera 12 parole casuali non ripetute
function generateRandomWords() {
    selectedWords = [];
    const usedIndices = new Set();
    
    while (selectedWords.length < 12 && selectedWords.length < italianWords.length) {
        const randomIndex = Math.floor(Math.random() * italianWords.length);
        
        if (!usedIndices.has(randomIndex)) {
            usedIndices.add(randomIndex);
            selectedWords.push(italianWords[randomIndex]);
        }
    }
    
    console.log('Parole generate:', selectedWords);
    updateButtonContent();
}

// ✅ SISTEMATO: Aggiorna il contenuto dei pulsanti Bootstrap
function updateButtonContent() {
    const buttons = document.querySelectorAll('.btn-selectable');
    
    buttons.forEach((button, index) => {
        if (index < selectedWords.length) {
            // ✅ SISTEMATO: textContent invece di innerHTML per sicurezza
            button.textContent = selectedWords[index];
            button.setAttribute('data-value', selectedWords[index]);
            button.disabled = false;
        }
    });
    
    // ✅ SISTEMATO: Reset con classi Bootstrap
    selectionOrder = [];
    document.querySelectorAll('.btn-selectable.selected').forEach(btn => {
        btn.classList.remove('selected', 'btn-primary');
        btn.classList.add('btn-outline-primary');
    });
    
    updateSelectedCount();
}

// ✅ SISTEMATO: Toggle con classi Bootstrap corrette
function toggleWordSelection(button) {
    const word = button.getAttribute('data-value');
    const currentIndex = selectionOrder.indexOf(word);
    
    if (currentIndex > -1) {
        // ✅ DESELEZIONA: Torna a outline Bootstrap
        selectionOrder.splice(currentIndex, 1);
        button.classList.remove('selected', 'btn-primary');
        button.classList.add('btn-outline-primary');
        console.log(`Deselezionata: ${word}. Ordine attuale:`, selectionOrder);
    } else {
        // ✅ SELEZIONA: Diventa solid Bootstrap  
        if (selectionOrder.length < 12) {
            selectionOrder.push(word);
            button.classList.remove('btn-outline-primary');
            button.classList.add('selected', 'btn-primary');
            console.log(`Selezionata: ${word}. Ordine attuale:`, selectionOrder);
        } else {
            alert('Devi selezionare esattamente 12 parole. Deseleziona una parola prima di sceglierne un\'altra.');
            return;
        }
    }
    
    updateSelectedCount();
    updateOrderDisplay();
}

// ✅ SISTEMATO: Display ordine compatibile con Bootstrap
function updateOrderDisplay() {
    const buttons = document.querySelectorAll('.btn-selectable');
    
    buttons.forEach(button => {
        const word = button.getAttribute('data-value');
        const orderIndex = selectionOrder.indexOf(word);
        
        // Rimuovi badge esistente se presente
        const existingBadge = button.querySelector('.order-badge');
        if (existingBadge) {
            existingBadge.remove();
        }
        
        if (orderIndex > -1) {
            // Aggiungi numero di ordine al pulsante selezionato
            const orderBadge = document.createElement('span');
            orderBadge.className = 'order-badge';
            orderBadge.textContent = orderIndex + 1;
            button.appendChild(orderBadge);
            
            // ✅ SISTEMATO: Mantieni solo il testo della parola
            const textNodes = Array.from(button.childNodes).filter(node => 
                node.nodeType === Node.TEXT_NODE
            );
            textNodes.forEach(node => {
                if (node.textContent.trim() !== word) {
                    node.textContent = word;
                }
            });
        }
    });
}

// Gestione pulsanti selezionabili
function initializeSelectableButtons() {
    const selectableButtons = document.querySelectorAll('.btn-selectable');
    
    selectableButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.disabled) return;
            toggleWordSelection(this);
        });
    });
}

// ✅ SISTEMATO: Contatore con colori appropriati
function updateSelectedCount() {
    const selectedCountElement = document.getElementById('selected-count');
    
    if (selectedCountElement) {
        selectedCountElement.textContent = selectionOrder.length;
        
        // Cambia colore in base al numero di selezioni
        if (selectionOrder.length === 0) {
            selectedCountElement.style.color = '#6c757d'; // Grigio
        } else if (selectionOrder.length === 12) {
            selectedCountElement.style.color = '#28a745'; // Verde - tutte selezionate
        } else {
            selectedCountElement.style.color = '#ffc107'; // Giallo - incompleto
        }
    }
    
    // ✅ Tutti i pulsanti rimangono abilitati per permettere modifiche
}

// ✅ Restituisce le parole nell'ordine esatto di selezione
function getSelectedGoals() {
    return selectionOrder.slice();
}

// Funzione per rigenerare le parole
function regenerateWords() {
    selectionOrder = [];
    generateRandomWords();
    console.log('Parole rigenerate, ordine resettato');
}

// ✅ SISTEMATO: Seleziona tutte con Bootstrap
function selectAllWords() {
    selectionOrder = [...selectedWords]; // Seleziona tutte in ordine originale
    document.querySelectorAll('.btn-selectable').forEach(btn => {
        btn.classList.remove('btn-outline-primary');
        btn.classList.add('selected', 'btn-primary');
    });
    updateSelectedCount();
    updateOrderDisplay();
    console.log('✅ Selezionate tutte le 12 parole:', selectionOrder);
}

// ✅ SISTEMATO: Deseleziona tutte con Bootstrap
function clearAllSelections() {
    selectionOrder = [];
    document.querySelectorAll('.btn-selectable.selected').forEach(btn => {
        btn.classList.remove('selected', 'btn-primary');
        btn.classList.add('btn-outline-primary');
        // Rimuovi badge
        const badge = btn.querySelector('.order-badge');
        if (badge) badge.remove();
    });
    updateSelectedCount();
    console.log('✅ Deselezionate tutte le parole');
}

// Inizializza tutto quando la pagina è pronta
document.addEventListener('DOMContentLoaded', function() {
    loadItalianWords();
    initializeSelectableButtons();
});

// Validazione in tempo reale della mail
emailInput.addEventListener('input', function(event) {
    const email = event.target.value;
    if (validateEmail(email)) {
        emailInput.style.border = '1px solid #d1d3e2';
    } else {
        emailInput.style.border = '2px solid red';
    }
});

// Funzione per la validazione della mail
function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+$/;
    return emailRegex.test(email);
}

// Controllo password match
repeatPassword.addEventListener('input', function(event) {
    const passw = event.target.value;
    const mainPassword = passwordInput.value;

    if (passw !== mainPassword) {
        repeatPassword.style.border = '2px solid red';
    } else {
        repeatPassword.style.border = '1px solid #d1d3e2';
    }
});

passwordInput.addEventListener('input', function(event) {
    const passw = event.target.value;
    const mainPassword = repeatPassword.value;

    if (passw !== mainPassword) {
        repeatPassword.style.border = '2px solid red';
    } else {
        repeatPassword.style.border = '1px solid #d1d3e2';
    }
});

// Funzione di validazione della password
function validatePassword(password, repeatPass) {
    return password === repeatPass;
}

// Funzione per mostrare errori
function mostraErrore(messaggio, tipo = 'danger') {
    const divElement = document.getElementById("messaggio_errore");
    divElement.className = `alert alert-${tipo}`;
    divElement.innerHTML = messaggio;
    
    setTimeout(() => {
        divElement.className = '';
        divElement.innerHTML = '';
    }, 5000);
}

// Funzione per evidenziare la sezione seed words
function evidenziaSeedWords() {
    const selectionSection = document.querySelector('.selection-buttons');
    selectionSection.style.border = '2px solid #dc3545';
    selectionSection.style.borderRadius = '5px';
    selectionSection.style.padding = '10px';
    
    setTimeout(() => {
        selectionSection.style.border = '';
        selectionSection.style.borderRadius = '';
        selectionSection.style.padding = '';
    }, 3000);
}

// ✅ VALIDAZIONE: Richiede esattamente 12 parole selezionate
function validateForm() {
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const repeatPass = repeatPassword.value;
    const nome = document.getElementById("FirstName").value.trim();
    const cognome = document.getElementById("LastName").value.trim();
    const telefono = document.getElementById("Phone").value.trim();
    
    // ✅ Recupera le parole nell'ordine esatto di selezione
    const selectedGoals = getSelectedGoals();
    
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password, repeatPass);
    // ✅ RICHIEDE ESATTAMENTE 12 parole
    const isSeedWordsValid = selectedGoals.length === 12;
    const areFieldsFilled = nome && cognome && email && password && repeatPass;
    
    // Validazione step by step
    if (!areFieldsFilled) {
        mostraErrore('Tutti i campi obbligatori devono essere compilati');
        return;
    }
    
    if (!isEmailValid) {
        mostraErrore('Inserire un indirizzo email valido');
        emailInput.focus();
        return;
    }
    
    if (!isPasswordValid) {
        mostraErrore('Le password non corrispondono');
        repeatPassword.focus();
        return;
    }
    
    if (!isSeedWordsValid) {
        mostraErrore(`Devi selezionare esattamente 12 parole seed. Attualmente ne hai selezionate ${selectedGoals.length}.`);
        evidenziaSeedWords();
        return;
    }
    
    console.log(`✅ Selezionate tutte le 12 parole seed nell'ordine:`, selectedGoals);
    
    // Hash della password
    const hash_pass = sha256(email.substring(0, 5) + password);
    
    // Creazione dell'oggetto con i valori dei campi del form
    const data = {
        nome: nome,
        cognome: cognome,
        telefono: telefono,
        email: email,
        pswrd: hash_pass,
        seed_words: selectedGoals, // ✅ Array ordinato (esattamente 12 parole)
        seed_count: selectedGoals.length, // ✅ Sempre 12
        seed_order: selectionOrder // ✅ Backup esplicito dell'ordine
    };
    
    console.log('✅ Dati da inviare con 12 seed words ordinate:', data);
    
    // Disabilita il pulsante durante l'invio
    const submitButton = document.getElementById('form_invio');
    submitButton.disabled = true;
    submitButton.value = 'Registrazione in corso...';
    
    const JSONdata = JSON.stringify(data);
    
    const req = new XMLHttpRequest();
    req.onload = function() {
        submitButton.disabled = false;
        submitButton.value = 'Register Account';
        
        if (req.status === 200) {
            console.log('✅ Registrazione completata con successo');
            mostraErrore('Registrazione completata con 12 parole seed! Reindirizzamento in corso...', 'success');
            
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
            
        } else if (req.status === 409) {
            mostraErrore('Email già registrata. Utilizzare un altro indirizzo email.');
        } else {
            console.error('Errore registrazione:', req.status, req.responseText);
            mostraErrore('Errore durante la registrazione. Riprovare più tardi.');
        }
    };
    
    req.onerror = function() {
        submitButton.disabled = false;
        submitButton.value = 'Register Account';
        console.error('Errore di rete');
        mostraErrore('Errore di connessione. Controllare la connessione internet.');
    };
    
    req.open("POST", "php/register.php/users/", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSONdata);
}
