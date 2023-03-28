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
const PARTIDOS = ["PAN","PRI", "PRD", "PT", "PVEM", "MC", "NA", "MORENA", "ES", "VR", "IND"];
const COLORES = ["blue", "orange", "green", "red", "purpple", "ground", "pink", "gray", "yellow", "aqua", "black"]


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
    let datos = buscador.value;
    let datos_analizados = "";
    let lista = [];
    let tipo = "";
    let json = {};
    let graficas = {};

    if(datos.indexOf(",")> -1){
        tipo = VARIOS;
    } else if(datos.indexOf("-")> -1){
        tipo = RANGO;
    } else{
        tipo = NOMBRE;
    }

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
                for(let i = 0;i<PARTIDOS.length;i++){
                    let data = data_s.datos[`m_${i}`][lista[i]][PARTIDOS[j]];
                    let arr = (data.reduce((total, num)=>total+num,0));
                }
                for(let i = 0;i<lista.length;i++){
                    let datasets = [];
                    graficas[lista[i]] = {};
                    for(let j = 0; j < PARTIDOS.length;j++){

                        let label =  PARTIDOS[j];
                        let data = data_s.datos[`m_${i}`][lista[i]][PARTIDOS[j]];
                        //let data = parseInt(arr).reduce((total,num)=>total + num, 0)
                        let arr = (data.reduce((total, num)=>total+num,0))
                        let background =  "red";
                        console.log(arr)
                        datasets.push({label, data, background})

                        graficas[lista[i]]["id"] = lista[i];
                        graficas[lista[i]]["tipo"] = "bar";
                        graficas[lista[i]]["etiquetas"] = PARTIDOS;
                        graficas[lista[i]]["datasets"] = datasets;
                        graficas[lista[i]]["options"] = {}
                        graficas[lista[i]]["options"]["title"] = {} 
                        graficas[lista[i]]["options"]["title"]["display"] = "true";
                        graficas[lista[i]]["options"]["title"]["text"] = "Nº votos";
                        graficas[lista[i]]["options"]["title"]["fontSize"] = 18;
                        //console.log(data_s.datos[`m_${i}`][lista[i]][PARTIDOS[j]])
                    }
                }
                let fragmento = document.createDocumentFragment();
                for(let i = 0; i < lista.length; i++){
                    let canvas = document.createElement("canvas");
                    canvas.setAttribute("class", `grafica${i}`);
                    let contexto = canvas.getContext("2d");
                    let char = new Chart(contexto, {
                        type: graficas[lista[i]]["tipo"],
                        data: {
                          labels: PARTIDOS,
                          datasets: [
                              graficas[lista[i]]["datasets"][0]
                          ]
                        },
                        options: graficas[lista[i]]["options"]["title"]
                      });
                    fragmento.appendChild(canvas)
                }
                document.querySelector(".graficas").appendChild(fragmento)
                console.log(graficas[lista[0]]["datasets"][0]["data"])
            });
            break;
        case RANGO:
            datos_analizados = datos.split("-");
            json = {
                tipo: RANGO,
                datos: datos_analizados
            }
            enviar_datos(json)
            .then(data => {
                console.log(data);
            });
            break;
        case NOMBRE:
            json = {
                tipo: NOMBRE,
                datos: datos
            }
            enviar_datos(json)
            .then(data => {
                console.log(data);
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

/**
 * funcion para determinar la longitud de objetos
 */

function longitud(objeto, valor_key){
    let lista = [];
    lista.push(Object.keys(objeto[valor_key]).length);

    for (let i = 0; i < lista[0]; i++) {
        lista.push(Object.keys(objeto[valor_key][i]).length);
        
    }
    return lista;
}