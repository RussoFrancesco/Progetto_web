document.onreadystatechange = function()
{
    if (document.readyState === 'complete')
    {
        res= new XMLHttpRequest();
        res.onload = function () {
        if (res.status===200 && res.responseText=="NOT_LOGGED_IN"){
            window.location.reload("login.html");
        }
        else{
            console.log(this.responseText);
        }

    }
    res.open("get","php/controlloaccesso.php/",true);
    res.send();
};
}