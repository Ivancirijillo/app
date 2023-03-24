class Enviar{
    constructor(ruta, metodo){
        this.ruta = ruta;
        this.metodo = metodo;
        this.datos = ""
    }

    enviar_datos(datos) {
        fetch(`${this.ruta}`, {
            method: `${this.metodo}`,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
            })
            .then(response => response.json())
            .then(data => {
                this.set_datos(data);
            });
    }

    get_datos(){
        return `${this.datos.toString()}`;
    }

    set_datos(datos){
        this.datos = datos;
    }
}


let boton = document.querySelector(".buscar")
let buscador = document.querySelector(".Ibuscar")
let boton_buscador = document.querySelector(".Bbuscar")

boton.addEventListener("click",(e)=>{
    e.preventDefault()
    let municipios = document.querySelectorAll(".municipio")
    let municipioP = []
    
    
    municipios.forEach(municipio => {
        if (municipio.checked){ 
            municipioP.push(municipio.getAttribute("value"))
        }
    });

    let data = { municipio: municipioP};

    fetch('/consulta-municipio', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        let grafica = document.querySelector(".graficas")
        let img = document.createElement("img")
        img.setAttribute("src", "/static/imgs/"+`${data["nombre_grafica"]}`)
        grafica.appendChild(img)
        console.log(data["ruta"]);
    });
});

boton_buscador.addEventListener("click", (e)=>{
    e.preventDefault();
    let datos = buscador.value;
    switch(){
        
    }
    let datos_analizados = datos.split("-") 
    console.log(datos_analizados)
    //let data = { consulta: ""+`${buscador.value}`};

    // fetch('/consultas', {
    // method: 'POST',
    // headers: {
    //     'Content-Type': 'application/json'
    // },
    // body: JSON.stringify(data)
    // })
    // .then(response => response.json())
    // .then(data => {
    //     console.log(data["consulta"]);
    // });
});