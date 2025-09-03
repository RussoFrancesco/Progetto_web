// Variabili globali
let allNFTs = [];
let filteredNFTs = [];
let currentView = 'grid';
let currentSort = 'date';
let sortDirection = 'desc';

// Inizializzazione pagina
$(document).ready(function() {
    home(); // Per la topbar
    initializePage();
    setupEventHandlers();
    loadNFTs();
});

/**
 * Inizializza la pagina con le configurazioni base
 */
function initializePage() {
    // Nasconde gli stati di errore all'avvio
    $('#emptyState').addClass('d-none');
    $('#noResultsState').addClass('d-none');
    
    // Imposta la vista di default
    updateViewButtons();
}

/**
 * Configura tutti gli event handlers
 */
function setupEventHandlers() {
    // Click su card NFT per mostrare dettagli
    $(document).on('click', '.nft-card', function() {
        const nftId = $(this).data('nft-id');
        showNFTDetails(nftId);
    });
}

/**
 * Carica gli NFT dal database
 */
function loadNFTs() {
    showLoadingState();
    
    $.ajax({
        url: 'php/get_user_nfts.php',
        method: 'GET',
        dataType: 'json',
        xhrFields: { 
            withCredentials: true  // 🚩 IMPORTANTE: Invia i cookie di sessione
        },
        success: function(response) {
            console.log('Risposta NFT:', response);
            
            if (response.success && response.nfts && response.nfts.length > 0) {
                allNFTs = response.nfts;
                filteredNFTs = [...allNFTs];
                displayNFTs();
                updateStats();
                hideLoadingState();
            } else {
                showEmptyState();
            }
        },
        error: function(xhr, status, error) {
            console.error('Errore nel caricamento NFT:', error);
            showEmptyState();
        }
    });
}

/**
 * Visualizza gli NFT nella griglia
 */
function displayNFTs() {
    const container = $('#nftContainer');
    container.empty();

    if (filteredNFTs.length === 0) {
        $('#noResultsState').removeClass('d-none');
        return;
    } else {
        $('#noResultsState').addClass('d-none');
    }

    filteredNFTs.forEach(function(nft) {
        const nftCard = createNFTCard(nft);
        container.append(nftCard);
    });

    // Anima le card quando vengono aggiunte
    container.children().addClass('animate__animated animate__fadeInUp');
}

/**
 * Crea una singola card NFT
 */
function createNFTCard(nft) {
    // ✅ Ora usa sempre il nome dell'asset dal payload decodificato
    const nftName = nft.asset || 'NFT Senza Nome';
    const nftImage = nft.url;
    const amount = nft.amount || '1';
    const memo = nft.memo || '';
    const formattedDate = formatDate(nft.created_at);

    const rewardTypes = {
        'workout_milestone': { color: 'success', icon: 'fas fa-trophy' },
        'streak_reward': { color: 'warning', icon: 'fas fa-fire' },
        'default': { color: 'primary', icon: 'fas fa-gem' }
    };

    const rewardInfo = rewardTypes[nft.reward_type] || rewardTypes['default'];

    return `
    <div class="col-md-4 mb-4">
        <div class="card nft-card shadow-sm" data-nft-id="${nft.txid}">
            ${nftImage ? 
                `<img src="${nftImage}" class="card-img-top nft-image" alt="${nftName}" 
                      onerror="this.style.display='none';">` 
                : 
                `<div class="card-img-placeholder bg-light d-flex align-items-center justify-content-center" style="height:200px;">
                     <i class="fas fa-trophy fa-3x text-muted"></i>
                 </div>`
            }
            
            <div class="card-header bg-${rewardInfo.color} text-white">
                <i class="${rewardInfo.icon} me-2"></i>
                ${nftName}
            </div>
            
            <div class="card-body">
                ${memo ? `<p class="card-text small text-muted">${memo}</p>` : ''}
                
                <div class="nft-details">
                    <div class="row mb-2">
                        <div class="col-6">
                            <small class="text-muted">Quantità:</small><br>
                            <strong>${amount}</strong>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-12">
                            <small class="text-muted">Data Acquisizione:</small><br>
                            <span class="small">${formattedDate}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}



/**
 * Aggiorna le statistiche NFT
 */
function updateStats() {
    const totalNFTs = allNFTs.length;
    const totalAmount = allNFTs.reduce((sum, nft) => sum + parseInt(nft.amount || 1), 0);
    
    $('#totalNFTs').text(totalNFTs);
    $('#totalAmount').text(totalAmount);
    
    // Conta per tipo di reward
    const workoutMilestones = allNFTs.filter(nft => nft.reward_type === 'workout_milestone').length;
    $('#workoutMilestones').text(workoutMilestones);
}

/**
 * Mostra dettagli NFT completi
 */
function showNFTDetails(txid) {
    const nft = allNFTs.find(n => n.txid === txid);
    if (nft) {
        const details = `
            Nome NFT: ${nft.asset || 'N/A'}
            Quantità: ${nft.amount || '1'}
            Transaction ID: ${nft.txid}
            Tipo Reward: ${nft.reward_type}
            Data Creazione: ${formatDate(nft.created_at)}
            ${nft.url ? `URL Immagine: ${nft.url}` : ''}
        `;
        alert(details);
    }
}

/**
 * Helper: formatta la data nel formato DD/MM/YYYY
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) return 'Data non disponibile';
    
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}

/**
 * Mostra lo stato di caricamento
 */
function showLoadingState() {
    $('#loadingState').removeClass('d-none');
    $('#emptyState').addClass('d-none');
    $('#noResultsState').addClass('d-none');
}

/**
 * Nasconde lo stato di caricamento
 */
function hideLoadingState() {
    $('#loadingState').addClass('d-none');
}

/**
 * Mostra lo stato vuoto (nessun NFT)
 */
function showEmptyState() {
    $('#loadingState').addClass('d-none');
    $('#emptyState').removeClass('d-none');
    $('#noResultsState').addClass('d-none');
}

/**
 * Aggiorna le statistiche NFT
 */

/**
 * Visualizza NFT su blockchain explorer
 */
function viewOnBlockchain(txid) {
    // Sostituisci con l'URL del tuo blockchain explorer
    const explorerUrl = `https://your-blockchain-explorer.com/tx/${txid}`;
    window.open(explorerUrl, '_blank');
}

/**
 * Mostra dettagli NFT (placeholder)
 */

/**
 * Aggiorna i bottoni di vista (placeholder)
 */
function updateViewButtons() {
    // Implementa se hai bottoni per cambiare vista
}
