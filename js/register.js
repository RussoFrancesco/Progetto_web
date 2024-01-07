//variabili associate agli elementi del form
const emailInput = document.getElementById('InputEmail');
const passwordInput = document.getElementById('InputPassword');
const repeatPassword = document.getElementById('RepeatPassword');
const form = document.getElementById('register');


//validazione in tempo reale della mail
emailInput.addEventListener('input', function(event) {
  const email = event.target.value;
  if (validateEmail(email)) {
    // Email valida
    emailInput.style.border = '1px solid #d1d3e2';
  } else {
    // Email non valida
    emailInput.style.border = '2px solid red';
  }
});

//funzione per la validazione della mail
function validateEmail(email) {
  // Utilizza un'espressione regolare per la validazione dell'email
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})$/;
  return emailRegex.test(email);
}

//controllo sul campo repeatpassword per vedere che sia uguale al campo password
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

//funzione di validazione della password
function validatePassword(password, repeatPass) {
    return password == repeatPass;
}

//funzione per la validazione del form
function validateForm(){
    //recupero dei valori del form
    const email = emailInput.value;
    const password = passwordInput.value;
    const repeatPass = repeatPassword.value;
  
    //flag per la validità dei campi email e password
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password, repeatPass);

    //hash della password
    const hash_pass= sha256(email.substring(0,5)+password);

    //controllo che il form sia completato correttamente
    if (!isEmailValid || !isPasswordValid) {
      // Se l'email o le password non sono valide, ricarica la pagina
      alert('Compilare i campi in modo corretto');
    } else {

      //creazione dell'oggetto con i valori dei campi del form
      var data={};
      data.nome = document.getElementById("FirstName").value;
      data.cognome = document.getElementById("LastName").value;
      data.telefono = document.getElementById("Phone").value;
      data.email = email;
      data.pswrd = hash_pass;
      var JSONdata = JSON.stringify(data);

      var req = new XMLHttpRequest();
      req.onload = function(){
        //gestione della risposta dal server
        if(req.status==200){
            window.location.href="login.html";
        }
        else{
            var divElement = document.getElementById("messaggio_errore");
            // Aggiunta delle classi al div
            divElement.className = "alert alert-danger";
            divElement.innerHTML="Email già inserita";
        }
      }
      
      req.open("post", "php/register.php/users/",true);

      req.send(JSONdata);
      
    }
  };


