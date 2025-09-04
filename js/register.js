// Variabili associate agli elementi del form
const emailInput = document.getElementById('InputEmail');
const passwordInput = document.getElementById('InputPassword');
const repeatPassword = document.getElementById('RepeatPassword');
const form = document.getElementById('register');

// Array per memorizzare le parole italiane
let italianWords = [];
let selectedWords = [];
let selectionOrder = [];

function bytesToHex(bytes) {
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex) {
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    return new Uint8Array(bytes);
}

async function generatePublicKeyFromSeed(selectedWords) {
    const seedPhrase = selectedWords.join(' ');
    console.log('Seed phrase:', seedPhrase);
    
    try {
        const EC = elliptic.ec;
        const ec = new EC('secp256k1');
        
        const hash = sha256.sha256.array(seedPhrase);
        const keyPair = ec.keyFromPrivate(hash);
        
        const publicKey = keyPair.getPublic(false, 'hex');
        
        console.log('Chiave pubblica elliptic.js:', publicKey);
        return publicKey;
        
    } catch (error) {
        console.error('Errore generazione chiave pubblica:', error);
        throw error;
    }
}

async function generatePrivateKeyFromPublic(publicKey) {
    const seedPhrase = selectedWords.join(' ');
    
    try {
        const EC = elliptic.ec;
        const ec = new EC('secp256k1');
        
        const hash = sha256.sha256.array(seedPhrase);
        const keyPair = ec.keyFromPrivate(hash);
        
        const privateKey = keyPair.getPrivate('hex');
        
        console.log('Chiave privata elliptic.js:', privateKey);
        return privateKey;
        
    } catch (error) {
        console.error('Errore generazione chiave privata:', error);
        throw error;
    }
}

function calculateAddressFromPublicKey(publicKey) {
    try {
        const address = sha256.sha256(publicKey);
        console.log('Indirizzo calcolato:', address);
        return address;
        
    } catch (error) {
        console.error('Errore calcolo indirizzo:', error);
        throw error;
    }
}

async function generateWalletKeys() {
    try {
        showProgress('Generazione chiavi crittografiche...', 20);
        
        const EC = elliptic.ec;
        const ec = new EC('secp256k1');
        const hash = sha256.sha256.array(selectedWords.join(' '));
        const keyPair = ec.keyFromPrivate(hash);

        const publicKey = keyPair.getPublic(false, 'hex');
        const privateKey = keyPair.getPrivate('hex');
        
        const address = sha256.sha256(publicKey);
        
        console.log('- Public Key:', publicKey);
        console.log('- Private Key:', privateKey);
        console.log('- Address (SHA256 semplice):', address);
        
        return {
            publicKey: publicKey,
            privateKey: privateKey,
            address: address
        };
        
    } catch (error) {
        console.error('Errore generazione chiavi:', error);
        throw error;
    }
}

async function registerUser(userData) {
  try {
      console.log('📤 Invio dati:', userData);
      
      const response = await fetch('php/register.php/users/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
      });

      console.log('📥 Status risposta:', response.status);
      console.log('📥 Headers:', response.headers);
      
      const responseText = await response.text();
      console.log('Risposta completa (testo):', responseText);
      console.log('Lunghezza risposta:', responseText.length);
      
      if (!responseText || responseText.trim() === '') {
          console.error('Risposta vuota dal server!');
          throw new Error('Empty response from server');
      }
      
      try {
          const data = JSON.parse(responseText);
          console.log('JSON parsato correttamente:', data);
          return data;
      } catch (jsonError) {
          console.error('Errore parsing JSON:', jsonError);
          console.error('Testo che ha causato errore:', responseText);
          throw new Error(`JSON parse failed: ${jsonError.message}`);
      }

  } catch (error) {
      console.error('Errore registrazione completo:', error);
      throw error;
  }
}




// Verifica wallet con async/await
async function checkWallet(userId) {
    try {
        const response = await fetch(`php/get_wallet.php?user_id=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success && data.wallet && data.wallet.address) {
                console.log('Wallet trovato:', data.wallet.address);
                return data.wallet;
            }
        } else if (response.status === 404) {
            console.log('Wallet non ancora pronto');
            return null;
        }
        
        throw new Error(`Wallet check failed: ${response.status}`);

    } catch (error) {
        console.warn('Errore verifica wallet:', error);
        return null;
    }
}

// Attesa wallet con async/await e retry
async function waitForWallet(userId, submitButton) {
  // Verifica che userId sia valido
  if (!userId || userId === undefined || userId === null) {
      console.error('❌ User ID non valido:', userId);
      throw new Error('User ID is required for wallet creation');
  }
  
  console.log('🔍 Inizio attesa wallet per user ID:', userId);
  
  const retryDelay = 5000; // 5 secondi
  let attempt = 0;

  while (true) {
      attempt++;
      
      submitButton.value = `Creazione wallet Circular... (${attempt})`;
      
      console.log(`🔍 Tentativo ${attempt} - Verifica wallet per user ID: ${userId}`);

      // Verifica wallet
      const wallet = await checkWallet(userId);
      if (wallet) {
          console.log(`Wallet Circular Protocol trovato dopo ${attempt} tentativi!`);
          return wallet; // Ritorna l'oggetto wallet completo (con txid)
      }

      console.log(`Attesa ${retryDelay/1000} secondi prima del prossimo tentativo...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
  }
}


function showProgress(message, percentage = 0) {
    const container = document.getElementById('messaggio_errore');
    container.innerHTML = `
        <div class="alert alert-info">
            <div class="d-flex align-items-center">
                <div class="spinner-border spinner-border-sm me-2" role="status">
                </div>
                <span>${message}</span>
            </div>
            ${percentage > 0 ? `
            <div class="progress mt-2" style="height: 8px;">
                <div class="progress-bar progress-bar-striped progress-bar-animated bg-info" 
                     style="width: ${percentage}%"></div>
            </div>
            ` : ''}
        </div>
    `;
}

function hideProgress() {
    const container = document.getElementById('messaggio_errore');
    container.innerHTML = '';
    container.className = '';
}

function mostraErrore(messaggio, tipo = 'danger') {
    const divElement = document.getElementById("messaggio_errore");
    divElement.className = `alert alert-${tipo}`;
    divElement.innerHTML = messaggio;
    
    setTimeout(() => {
        divElement.className = '';
        divElement.innerHTML = '';
    }, 5000);
}

function downloadWalletFile(seedWords, publicKey, privateKey, walletAddress, txid = null) {
  if (!walletAddress) {
      console.error('❌ Wallet address è obbligatorio!');
      throw new Error('Wallet address from Circular Protocol is required');
  }
  
  const seedPhrase = seedWords.join(' ');
  const walletContent = `BLOCKCHAIN WALLET INFO
========================

Blockchain: Circular Protocol
Network: 0x8a20baa40c45dc5055aeb26197c203e576ef389d9acb171bd62da11dc5ad72b2
Seed Phrase: ${seedPhrase}
Public Key: ${publicKey}
Private Key: ${privateKey}
Wallet Address: ${walletAddress}

========================
IMPORTANTE: Conserva questo file in un luogo sicuro!
Non condividere mai la tua chiave privata o seed phrase.
Data creazione: ${new Date().toLocaleString('it-IT')}
Vai su https://circularlabs.io/nero_testnet# per gestire il tuo wallet.
Vai su https://circularprotocol.io/faucet per ottenere fondi di test.
`;

  const blob = new Blob([walletContent], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  const addressSuffix = walletAddress.replace('0x', '').substring(0, 10);
  downloadLink.download = `circular_wallet_${addressSuffix}_${Date.now()}.txt`;
  
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  window.URL.revokeObjectURL(url);
  
  console.log('File wallet Circular Protocol scaricato:', downloadLink.download);
}

async function validateForm() {
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const repeatPass = repeatPassword.value;
  const nome = document.getElementById("FirstName").value.trim();
  const cognome = document.getElementById("LastName").value.trim();
  const telefono = document.getElementById("Phone").value.trim();
  
  const selectedGoals = getSelectedGoals();
  
  // Validazioni base
  const isEmailValid = validateEmail(email);
  const isPasswordValid = validatePassword(password, repeatPass);
  const isSeedWordsValid = selectedGoals.length === 12;
  const areFieldsFilled = nome && cognome && email && password && repeatPass;
  
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

  console.log(`Inizio processo registrazione per: ${email}`);

  const submitButton = document.getElementById('form_invio');
  const originalButtonText = submitButton.value;
  
    try {
      console.log('Generazione chiavi in corso...');
      const walletKeys = await generateWalletKeys();
      const publicKey = walletKeys.publicKey;
      const privateKey = walletKeys.privateKey;
      
      const userData = {
          nome: nome,
          cognome: cognome,
          telefono: telefono,
          email: email,
          pswrd: sha256(email.substring(0, 5) + password),
          public_key: walletKeys.publicKey,
          address: walletKeys.address,
      };

      console.log('Invio dati con chiave pubblica utente:', publicKey.substring(0, 20) + '...');
      
      const serverResponse = await registerUser(userData);
      
      const userId = serverResponse.user_id;
      console.log('User ID ricevuto:', userId);
      
      let wallet;

      if (serverResponse.wallet && serverResponse.wallet.address) {
          // Wallet già disponibile
          console.log(' Wallet Circular Protocol disponibile immediatamente');
          wallet = serverResponse.wallet;
          showProgress('Wallet Circular ricevuto, preparazione download...', 90);
          
      } else {
          console.log('Wallet non pronto, inizio attesa per user ID:', userId);
          showProgress('Creazione wallet Circular Protocol in corso...', 60);
          
          wallet = await waitForWallet(userId, submitButton);
          showProgress('Wallet Circular Protocol creato con successo!', 90);
      }

      showProgress('Preparazione file wallet Circular...', 95);
      await new Promise(resolve => setTimeout(resolve, 500)); // Pausa per UI
      
      downloadWalletFile(
          selectedGoals, 
          publicKey, 
          privateKey, 
          walletKeys.address,
          wallet.txid
      );

      hideProgress();
      submitButton.disabled = false;
      submitButton.value = originalButtonText;
      
      mostraErrore('Registrazione e wallet Circular Protocol creati con successo! File scaricato.', 'success');
      
      console.log('🎉 Processo Circular Protocol completato con successo!');
      console.log('📋 Wallet info:', {
          address: walletKeys.address,
          txid: wallet.txid,
          blockchain_verified: wallet.txid ? true : false
      });
      
      // Redirect dopo successo
      setTimeout(() => {
          window.location.href = "login.html";
      }, 3000);

  } catch (error) {
      console.error('❌ Errore durante la registrazione:', error);
      
      hideProgress();
      submitButton.disabled = false;
      submitButton.value = originalButtonText;
      
      if (error.message === 'EMAIL_EXISTS') {
          mostraErrore('Email già registrata. Utilizzare un altro indirizzo email.');
      } else if (error.message.includes('fetch')) {
          mostraErrore('Errore di connessione. Controllare la connessione internet.');
      } else if (error.message.includes('Circular Protocol')) {
          mostraErrore('Errore nella creazione del wallet Circular Protocol. Riprova più tardi.');
      } else if (error.message.includes('User ID')) {
          mostraErrore('Errore nella registrazione utente. Riprova più tardi.');
      } else {
          mostraErrore('Errore durante la registrazione. Riprovare più tardi.');
      }
  }
}

async function loadItalianWords() {
    try {
        const response = await fetch('italian.txt');
        const text = await response.text();
        italianWords = text.split('\n')
            .map(word => word.trim())
            .filter(word => word.length > 0);
        
        console.log(`Caricate ${italianWords.length} parole italiane`);
        generateRandomWords();
        
    } catch (error) {
        console.error('Errore nel caricamento del file italian.txt:', error);
    }
}

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

function updateButtonContent() {
    const buttons = document.querySelectorAll('.btn-selectable');
    
    buttons.forEach((button, index) => {
        if (index < selectedWords.length) {
            button.textContent = selectedWords[index];
            button.setAttribute('data-value', selectedWords[index]);
            button.disabled = false;
        }
    });
    
    selectionOrder = [];
    document.querySelectorAll('.btn-selectable.selected').forEach(btn => {
        btn.classList.remove('selected', 'btn-primary');
        btn.classList.add('btn-outline-primary');
    });
    
    updateSelectedCount();
}

function toggleWordSelection(button) {
    const word = button.getAttribute('data-value');
    const currentIndex = selectionOrder.indexOf(word);
    
    if (currentIndex > -1) {
        selectionOrder.splice(currentIndex, 1);
        button.classList.remove('selected', 'btn-primary');
        button.classList.add('btn-outline-primary');
        console.log(`Deselezionata: ${word}. Ordine attuale:`, selectionOrder);
    } else {
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

function updateOrderDisplay() {
    const buttons = document.querySelectorAll('.btn-selectable');
    
    buttons.forEach(button => {
        const word = button.getAttribute('data-value');
        const orderIndex = selectionOrder.indexOf(word);
        
        const existingBadge = button.querySelector('.order-badge');
        if (existingBadge) {
            existingBadge.remove();
        }
        
        if (orderIndex > -1) {
            const orderBadge = document.createElement('span');
            orderBadge.className = 'order-badge';
            orderBadge.textContent = orderIndex + 1;
            button.appendChild(orderBadge);
            
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

function initializeSelectableButtons() {
    const selectableButtons = document.querySelectorAll('.btn-selectable');
    
    selectableButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.disabled) return;
            toggleWordSelection(this);
        });
    });
}

function updateSelectedCount() {
    const selectedCountElement = document.getElementById('selected-count');
    
    if (selectedCountElement) {
        selectedCountElement.textContent = selectionOrder.length;
        
        if (selectionOrder.length === 0) {
            selectedCountElement.style.color = '#6c757d';
        } else if (selectionOrder.length === 12) {
            selectedCountElement.style.color = '#28a745';
        } else {
            selectedCountElement.style.color = '#ffc107';
        }
    }
}

function getSelectedGoals() {
    return selectionOrder.slice();
}

function regenerateWords() {
    selectionOrder = [];
    generateRandomWords();
    console.log('Parole rigenerate, ordine resettato');
}

function selectAllWords() {
    selectionOrder = [...selectedWords];
    document.querySelectorAll('.btn-selectable').forEach(btn => {
        btn.classList.remove('btn-outline-primary');
        btn.classList.add('selected', 'btn-primary');
    });
    updateSelectedCount();
    updateOrderDisplay();
    console.log('✅ Selezionate tutte le 12 parole:', selectionOrder);
}

function clearAllSelections() {
    selectionOrder = [];
    document.querySelectorAll('.btn-selectable.selected').forEach(btn => {
        btn.classList.remove('selected', 'btn-primary');
        btn.classList.add('btn-outline-primary');
        const badge = btn.querySelector('.order-badge');
        if (badge) badge.remove();
    });
    updateSelectedCount();
    console.log('✅ Deselezionate tutte le parole');
}

emailInput.addEventListener('input', function(event) {
    const email = event.target.value;
    if (validateEmail(email)) {
        emailInput.style.border = '1px solid #d1d3e2';
    } else {
        emailInput.style.border = '2px solid red';
    }
});

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+$/;
    return emailRegex.test(email);
}

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

function validatePassword(password, repeatPass) {
    return password === repeatPass;
}

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

document.addEventListener('DOMContentLoaded', function() {
    loadItalianWords();
    initializeSelectableButtons();
});