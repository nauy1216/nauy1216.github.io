var isOff = true;
window.onload = function(){
    var oDiv = document.getElementsByClassName("box")[0];
    var ah3 = document.getElementsByTagName("h3");
    var div = document.createElement("div");//menu
    var str = "";

    div.className = "menuList";
    div.id = "menuList";

    for(var i=0; l=ah3.length,i<l; i++){
        ah3[i].id = "target"+i;
        str += "<a href='#target"+ i + "'>" + ah3[i].innerHTML + "</a><br/>";
    }
    div.innerHTML = "<div>Menu</div>"+str;

    oDiv.insertBefore(div, ah3[0]);

    //¹Ø±Õmenu
    div.getElementsByTagName("div")[0].onclick = function(ev){
        if(isOff){
            var height = window.innerHeight;
            div.style.cssText = "height:" + height +"px; overflow:auto; background:#000;";
            isOff = false;
        }else{
            div.style.cssText = "height:40px;";
            isOff = true;
        }
    }

}

window.onresize = function(){
    if(!isOff){
        var height = window.innerHeight;
        document.getElementById("menuList").style.cssText = "height:" + height +"px; overflow:auto; background:#000;";
    }
}