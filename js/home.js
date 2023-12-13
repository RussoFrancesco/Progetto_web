window.addEventListener('load', function(){
    userinfo();
    document.getElementById("logout_button").addEventListener("click", logoutProcedure);
});

function userinfo(){    
    var user=document.getElementById("span_user");
    req=new XMLHttpRequest();

    req.onload=function () {
        console.log(this.responseText);
        user.innerHTML=this.responseText;
    }

    req.open("get","php/home.php/users/",true);
    req.send()

}

function logoutProcedure(){
    console.log("logout");
    req=new XMLHttpRequest();
    req.onload=function () {
        if (req.status==200 && req.responseText=="SESSION_CLOSED"){
            window.location.href ='login.html';
        } 
    }
    req.open("get","php/logout.php",true);
    req.send();
}