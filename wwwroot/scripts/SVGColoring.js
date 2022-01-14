window.SetSignInText = () =>{
    var res = prompt("ログイン名を入力してください");
    if(res == null){
        res="<span style='color:#ff0000'>SignIn</span>";
    }
    else{
        currentUser.id=res;
    }
    return res;
}
var currentUser = {imgXML:"",color:"",imgURL:"",id:"",oldIndex:"",newIndex:""};
function selectImg(img){
    currentUser.imgURL=img.id;
    while(document.getElementById("selectedImage").children.length > 0){
        document.getElementById("selectedImage").removeChild(document.getElementById("selectedImage").firstChild);
    }
    var container = document.createElement("div");
    container.style.display = "inline-block";
    var ctl = document.createElement("div");
    ctl.innerHTML = "&#10000;";
    container.appendChild(ctl.cloneNode(true));
    container.lastChild.style="color:#ff0000;font-size:5rem;";
    container.lastChild.setAttribute('onclick','setColor(this);');
    container.appendChild(ctl.cloneNode(true));
    container.lastChild.style="color:#00ff00;font-size:5rem;";
    container.lastChild.setAttribute('onclick','setColor(this);');
    container.appendChild(ctl.cloneNode(true));
    container.lastChild.style="color:#0000ff;font-size:5rem;";
    container.lastChild.setAttribute('onclick','setColor(this);');
    document.getElementById("selectedImage").appendChild(container);
    document.getElementById("selectedImage").appendChild(img.cloneNode(true));
    document.getElementById("selectedImage").lastChild.id="currentImg";
    document.getElementById("selectedImage").lastChild.style="width:200px;vertical-align:top;margin-top:3rem;margin-left:3rem;";
}

function changeImg(indexLabel){
    var index = parseInt(indexLabel.innerHTML);
    var res = prompt(index.toString() + "を何番のアイコンに変更しますか？");
    if(res != null){
        var i = parseInt(res);
        if(i > 0){
            index = i;
        }
    }
    currentUser.oldIndex=indexLabel.innerHTML;
    DotNet.invokeMethodAsync('SVGAssenble', 'ReturnSVG', index).then(xml => {
        if(xml != null){
            currentUser.imgXML=document.querySelector("img[id*='"+indexLabel.innerHTML+"']").getAttribute("src");
            document.querySelector("img[id*='"+index+"']").setAttribute("src",currentUser.imgXML);
            document.querySelector("img[id*='"+indexLabel.innerHTML+"']").setAttribute("src",xml);
            currentUser.oldIndex=indexLabel.innerHTML;
            currentUser.newIndex=index;
        }
    });
}
function changeIndex(){
    var elements = document.querySelectorAll("span");
    for (var i = 0; i < elements.length; i++) {
        if(elements[i].innerHTML == currentUser.oldIndex){
            elements[i].innerHTML = currentUser.oldIndex;
            document.querySelector("div[id*='"+currentUser.oldIndex+"']").setAttribute("id",currentUser.newIndex);
        }
        if(elements[i].innerHTML == currentUser.newIndex){
            elements[i].innerHTML = currentUser.oldIndex;
            document.querySelector("div[id*='"+currentUser.oldIndex+"']").setAttribute("id",currentUser.newIndex);
        }
    }
}
function setColor(pen){
    var dataType = "data:image/svg+xml;utf8,";
    currentUser.color=pen.style.color;
    currentUser.imgXML = document.getElementById("currentImg").getAttribute("src").replace(dataType,"");
    var dom_parser = new DOMParser();
    var document_obj = dom_parser.parseFromString(currentUser.imgXML, "text/xml");
    document_obj.rootElement.getElementsByTagName("g")[0].setAttribute('style','fill:' + pen.style.color);
    document.getElementById("currentImg").setAttribute("src",dataType + document_obj.rootElement.outerHTML);
}
