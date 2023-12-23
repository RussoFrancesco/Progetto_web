
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
getBMI();
Progressi_su_esercizio();
getPercentualiGruppi();

function getBMI(){
    let req=new XMLHttpRequest();
    
    req.onload=function(){
        //console.log(this.responseText);
        //console.log(JSON.parse(this.responseText));
        chartBMI(JSON.parse(this.responseText));
        };
    req.open("GET","php/bmi.php/bmi/getBMI",true);
    req.send();
}

function chartBMI(dati){
    let CanvasBMI = document.getElementById("myPieChart");
    //console.log(dati);

    for(let i=0;i<dati.labels.length;i++){
        dati.labels[i]=formattaData(dati.labels[i]);
    }

    datadb=dati.data;
    labels=dati.labels;

    const dataChart={
        labels: labels,
        datasets: [{
            label: "BMI",
            data: datadb,
            fill: false,
            borderColor: 'rgb(78, 115, 223)',
        }]
    }

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
    
    const chart = new Chart(CanvasBMI, config);
}




function Progressi_su_esercizio(){
    let req=new XMLHttpRequest();

    req.onload=function(){
        console.log(req.responseText);
        chart_esercizio(JSON.parse(req.responseText));
    };

    req.open("GET","php/esercizi.php/a_e/progressi",true);
    req.send();
}

function chart_esercizio(json){
    let myCanvas=document.getElementById("progressiEsercizio");
    let esercizio = json.esercizio;
    document.getElementById("titolo_esercizio").innerHTML += esercizio;

    for(let i=0;i<json.date.length;i++){
        json.date[i]=formattaData(json.date[i]);
    }

    data=json.pesi;
    labels=json.date;

    const dataChart={
        labels: labels,
        datasets: [{
            label: "Peso",
            data: data,
            fill: false,
            borderColor: 'rgb(78, 115, 223)',
        }]
    }
    
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
    
    const chart = new Chart(myCanvas, config);


}

function getPercentualiGruppi(){
    let request = new XMLHttpRequest();
    request.onload=function(){
        occorrenze=JSON.parse(this.responseText);
        Piechart(occorrenze);
    };
    request.open('GET',"php/esercizi.php/a_e/gruppi",true);
    request.send();
}

function Piechart(json){
    const occorrenze_gruppi={
        "pettorali":json.hasOwnProperty("pettorali")? json.pettorali: 0,
        "dorsali":json.hasOwnProperty("dorsali")? json.dorsali:0,
        "spalle":json.hasOwnProperty("spalle")? json.spalle:0,
        "bicipiti":json.hasOwnProperty("bicipiti")? json.bicipiti:0,
        "tricipiti":json.hasOwnProperty("tricipiti")?json.tricipiti:0,
        "gambe":json.hasOwnProperty("gambe")?json.gambe:0,
        "addome":json.hasOwnProperty("addome")?json.addome:0
    }

    var labels=Object.keys(occorrenze_gruppi);
    var dati=Object.values(occorrenze_gruppi);
    
    console.log(labels);
    console.log(dati);
    colors = [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(153, 102, 255)',
        'rgb(255, 159, 64)',
        'rgb(120, 200, 80)'
    ];

    const data = {
        labels: labels,
        datasets: [{
          label: 'Numero di allenamenti per il gruppo muscolare',
          data: dati,
          backgroundColor: colors,
          hoverOffset: 4
        }]
      };
    
    const config = {
        type: 'doughnut',
        data: data,
        options: {
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    let label = context.label || '';
                    if (label) {
                      label += ': ';
                    }
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
