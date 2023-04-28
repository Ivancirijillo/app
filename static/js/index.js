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
const TODO = "todo";
//expresiones
const ID_MUNICIPIO = /^15(?:0[0-9][0-9]|1[0-2][0-5])(?:,(?!$)15(?:0[0-9][0-9]|1[0-2][0-5]))*(?:-15(?:0[0-9][0-9]|1[0-2][0-5]))?$/;
const NOMBRE_MUNICIPIO = /^[a-zA-Z\s]{6,20}$/;
const SECCION_MUNICIPIO = /^(?:[1-9]|[0-9][0-9]{1,2}|[0-5][0-9]{3}|6[0-4][0-9][0-9]|649[0-8])(?:,(?!$)([1-9]|[0-9][0-9]{1,2}|[0-5][0-9]{3}|6[0-4][0-9][0-9]|649[0-8]))*(?:-(?!$)([1-9]|[0-9][0-9]{1,2}|[0-5][0-9]{3}|6[0-4][0-9][0-9]|649[0-8]))?$/;
//arregos
const PARTIDOS= ["PAN","PRI", "PRD", "PT", "PVEM", "MC", "NA", "MORENA", "ES", "VR", "PH", "PES", "PFD", "RSP", "FXM", "NAEM", "INDEP"];
const COLORES = ["#0453A5", "#FF0108","#FFB928", "#FD4146", "#00C65C", "#FF7400",   "#33BDBD", "#BA0005",  "#B632BF", "#FF018C", "#DC3892",    "#72017A", "#FF9945", "#FD4146", "#EF7CBB", "#6BDBDB", "#BB9A00" ];
const COLORES2 = ['#0453A5','#FF7400','#FFB928','#FF0108'];
const NUMEROS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

//let boton = document.querySelector(".buscar")
let buscador = document.querySelector(".Ibuscar")
let boton_buscador = document.querySelector(".Bbuscar")
let botones_rapidos = document.querySelectorAll(".sRapida")
boton_buscador.disabled = true

// boton.addEventListener("click",(e)=>{
//     e.preventDefault()
//     let municipios = document.querySelectorAll(".municipio")
//     let municipioP = [];
    
//     ventana_carga();
    
//     municipios.forEach(municipio => {
//         if (municipio.checked){ 
//             municipioP.push(municipio.getAttribute("value"))
//         }
//     });

//     json = {
//         tipo: NOMBRE,
//         datos: municipioP[0],
//         years: [2015,2017,2018,2021]
//     }
//     enviar_datos(json)
//     .then(data=>{
//         crear_grafica(data, NOMBRE);
//     })
// });

//FUNCION DEL BOTON MOSTRAR Y OCULTAR
const contenedordiv = document.querySelector('#mostrar')
let isClicked = true

let mostrarocultar = function(){
    if(isClicked){
        contenedordiv.style.display = 'flex';
        isClicked = false;
        // boton_buscador.disabled = false;
        // boton_buscador.style.borderColor = "#0453a5";
    }else{
        contenedordiv.style.display = 'none';
        isClicked = true;
    }
}

function ventana_carga(){
    document.getElementById('enc').style.background = 'rgba(0,0,0,0.4)';
    document.getElementById('enc').classList.add('active');
    document.getElementById('pop').classList.add('active');
    setTimeout(() =>{
        //funcion ventana
        document.getElementById('enc').classList.remove('active');
        document.getElementById('pop').classList.remove('active');
    }, 1000);
}

//Eventos para busquedas rapidas
botones_rapidos.forEach(element => {
    element.addEventListener("click",(e)=>{
        e.preventDefault();

        json = {
            tipo: NOMBRE,
            datos: element.getAttribute("id"),
            years: ["2015","2017","2018","2021"]
        }
        //console.log(json);
        enviar_datos(json)
        .then(data_s => {
            //console.log(Object.keys(data_s.datos));
            crear_grafica(data_s, NOMBRE);
        });

        // if (buscador.value==""){
        //     buscador.value = element.getAttribute("id");
        //     boton_buscador.disabled = false;
        //     boton_buscador.style.borderColor = "#0453A5";
        // }
        // else if (buscador.value!=""){
        //     buscador.value += ","+element.getAttribute("id");
        //     boton_buscador.disabled = false;
        //     boton_buscador.style.borderColor = "#0453A5";
        // }
        ventana_carga();
        scrollToSection("Abajoxd");
        mostrarocultar();
        
    });
});

//Eventos de validacion
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
//Eventos de buscador
boton_buscador.addEventListener("click", (e)=>{
    e.preventDefault();
    let cbox = document.querySelectorAll(".cbox");
    let pass = Array.from(cbox).some((item)=>{
        return item.checked
    });
    console.log(pass)
    if(pass){
        ventana_carga();
        analizar_datos();
    } else{
        //alert("Seleccione un año");
        mostrarAlerta();
        setTimeout(function() {
            ocultarAlerta(); 
        }, 1500);
    }
});

//Boton limpiar
document.getElementById('BLimpiar').addEventListener('click', function() {
    buscador.value= "";
})

function mostrarAlerta() {
    const alerta = document.getElementById("mi-alert");
    alerta.style.display = "flex";
}
  
function ocultarAlerta() {
    const alerta = document.getElementById("mi-alert");
    alerta.style.display = "none";
}

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
    let tipo = "";
    let json = {};

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
                datos: datos_analizados,
                years:obtener_years()
            }
            enviar_datos(json)
            .then(data_s => {
                console.log(data_s.datos);
                crear_grafica(data_s, tipo);
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
                //console.log(Object.keys(data_s.datos));
                crear_grafica(data_s, tipo);
            });
            break;
    }
}

function crear_grafica(data_s, tipo){

    let municipios = [];
    let years = Object.keys(data_s.datos);
    let partidos = [];
    let chartData = {};

    if(tipo == VARIOS){
        municipios = encontrar_municipios(years, data_s);
        partidos = ordenar_partidos(municipios, years, data_s);
        chartData = crear_diccionario(municipios, years, partidos)
    }else if(tipo == RANGO){
        municipios = encontrar_municipios(years, data_s);
        //console.log(municipios[0].length);
        //let partido = data_s.datos[years[i]][municipios[1]][PARTIDOS[0]]
        //console.log(municipios[0])
        //console.log(Object.keys(data_s.datos[years[0]][municipios[0][0]]));
        partidos = ordenar_partidos(municipios, years, data_s);
        console.log(partidos);

        chartData = crear_diccionario(municipios, years, partidos);
        console.log(chartData);
        // let municipio = Object.keys(data_s.datos)[0];
        // let contieneNumero = NUMEROS.some(numero => municipio.includes(numero));
        // if(contieneNumero){
        //     municipios = Object.keys(data_s.datos)
        //     municipios.forEach((item)=>{
        //         lista_partidos.push(data_s.datos[item]);
        //     });
        //     console.log(lista_partidos);
        // } else{
        //     for(let i = 0 ;i<Object.keys(data_s.datos).length;i++){
        //         partidos.push(Object.keys(data_s.datos[`${Object.keys(data_s.datos)[i]}`]));
        //         votos.push([])
        //         for (let j = 0; j < PARTIDOS.length; j++) {
        //             votos[i].push(data_s.datos[`${Object.keys(data_s.datos)[i]}`][PARTIDOS[j]]);
        //         } 
        //     }
        //     let aux = 0;
        //     while(partidos.length > aux){
        //         lista_partidos.push([]);
        //         for(let i = 0;i<PARTIDOS.length;i++){
        //             let data = (votos[aux][i].reduce((total, num)=>total+num,0));
        //             lista_partidos[aux].push(data)
        //         }
        //         aux++;
        //     }
        //     console.log(municipios[0]);
        //     console.log(lista_partidos);
        // }

    } else if(tipo == NOMBRE){
        //console.log(Object.keys(data_s));
        municipios = encontrar_municipios(years, data_s);
        //console.log(municipios);

        partidos = ordenar_partidos(municipios, years, data_s);
        //console.log(partidos);

        chartData = crear_diccionario(municipios, years, partidos);
        //console.log(chartData["ACAMBAY DE RUÍZ CASTAÑEDA. SECCION:1"]);
    }
    

    let fragmento = document.createDocumentFragment();
    let municipio = [];
    for(let i=0;i<municipios.length;i++){
        municipio.splice();
        // for (let j = 0; j < 6; j++) {
        //     if(chartData[j].label.includes(municipios[i])){
        //         municipio.push(chartData[j]);
        //         //console.log(municipios[i]);
        //     }
        // }
        municipio = chartData.filter(item => item.label.includes(municipios[i]));
        console.log(municipio);
        let canvas = document.createElement("canvas");
        canvas.setAttribute("class", "grafica0");
        
        let contexto = canvas.getContext("2d");
        let char = new Chart(contexto, {
                type: "bar",
                data: {
                labels: PARTIDOS,
                datasets: municipio
                }
            });
            canvas.style.position = "relative";
            canvas.style.width="50px";
            fragmento.appendChild(canvas)
        
        document.querySelector(".graficas").appendChild(fragmento);
        municipio.splice();
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

function encontrar_municipios(years, data_s){
    let municipios = [];
    let n_municipios = Object.keys(data_s.datos[years[0]]).length
    //console.log(n_municipios)

    for (let i = 0; i < years.length; i++) {
        for (let j = 0; j < n_municipios; j++) {
            let municipio = Object.keys(data_s.datos[years[i]][j])[0];
            if (!municipios.some(m => municipio.includes(m))) {
                municipios.push(municipio);
            }
        }
    }
    
    // years.forEach((item)=>{
    //     let estaEnLista = municipios.some(municipio=>municipio.includes(municipio));
    //     if (estaEnLista){} else municipios.push(Object.keys(data_s.datos[item]));
    // });

    // years.forEach((item)=>{
    //     let estaEnLista = municipios.some(municipio => municipios.includes(municipio));
    //     if (estaEnLista){} else municipios.push(Object.keys(data_s.datos[item]));
    // });
        
    /**formato de js
     * 1.data_s.datos[years[0]] determina el año
     * 2.data_s.datos[years[0]][2] determina el la posicion del arreglo
     * 3.data_s.datos[years[0]][2]["ACULCO"] determina el municipio
     * 4.data_s.datos[years[0]][2]["ACULCO"]["PAN"] determina el partido
     * nota: el 2 y el 3 deben ser iguales, ejemplo:
     * si existen 3 municipios 2 debe de estar posicionado en el arreglo donde
     * se encuentre aculco, es el numero del municipio.
     */
    //console.log(municipios)
    //console.log(data_s.datos[years[0]][0][municipios[0]][PARTIDOS[0]]);
    
    return municipios;
}

function ordenar_partidos(municipios, years, data_s){
    let aux = 0;
    let partidos = [];
    //console.log(PARTIDOS.length)
    while(aux < municipios.length){
        //console.log(aux)
        for (let i = 0; i < years.length; i++) {
            //console.log(i)
            let partidosAnuales = [];
            for (let j = 0; j < PARTIDOS.length; j++) {
                //console.log(data_s.datos[years[i]][aux][municipios[aux]][PARTIDOS[j]])
                let partido = data_s.datos[years[i]][aux][municipios[aux]][PARTIDOS[j]];
                // if(j==1){
                //     console.log(municipios[aux]+":"+partido)
                // }
                partidosAnuales.push(partido);
            }
            partidos.push(partidosAnuales);
        }
        aux++;
    }
    return partidos;
}

function crear_diccionario(municipios, years, partidos){
    let diccionario = {};
    let chartData = [];
    let aux = 0;
    for (let year in years) {
        diccionario[year] = [];
        for (let j = 0; j < municipios.length; j++) {
            diccionario[year].push({[municipios[j]]: {}})            
        }
    }
    //llenado de diccionario
    for (let i = 0; i < municipios.length; i++){
        for (let j = 0; j < years.length; j++) {
            diccionario[j][i]={
                label: `${municipios[i]} año ${years[j]}`,
                data: partidos[aux],
                backgroundColor: COLORES,
                borderColor: "rgba(0,99,132,1)",
                yAxisID: "y-axis-destiny"
            }
            aux++;
        }
        
    }

    for (let i = 0; i < years.length; i++) {
        for (let j = 0; j < municipios.length; j++) {
            let info = diccionario[i][j];
            let tempData = {};

            tempData.label = info.label;
            tempData.data = Object.values(info.data);
            tempData.backgroundColor = info.backgroundColor;
            tempData.borderColor = info.borderColor; 
            tempData.yAxisID = info.yAxisID;

            chartData.push(tempData);
        }
        
    }

    let info = diccionario[0][0]
    //console.log(chartData[5].label.includes(municipios[0]));
    return chartData;
    //console.log(Object.values(info.data));
    //formato diccionario
    //diccionario[] indica el año
    //diccionario[][] indica el municipio
    // for (let i = 0; i < years.length; i++) {
    //     for (let j = 0; j < municipios.length; j++) {
    //         console.logObject.keys((diccionario[i][j]));
    //     }
        
    // }

    
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    const sectionPosition = section.offsetTop;
    setTimeout(function() {
        window.scrollTo({
            top: sectionPosition,
            behavior: 'smooth'
        });
    }, 1000);
}

function scrollPariba(sectionId) {
    const section = document.getElementById(sectionId);
    const sectionPosition = section.offsetTop;
    window.scrollTo({
        top: sectionPosition,
        behavior: 'smooth'
    });
}