const emailInput = document.getElementById('InputEmail');
const passwordInput = document.getElementById('InputPassword');
const repeatPassword = document.getElementById('RepeatPassword');
const form = document.getElementById('register');


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

function validateEmail(email) {
  // Utilizza un'espressione regolare per la validazione dell'email
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})$/;
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
    return password == repeatPass;
}

function validateForm(){
    const email = emailInput.value;
    const password = passwordInput.value;
    const repeatPass = repeatPassword.value;
  
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password, repeatPass);
    const hash_pass= sha256(email.substring(0,5)+password);

  
    if (!isEmailValid || !isPasswordValid) {
      // Se l'email o le password non sono valide, ricarica la pagina
      alert('Compilare i campi in modo corretto');
    } else {

      var data={};
      data.nome = document.getElementById("FirstName").value;
      data.cognome = document.getElementById("LastName").value;
      data.telefono = document.getElementById("Phone").value;
      data.email = email;
      data.pswrd = hash_pass;
      var JSONdata = JSON.stringify(data);

      var req = new XMLHttpRequest();
      req.onload = function(){
      if(req.status==200 && this.responseText== "OK"){
          window.location.href="index.html";
      }
      else{
          var divElement = document.getElementById("messaggio_errore");
          // Aggiunta delle classi al div
          divElement.className = "alert alert-danger";
          divElement.innerHTML="Utente non inserito";
      }
      }
      
      req.open("post", "php/register.php/users/",true);

      req.send(JSONdata);
      
    }
  };


