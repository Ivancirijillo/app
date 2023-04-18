/*class Enviar{
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
}*/

const VARIOS = "varios";
const RANGO = "rango";
const NOMBRE = "nombre";
const PARTIDOS = ["PAN","PRI", "PRD", "PT", "PVEM", "MC", "NA", "MORENA", "ES", "VR", "PH", "PES", "PFD", "RSP", "FXM", "NAEM", "INDEP"];
const COLORES = ["blue", "orange", "green", "red", "purple", "brown", "pink", "gray", "yellow", "aqua", "black"]

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

//FUNCION DEL BOTON MOSTRAR Y OCULTAR
const contenedordiv = document.querySelector('#mostrar')
let isClicked = true

let mostrarocultar = function(){
    if(isClicked){
        contenedordiv.style.display = 'flex'
        isClicked = false
    }else{
        contenedordiv.style.display = 'none'
        isClicked = true
    }
}

boton_buscador.addEventListener("click", (e)=>{
    e.preventDefault();
    let datos = buscador.value.toUpperCase();
    let years = document.querySelectorAll(".cbox");
    let listayear = [];
    years.forEach(item=>{
        if(item.checked){
            listayear.push(item.getAttribute("value"));
        }
    });
    console.log(listayear);
    let datos_analizados = "";
    let lista = [];
    let datasets = [];
    let tipo = "";
    let json = {};
    let graficas = {};

    if(datos.indexOf(",") != -1){
        tipo = VARIOS;
    } else if(datos.indexOf("-") != -1){
        tipo = RANGO;
    } else tipo = NOMBRE;
    
    switch(tipo){
        case VARIOS:
            datos_analizados = datos.split(",");
            json = {
                tipo: VARIOS,
                datos: datos_analizados
            }
            enviar_datos(json)
            .then(data_s => {
                // lista = longitud(data, "datos");
                //console.log(datos_analizados)
                //posicion ["datos"][0] el arreglo principal
                //posicion ["datos"][0][0] primer fila del arreglo principal
                //posicion ["datos"][0][0][0] primer valor de la fila
                //console.log(data.datos[`m_0`]["ACAMBAY DE RUÍZ CASTAÑEDA"]["ES"])
                for(let i = 0 ;i<datos_analizados.length;i++){
                    lista.push(Object.keys(data_s.datos[`m_${i}`]));
                }
        
                let aux = 0;
                let votos_suma = [];

                while(lista.length > aux){
                    votos_suma.push([]);
                    for(let i = 0;i<PARTIDOS.length;i++){
                        // let label =  PARTIDOS[i];
                        let votos = data_s.datos[`m_${aux}`][lista[aux]][PARTIDOS[i]];
                        let data = (votos.reduce((total, num)=>total+num,0));
                        // let background =  COLORES[i];
                        votos_suma[aux].push(data)
                    }
                    aux++;
                }
                console.log(votos_suma);
                
                // for(let i = 0;i<lista.length;i++){
                //     graficas[lista[i]] = {};
                //     for(let j = 0; j < PARTIDOS.length;j++){

                        // let label =  PARTIDOS[j];
                        // let data = data_s.datos[`m_${i}`][lista[i]][PARTIDOS[j]];
                        //let data = parseInt(arr).reduce((total,num)=>total + num, 0)
                        // let arr = (data.reduce((total, num)=>total+num,0))
                        // let background =  "red";
                        // console.log(arr)
                        //datasets.push({label, data, background})

                        // graficas[lista[i]]["id"] = lista[i];
                        // graficas[lista[i]]["tipo"] = "bar";
                        // graficas[lista[i]]["etiquetas"] = PARTIDOS;
                        // //graficas[lista[i]]["datasets"] = datasets;
                        // graficas[lista[i]]["options"] = {}
                        // graficas[lista[i]]["options"]["title"] = {} 
                        // graficas[lista[i]]["options"]["title"]["display"] = "true";
                        // graficas[lista[i]]["options"]["title"]["text"] = lista[i];
                        // graficas[lista[i]]["options"]["title"]["fontSize"] = 28;
                        //console.log(data_s.datos[`m_${i}`][lista[i]][PARTIDOS[j]])
                //     }
                // }
                console.log(datasets)
                let fragmento = document.createDocumentFragment();
                for(let i = 0; i < lista.length; i++){
                    let canvas = document.createElement("canvas");
                    canvas.setAttribute("class", `grafica${i}`);
                    
                    let contexto = canvas.getContext("2d");
                    let char = new Chart(contexto, {
                        type: "bar",
                        data: {
                          labels: PARTIDOS,
                          datasets: [
                              {
                                label:lista[i],
                                data: votos_suma[i],
                                backgroundColor:COLORES
                            }
                          ]
                        },
                        options: {
                            title:{
                                display:true,
                                text:lista[i],
                                fontSize:28
                            }
                        }
                      });
                    canvas.style.position = "relative";
                    canvas.style.width="50px";
                    fragmento.appendChild(canvas)
                }
                document.querySelector(".graficas").appendChild(fragmento)
                //console.log(graficas[lista[0]]["datasets"][0]["data"])
            });
            break;
        case RANGO:
            datos_analizados = datos.split("-");
            json = {
                tipo: RANGO,
                datos: datos_analizados
            }
            enviar_datos(json)
            .then(data_s => {
                console.log(data_s)
                for(let i = 0 ;i<Object.keys(data_s.datos).length;i++){
                    lista.push(Object.keys(data_s.datos[`m_${i}`]));
                }
                console.log(lista)
                let aux = 0;
                let votos_suma = [];

                while(lista.length > aux){
                    votos_suma.push([]);
                    for(let i = 0;i<PARTIDOS.length;i++){
                        // let label =  PARTIDOS[i];
                        let votos = data_s.datos[`m_${aux}`][lista[aux]][PARTIDOS[i]];
                        let data = (votos.reduce((total, num)=>total+num,0));
                        // let background =  COLORES[i];
                        votos_suma[aux].push(data)
                    }
                    aux++;
                }
                console.log(votos_suma);
                let fragmento = document.createDocumentFragment();
                for(let i = 0; i < lista.length; i++){
                    let canvas = document.createElement("canvas");
                    canvas.setAttribute("class", `grafica${i}`);
                    
                    let contexto = canvas.getContext("2d");
                    let char = new Chart(contexto, {
                        type: "bar",
                        data: {
                          labels: PARTIDOS,
                          datasets: [
                              {
                                label:lista[i],
                                data: votos_suma[i],
                                backgroundColor:COLORES
                            }
                          ]
                        },
                        options: {
                            title:{
                                display:true,
                                text:lista[i],
                                fontSize:28
                            }
                        }
                      });
                    canvas.style.position = "relative";
                    canvas.style.width="50px";
                    fragmento.appendChild(canvas)
                }
                document.querySelector(".graficas").appendChild(fragmento);
            });
            break;
        case NOMBRE:
            json = {
                tipo: NOMBRE,
                datos: datos
            }
            console.log(json);
            enviar_datos(json)
            .then(data_s => {
                console.log(data_s);
                lista.push(Object.keys(data_s.datos["m_0"]));
                let votos_suma = [];

                for(let i = 0;i<PARTIDOS.length;i++){
                        let votos = data_s.datos["m_0"][lista[0]][PARTIDOS[i]];
                        let data = (votos.reduce((total, num)=>total+num,0));
                        votos_suma.push(data)
                }
                console.log(votos_suma);
                let fragmento = document.createDocumentFragment();
                
                let canvas = document.createElement("canvas");
                canvas.setAttribute("class", "grafica0");
                    
                let contexto = canvas.getContext("2d");
                let char = new Chart(contexto, {
                        type: "bar",
                        data: {
                          labels: PARTIDOS,
                          datasets: [
                              {
                                label:lista[0],
                                data: votos_suma,
                                backgroundColor:COLORES
                            }
                          ]
                        },
                        options: {
                            title:{
                                display:true,
                                text:lista[0],
                                fontSize:28
                            }
                        }
                      });
                    canvas.style.position = "relative";
                    canvas.style.width="50px";
                    fragmento.appendChild(canvas)
                
                document.querySelector(".graficas").appendChild(fragmento);
            });
            break;
    }
});

function enviar_datos(data){
    return fetch('/consultas-buscador', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
    })
    .then(response =>{
        return response.json()
    });
}