
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

function chartBMI(dati){
    let CanvasBMI = document.getElementById("myPieChart");
    console.log(dati);

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
      };
    
    const chart = new Chart(CanvasBMI, config);
}

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


function Progressi_su_esercizio(){
    let req=new XMLHttpRequest();

    req.onload=function(){};
    req.open("GET","php/logicaAllenamento.php/a_e/",true);
    req.send();
}