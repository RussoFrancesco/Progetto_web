window.onload = function() {
    home(); // Richiama la funzione home per eseguire delle operazioni iniziali
    get_data_from_server();  // Richiama la funzione per ottenere dati dal server 
    const downloadBtn = document.getElementById('download-certificate');
    downloadBtn.addEventListener('click', get_certificate);
}

// Funzione per ottenere dati dal server
function get_data_from_server() {
    // Ottiene il parametro 'id' dall'URL della pagina
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    var req=new XMLHttpRequest();

    req.onload=function() {
        if(this.responseText == 'Denied'){
            invalid_token();
        }
        
        // Se la risposta indica un errore, reindirizza l'utente a 'allenamenti.php'
        if(this.responseText == "ERROR"){
            window.location.href = "allenamenti.php";
        }
        else{
            var data = JSON.parse(this.responseText);
            //FORMATO DELLA RISPOSTA: {allenamento: 24, esercizio: "leg press", peso: 20, gruppo: "gambe", serie: 1, …}
            console.log(data);
            smista_esercizi(data);
        }
    };

    //richiedo l'allenamento dalla tabella a_e 
    req.open('GET',"php/logicaAllenamento.php/a_e/"+id,true);
    req.setRequestHeader('Token', token);
    req.send();
}

//funzione per mostare a schermo l'allenamento
function smista_esercizi(data){

    // Estrae la data dall'oggetto data ottenuto dal server
    let partiData = data[0]['data'].split('-');
    let anno = partiData[0];
    let mese = partiData[1];
    let giorno = partiData[2];

    // Aggiunge la data all'elemento con ID "allenamento"
    document.getElementById("allenamento").innerHTML += " "+`${giorno}-${mese}-${anno}`;
    for(var i=0; i<data.length; i++){
        
        // Mostra la card corrispondente al gruppo di esercizi
        document.getElementById("card_"+data[i]['gruppo']).style.display="block";
        // Ottiene l'elemento card corrispondente al gruppo
        var card = document.getElementById(data[i]['gruppo']);
        // Crea un elemento paragrafo per ogni esercizio
        var p = document.createElement("p");
        // Costruisce il testo per l'esercizio, serie, ripetizioni e recupero
        p.innerHTML = data[i]["esercizio"]+" "+data[i]["serie"]+"x"+data[i]["ripetizioni"]+" "+data[i]["recupero"]+"\"";

        // Se è specificato un peso per l'esercizio, aggiungi questa informazione al testo
        if(data[i]['peso']!=0){
            p.innerHTML += " svolto con "+data[i]['peso']+"kg";
        }
        
        //appendo il paragrafo 
        card.appendChild(p);
    }
}


function get_certificate() {
    const urlParams = new URLSearchParams(window.location.search);
    const id_allenamento = urlParams.get('id');
    
    fetch(`php/logicaAllenamento.php/allenamenti_blocks/${id_allenamento}`, {
        method: 'GET',
        headers: { 'Token': token }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const blockData = data.blockData;
            
            // ✅ Decodifica il Payload da esadecimale a stringa
            let payloadDecoded = 'N/A';
            if (blockData.Payload) {
                try {
                    // Converte da hex a string
                    const hex = blockData.Payload;
                    let str = '';
                    for (let i = 0; i < hex.length; i += 2) {
                        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
                    }
                    payloadDecoded = str;
                } catch (e) {
                    console.error('Errore decodifica Payload:', e);
                    payloadDecoded = blockData.Payload; // Mostra in hex se la decodifica fallisce
                }
            }

            const container = document.createElement('div');
            container.innerHTML = `
                <div id="pdf-content" style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; background: white;">
                    <div style="text-align: center; border-bottom: 2px solid #007bff; padding-bottom: 20px; margin-bottom: 30px;">
                        <h1 style="color: #007bff; margin-bottom: 5px;">Certificato di Allenamento</h1>
                        <h2 style="color: #6c757d; font-weight: normal;">FitnessFolio</h2>
                        <p style="color: #6c757d; font-style: italic;">Certificato Blockchain Ufficiale</p>
                    </div>
                    
                    <div style="border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
                        <h3 style="color: #007bff; margin-bottom: 20px;">Dettagli Certificazione</h3>
                        
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px; font-weight: bold; width: 30%;">Transaction ID:</td>
                                <td style="padding: 8px; font-family: monospace; word-break: break-all;">${blockData.ID}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; font-weight: bold;">Status:</td>
                                <td style="padding: 8px; color: green; font-weight: bold;">${blockData.Status}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; font-weight: bold;">Block ID:</td>
                                <td style="padding: 8px;">${blockData.BlockID}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; font-weight: bold;">Timestamp:</td>
                                <td style="padding: 8px;">${blockData.Timestamp}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; font-weight: bold;">From Address:</td>
                                <td style="padding: 8px; font-family: monospace; word-break: break-all;">${blockData.From}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; font-weight: bold;">To Address:</td>
                                <td style="padding: 8px; font-family: monospace; word-break: break-all;">${blockData.To}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; font-weight: bold;">Nonce:</td>
                                <td style="padding: 8px;">${blockData.Nonce}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; font-weight: bold;">Type:</td>
                                <td style="padding: 8px;">${blockData.Type}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; font-weight: bold;">Payload (Decoded):</td>
                                <td style="padding: 8px; font-family: monospace; white-space: pre-wrap;">${payloadDecoded}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; font-weight: bold;">Payload (Hex):</td>
                                <td style="padding: 8px; font-family: monospace; word-break: break-all; font-size: 10px;">${blockData.Payload}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; font-weight: bold;">Signature:</td>
                                <td style="padding: 8px; font-family: monospace; word-break: break-all; font-size: 10px;">${blockData.OSignature}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; font-weight: bold;">Node ID:</td>
                                <td style="padding: 8px; font-family: monospace; word-break: break-all; font-size: 10px;">${blockData.NodeID}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div style="margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
                        <p style="font-size: 12px; color: #6c757d; text-align: center; margin: 0;">
                            Questo certificato è stato generato automaticamente e verificato su Circular Protocol Blockchain<br>
                            Data di generazione: ${new Date().toLocaleDateString('it-IT')} alle ${new Date().toLocaleTimeString('it-IT')}
                        </p>
                    </div>
                </div>
            `;
            
            // Aggiungi al body visibile
            document.body.appendChild(container);
            
            const opt = {
                margin: 10,
                filename: `certificato-allenamento-${id_allenamento}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            const element = container.querySelector('#pdf-content');
            
            html2pdf().from(element).set(opt).save().then(() => {
                document.body.removeChild(container);
                console.log('✅ PDF generato con successo');
                alert('✅ Certificato scaricato con successo!');
            }).catch(error => {
                console.error('❌ Errore generazione PDF:', error);
                document.body.removeChild(container);
                alert('Errore nella generazione del PDF');
            });

        } else {
            alert('❌ Errore: ' + (data.message || 'Errore sconosciuto'));
        }
    })
    .catch(err => {
        console.error('❌ Errore richiesta:', err);
        alert('Errore di connessione');
    });
}





