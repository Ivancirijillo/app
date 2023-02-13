//const { json } = require("express");

    let opciones = document.querySelectorAll(".cbox");
    let enviar = document.querySelector(".enviar");
    let nombreArchivo = document.querySelector(".archivo");
    let valores = [nombreArchivo.getAttribute("id")];
    
    enviar.addEventListener("click",(e)=>{
        e.preventDefault();
        opciones.forEach(item=>{
            if(item.checked){
                valores.push(item.getAttribute("value"));
            }
        })
        console.log(valores)

        let data = new FormData();
        data.append("columnas",valores)
        console.log(data.columnas)
        let formulario = {
            method: "POST",
            body:data
        }

        // fetch("/test/",formulario)
        // .then(response=> response.json())
        // .then(data=>{
        //     if(data == "correcto"){
        //         console.log("correcto");
        //     } else{
        //         console.log("error");
        //     }
        // })

        const s = JSON.stringify(valores); // lo pasamos a un valor JSON string. ITS
        console.log(s); // impresion pa checar que si se guardo correctamente
        $.ajax({
            url:"/test",
            type:"POST",
            contentType: "application/json",
            data: JSON.stringify(s)});
        
        valores = [];
        valores = [nombreArchivo.getAttribute("id")];
            
        window.open("/municipios","_self");
    }); 
    
