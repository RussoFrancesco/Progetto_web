firstNamefield=document.getElementById("FirstName");
lastnamefield=document.getElementById("LastName");
emailfield=document.getElementById("Email");
phonefield=document.getElementById("Phone");

req=new XMLHttpRequest();
req.onload=function () {
    if (req.status==200 ){
        $user=JSON.parse(req.responseText);
        document.getElementById("FirstName").value=$user.nome;
        document.getElementById("LastName").value=$user.cognome;
        document.getElementById("Email").value=$user.email;
        document.getElementById("Phone").value=$user.telefono;
    } 
}

req.open("get","php/user.php/users/profile",true);
req.send();