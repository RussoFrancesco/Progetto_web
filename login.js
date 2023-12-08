window.onload=bindEvents;

function bindEvents (){
    document.getElementById("login_button").addEventListener("click", loginProcedure);
}




function loginProcedure (){

    //recupero valori inseriti nel form
    var email=document.getElementById("email").value;
    var password=document.getElementById("password").value;

    req=new XMLHttpRequest();
    req.onload=function () {
        if(req.status==200 && req.responseText== "OK"){
            window.location.href="index.php";
        }
        console.log(req.responseText);

    req.open("get","php/login.php/users/"+email+"/"+password,true);
    req.send();
    }
}