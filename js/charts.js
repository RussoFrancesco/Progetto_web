
/*const labels = ["January", "February", "March", "April", "May", "June"];


const data = {
  labels: labels,
  datasets: [{
    label: 'My First Dataset',
    data: [65, 59, 80, 81, 56, 55, 40,80,80,120],
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  }]
};

const config = {
    type: 'line',
    data: data,
  };

const chart = new Chart(myCanvas, config);
*/
//RICHIAMO DELLE FUNZIONI
getBMI();
Progressi_su_esercizio();
getPercentualiGruppi();

//Funzione per creare il grafico del BMI nel tempo
function getBMI(){
    //preparo una richiesta AJAX al server
    let req=new XMLHttpRequest();
    
    req.onload=function(){
        
        //FORMATO DELLA RISPOSTA : {labels: ["2023-12-21", "2023-12-22"], data: [24.22, 28.22]}
        //Dove labels sono le date, e data sono i rispettivi volri del BMI misurati

        chartBMI(JSON.parse(this.responseText)); //recupero la risposta e la passo alla funzione che crea il grafico
        };
    req.open("GET","php/bmi.php/bmi/getBMI",true);
    req.setRequestHeader('Token', token);
    req.send();
}

function chartBMI(dati){
    //recupero l'elemento HTML
    let CanvasBMI = document.getElementById("myPieChart"); 
    //console.log(dati);

    //per ogni elemento vado a formattare la  data contenuta in labels 
    for(let i=0;i<dati.labels.length;i++){
        dati.labels[i]=formattaData(dati.labels[i]);
    }

    //assegno a degli array i valori di data e labels
    var datadb=dati.data;
    var labels=dati.labels;

    //creo I dati per il grafico on labels e dati corrispondenti dati
    const dataChart={
        labels: labels,
        datasets: [{
            label: "BMI",
            data: datadb,
            fill: false,
            borderColor: 'rgb(78, 115, 223)',
        }]
    }

    //configuro il grafico con il tipo line
    const config = {
        type: 'line',
        data: dataChart,
        options: {
          plugins: {
              legend: {
                  display: false, // Nascondi la legenda
              }
          }
        }
      };
    
    const chart = new Chart(CanvasBMI, config); //crazione vera e propria del grafico
}



//Grafico per mostrare i progressi sul peso utilizzato su un esercizio randomico 
function Progressi_su_esercizio(){

    //richiesta AJAX
    let req=new XMLHttpRequest();

    req.onload=function(){

        //FORMATO DELLA RISPOSTA: {"esercizio":"croci ai cavi","date":["2023-12-20","2023-12-21"],"pesi":[20,15]}
        chart_esercizio(JSON.parse(req.responseText));
    };

    req.open("GET","php/esercizi.php/a_e/progressi",true); //alla tabella a_e per i progressi
    req.setRequestHeader('Token', token); 
    req.send();
}

//funzione creazione grafico
function chart_esercizio(json){

    let myCanvas=document.getElementById("progressiEsercizio"); //recuper elemento <canvas>
    let esercizio = json.esercizio; 
    document.getElementById("titolo_esercizio").innerHTML += esercizio; //setto il titolo col nome dell'esercizio

    //formatto la data 
    for(let i=0;i<json.date.length;i++){
        json.date[i]=formattaData(json.date[i]);
    }

    var data=json.pesi;
    var labels=json.date;

    //Setto i dati e le labels per il grafico 
    const dataChart={
        labels: labels,
        datasets: [{
            label: "Peso",
            data: data,
            fill: false,
            borderColor: 'rgb(78, 115, 223)',
        }]
    }
    
    //creo la configurazione 
    const config = {
        type: 'line',
        data: dataChart,
        options: {
            plugins: {
                legend: {
                    display: false, // Nascondi la legenda
                }
            }
        }
    };
    
    const chart = new Chart(myCanvas, config); //creo il chart 

}

//grafico per mostrare in un grafico a torta la distribuzione degli allenamenti sui gruppi muscolari
function getPercentualiGruppi(){
    
    let request = new XMLHttpRequest();
    request.onload=function(){
        //FORMATO DELLA RISPOSTA: {"pettorali":3,"dorsali":2,"gambe":1,"bicipiti":1}
        occorrenze=JSON.parse(this.responseText);
        Piechart(occorrenze);
    };
    request.open('GET',"php/esercizi.php/a_e/gruppi",true);
    req.setRequestHeader('Token', token);
    request.send();
}

function Piechart(json){
    //creo un oggetto per inserire le occorrenze
    //uso una notazione per cui se nella risposta c'è un elemento con quel gruppo allora gli metto il valore nel json
    //altrimenti metto 0
    const occorrenze_gruppi={
        "pettorali":json.hasOwnProperty("pettorali")? json.pettorali: 0,
        "dorsali":json.hasOwnProperty("dorsali")? json.dorsali:0,
        "spalle":json.hasOwnProperty("spalle")? json.spalle:0,
        "bicipiti":json.hasOwnProperty("bicipiti")? json.bicipiti:0,
        "tricipiti":json.hasOwnProperty("tricipiti")?json.tricipiti:0,
        "gambe":json.hasOwnProperty("gambe")?json.gambe:0,
        "addome":json.hasOwnProperty("addome")?json.addome:0
    }

    //recupero labels e keys
    var labels=Object.keys(occorrenze_gruppi);
    var dati=Object.values(occorrenze_gruppi);
    
    //definisco i colori dei vari gruppi
    colors = [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(153, 102, 255)',
        'rgb(255, 159, 64)',
        'rgb(120, 200, 80)'
    ];

    //definisco i dati per il grafico 
    const data = {
        labels: labels,
        datasets: [{
          label: 'Numero di allenamenti per il gruppo muscolare',
          data: dati,
          backgroundColor: colors,
          hoverOffset: 4
        }]
      };
    
    //configuro i valori e calcolo 
    const config = {
        type: 'doughnut',
        data: data,
        options: {
            plugins: {
              tooltip: {
                
                callbacks: {
                  // Callback per personalizzare il testo della label nel tooltip
                  label: function(context) {
                    // Variabile per il testo della label nel tooltip
                    let label = context.label || '';
                    // Aggiunge i due punti 
                    if (label) {
                      label += ': ';
                    }
                    // Aggiunge il valore formattato e la percentuale al testo della label (ci sarebebero le occorrenze altrimenti)
                    label += context.formattedValue + ' (' + ((context.parsed / context.dataset.data.reduce((a, b) => a + b)) * 100).toFixed(2) + '%)';
                    return label;
                  }
                }
              }
            }
          }
    };
    const myCanvas=document.getElementById("canvasDistribuzione");
    const chart = new Chart(myCanvas, config);

}

function formattaData(dataNonFormattata){
    let partiData = dataNonFormattata.split('-');
    let anno = partiData[0];
    let mese = partiData[1];
    let giorno = partiData[2];
    dataFormattata = `${giorno}-${mese}-${anno}`;
    return dataFormattata;
}
