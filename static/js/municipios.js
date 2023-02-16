let botones = document.querySelectorAll("input[name=group1]");
let archivo = document.querySelector(".archivo2");
let data = [archivo.getAttribute("id")];
let municipio = "";
botones.forEach(item=>{
    if(item.checked){
        municipio = item.getAttribute("value");
    }
});

//boton filtrar
document.querySelector(".filtrar").addEventListener("click",(e)=>{
    e.preventDefault();
    let botones = document.querySelectorAll("input[name=group1]");
    let municipio = "";
    botones.forEach(item=>{
        if(item.checked){
            municipio = item.getAttribute("value");
            data.push(municipio);
        }
    });

    const jaison = JSON.stringify(data);
    console.log(jaison);
    $.ajax({
        url:"/resultado",
        type:"POST",
        contentType: "application/json",
        data: JSON.stringify(jaison)
    });
});