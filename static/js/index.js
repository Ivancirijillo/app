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

//pantalla completa
//      const elem = document.documentElement;
//  if (elem.requestFullscreen) {
//      elem.requestFullscreen();
//      } else if (elem.webkitRequestFullscreen) { /* Safari */
//      elem.webkitRequestFullscreen();
//      } else if (elem.msRequestFullscreen) { /* IE11 */
//      elem.msRequestFullscreen();
// }

//tipos
const VARIOS = "varios";
const RANGO = "rango";
const NOMBRE = "nombre";
//expresiones
const ID_MUNICIPIO = /^15(?:0[0-9][0-9]|1[0-2][0-5])(?:,(?!$)15(?:0[0-9][0-9]|1[0-2][0-5]))*(?:-15(?:0[0-9][0-9]|1[0-2][0-5]))?$/;
const NOMBRE_MUNICIPIO = /^[a-zA-Z\s]{6,20}$/;
const SECCION_MUNICIPIO = /^(?:[1-9]|[0-9][0-9]{1,2}|[0-5][0-9]{3}|6[0-4][0-9][0-9]|649[0-8])(?:,(?!$)([1-9]|[0-9][0-9]{1,2}|[0-5][0-9]{3}|6[0-4][0-9][0-9]|649[0-8]))*(?:-(?!$)([1-9]|[0-9][0-9]{1,2}|[0-5][0-9]{3}|6[0-4][0-9][0-9]|649[0-8]))?$/;
//arregos
const PARTIDOS = ["PAN","PRI", "PRD", "PT", "PVEM", "MC", "NA", "MORENA", "ES", "VR", "PH", "PES", "PFD", "RSP", "FXM", "NAEM", "INDEP"];
const COLORES = ["blue", "orange", "green", "red", "purple", "brown", "pink", "gray", "yellow", "aqua", "black"];
const NUMEROS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

let boton = document.querySelector(".buscar")
let buscador = document.querySelector(".Ibuscar")
let boton_buscador = document.querySelector(".Bbuscar")
boton_buscador.disabled = true

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

//eventos de validacion
buscador.addEventListener("input",(e)=>{
    e.preventDefault();
    let dato = buscador.value
    if(ID_MUNICIPIO.test(dato) || NOMBRE_MUNICIPIO.test(dato) || SECCION_MUNICIPIO.test(dato)) { 
        boton_buscador.disabled = false;
        boton_buscador.style.borderColor = "#0453A5";
    }else {
        boton_buscador.disabled = true;
        boton_buscador.style.borderColor = "#FF0108";
    }
});

buscador.addEventListener("blur",(e)=>{
    e.preventDefault()
    let dato = buscador.value;
    if(ID_MUNICIPIO.test(dato) || NOMBRE_MUNICIPIO.test(dato) || SECCION_MUNICIPIO.test(dato)) { 
        boton_buscador.disabled = false;
        boton_buscador.style.borderColor = "#0453A5";
    }else {
        boton_buscador.disabled = true;
        boton_buscador.style.borderColor = "#FF0108";
    }
});


boton_buscador.addEventListener("click", (e)=>{
    e.preventDefault();
    let cbox = document.querySelectorAll(".cbox");
    let pass = Array.from(cbox).some((item)=>{
        return item.checked
    });
    console.log(pass)
    if(pass){
        analizar_datos();
    } else{
        alert("Seleccione un año");
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

function analizar_datos(){
    let datos = buscador.value.toUpperCase();
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
                datos: datos_analizados,
                years: obtener_years()
            }
            enviar_datos(json)
            .then(data_s => {
                console.log(data_s.datos);
                crear_grafica(data_s, tipo);
            });
            break;
        case NOMBRE:
            let listayear = obtener_years();
            json = {
                tipo: NOMBRE,
                datos: datos,
                years:listayear
            }
            console.log(json);
            enviar_datos(json)
            .then(data_s => {
                console.log(data_s.datos);
                crear_grafica(data_s, tipo);
            });
            break;
    }
}

function crear_grafica(data_s, tipo){
    let lista_partidos = [];
    let municipios = Object.keys(data_s.datos);
    let partidos = [];
    let votos = [];
    if(tipo == RANGO){
        let municipio = Object.keys(data_s);
        const mu = toString(municipio[0])
        console.log(mu.includes("1"))
        const contieneNumero = NUMEROS.some(numero => Object.keys(data_s)[0].includes(numero));
        console.log(contieneNumero)
        //if(sub_tipo.some(item=>{item.includes()}))
        for(let i = 0 ;i<Object.keys(data_s.datos).length;i++){
            partidos.push(Object.keys(data_s.datos[`${Object.keys(data_s.datos)[i]}`]));
            votos.push([])
            for (let j = 0; j < PARTIDOS.length; j++) {
                votos[i].push(data_s.datos[`${Object.keys(data_s.datos)[i]}`][PARTIDOS[j]]);
            } 
        }
        let aux = 0;
        while(partidos.length > aux){
            lista_partidos.push([]);
            for(let i = 0;i<PARTIDOS.length;i++){
                let data = (votos[aux][i].reduce((total, num)=>total+num,0));
                lista_partidos[aux].push(data)
            }
            aux++;
        }
        console.log(municipios[0]);
        console.log(lista_partidos);
    } else if(tipo == NOMBRE){
        municipios = Object.keys(data_s.datos)
        municipios.forEach((item)=>{
            lista_partidos.push(data_s.datos[item]);
        });
        console.log(municipios);
        console.log(lista_partidos);
    }
    

    let fragmento = document.createDocumentFragment();
    for(let i=0;i<municipios.length;i++){
        let canvas = document.createElement("canvas");
        canvas.setAttribute("class", "grafica0");
        
        let contexto = canvas.getContext("2d");
        let char = new Chart(contexto, {
                type: "bar",
                data: {
                labels: PARTIDOS,
                datasets: [
                    {
                        label:municipios[i],
                        data: lista_partidos[i],
                        backgroundColor:COLORES
                    }
                ]
                },
                options: {
                    title:{
                        display:true,
                        text:municipios[i],
                        fontSize:28
                    }
                }
            });
            canvas.style.position = "relative";
            canvas.style.width="50px";
            fragmento.appendChild(canvas)
        
        document.querySelector(".graficas").appendChild(fragmento);
    }
}

function obtener_years(){
    let years = document.querySelectorAll(".cbox");
    let listayear = [];
    years.forEach(item=>{
        if(item.checked){
            listayear.push(item.getAttribute("value"));
        }
    });
    return listayear;
}

//bloquear click derecho
// document.addEventListener("contextmenu", function(event){
//     event.preventDefault();
// });