window.onload=bindEvents();

function bindEvents (){
    userinfo();
}


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