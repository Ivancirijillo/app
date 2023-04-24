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
const NUMEROS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

//let boton = document.querySelector(".buscar")
let buscador = document.querySelector(".Ibuscar")
let boton_buscador = document.querySelector(".Bbuscar")
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
    ventana_carga();
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
        let municipio = Object.keys(data_s.datos)[0];
        let contieneNumero = NUMEROS.some(numero => municipio.includes(numero));
        if(contieneNumero){
            municipios = Object.keys(data_s.datos)
            municipios.forEach((item)=>{
                lista_partidos.push(data_s.datos[item]);
            });
            console.log(lista_partidos);
        } else{
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
        }

    } else if(tipo == NOMBRE){
        municipios = Object.keys(data_s.datos)
        municipios.forEach((item)=>{
            lista_partidos.push(data_s.datos[item]);
        });
        // console.log(municipios);
        // console.log(lista_partidos);
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

//llenar imput
const inputB = document.getElementById('Ibuscador');

//limpiar
document.getElementById('BLimpiar').addEventListener('click', function() {
    inputB.value= "";
})

//Funcion de mostrarocultar() para todos lo sbotones

const botones = document.querySelectorAll('.opc_municipios button');

botones.forEach(boton => {
  boton.onclick = function() {
    mostrarocultar();
  };
});

document.getElementById('opc_atlaco').addEventListener('click', function() {
    textoBoton = "Atlacomulco";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_acambay').addEventListener('click', function() {
    textoBoton = "Acambay";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Acol').addEventListener('click', function() {
    textoBoton = "Acolman";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Acul').addEventListener('click', function() {
    textoBoton = "Aculco";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_AlmodA').addEventListener('click', function() {
    textoBoton = "Almoloya de Alquisiras";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_AlmodJ').addEventListener('click', function() {
    textoBoton = "Almoloya de Juarez";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_AlmodR').addEventListener('click', function() {
    textoBoton = "Almoloya del Rio";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Amana').addEventListener('click', function() {
    textoBoton = "Amanalco";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Amate').addEventListener('click', function() {
    textoBoton = "Amatepec";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Amecame').addEventListener('click', function() {
    textoBoton = "Amecameca";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Apaxco').addEventListener('click', function() {
    textoBoton = "Apaxco";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Atenco').addEventListener('click', function() {
    textoBoton = "Atenco";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById( 'opc_Atiza').addEventListener('click', function() {
    textoBoton = "Atizapan";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_AtizadZ').addEventListener('click', function() {
    textoBoton = "Atizapan de Zaragoza";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Atlau').addEventListener('click', function() {
    textoBoton = "Atlautla";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Axapus').addEventListener('click', function() {
    textoBoton = "Axapusco";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Ayapan').addEventListener('click', function() {
    textoBoton = "Ayapango";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Calima').addEventListener('click', function() {
    textoBoton = "Calimaya";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Capulhu').addEventListener('click', function() {
    textoBoton = "Capulhuac";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Chalco').addEventListener('click', function() {
    textoBoton = "Chalco";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Chap').addEventListener('click', function() {
    textoBoton = "Chapa de Mota";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Chapul').addEventListener('click', function() {
    ttextoBoton = "Chapultepec";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Chia').addEventListener('click', function() {
    textoBoton = "Chiautla";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Chico').addEventListener('click', function() {
    textoBoton = "Chicoloapan";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Chin').addEventListener('click', function() {
    textoBoton = "Chiconcuac";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Chima').addEventListener('click', function() {
    textoBoton = "Chimalhuacan";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Coacal').addEventListener('click', function() {
    textoBoton = "Coacalco de Berriozabal";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Coate').addEventListener('click', function() {
    textoBoton = "Coatepec Harinas";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Coco').addEventListener('click', function() {
    textoBoton = "Cocotitlan";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Coyo').addEventListener('click', function() {
    textoBoton = "Coyotepec";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Cuau').addEventListener('click', function() {
    textoBoton = "Cuautitlan";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Cuauti').addEventListener('click', function() {
    textoBoton = "Cuautitlan Izcalli";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_DondG').addEventListener('click', function() {
    textoBoton = "Donato Guerra";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Ecat').addEventListener('click', function() {
    textoBoton = "Ecatepec de Morelos";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Ecatz').addEventListener('click', function() {
    textoBoton = "Ecatzingo";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Huehue').addEventListener('click', function() {
    textoBoton = "Huehuetoca";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Huey').addEventListener('click', function() {
    textoBoton = "Hueypoxtla";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Huix').addEventListener('click', function() {
    textoBoton = "Huixquilucan";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Isid').addEventListener('click', function() {
    textoBoton = "Isidro Fabela";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Ixta').addEventListener('click', function() {
    textoBoton = "Ixtapaluca";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_IxtapanS').addEventListener('click', function() {
    textoBoton = "Ixtapan de la Sal";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_IxtapanO').addEventListener('click', function() {
    textoBoton = "Ixtapan del Oro";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_ixtla').addEventListener('click', function() {
    textoBoton = "Ixtlahuaca";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Jalt').addEventListener('click', function() {
    textoBoton = "Jaltenco";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Tonan').addEventListener('click', function() {
    textoBoton = "Tonanitla";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Jilo').addEventListener('click', function() {
    textoBoton = "Jilotepec";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Jilot').addEventListener('click', function() {
    textoBoton = "Jilotzingo";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Jiqui').addEventListener('click', function() {
    textoBoton = "Jiquipilco";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Joco').addEventListener('click', function() {
    textoBoton = "Jocotitlan";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Joqui').addEventListener('click', function() {
    textoBoton = "Joquicingo";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Juchi').addEventListener('click', function() {
    textoBoton = "Juchitepec";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Lerma').addEventListener('click', function() {
    textoBoton = "Lerma";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Mali').addEventListener('click', function() {
    textoBoton = "Malinalco";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_MelchO').addEventListener('click', function() {
    textoBoton = "Melchor Ocampo";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Metep').addEventListener('click', function() {
    textoBoton = "Metepec";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Mexi').addEventListener('click', function() {
    textoBoton = "Mexicaltzingo";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Mor').addEventListener('click', function() {
    textoBoton = "Morelos";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_NauJ').addEventListener('click', function() {
    textoBoton = "Naucalpan de Juarez";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Next').addEventListener('click', function() {
    textoBoton = "Nextlalpan";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Neza').addEventListener('click', function() {
    textoBoton = "Nezahualcoyotl";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_NicoR').addEventListener('click', function() {
    textoBoton = "Nicolas Romero";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Nopal').addEventListener('click', function() {
    textoBoton = "Nopaltepec";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Ocoyoa').addEventListener('click', function() {
    textoBoton = "Ocoyoacac";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Ocuilan').addEventListener('click', function() {
    textoBoton = "Ocuilan";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_ElO').addEventListener('click', function() {
    textoBoton = "El Oro";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Otumba').addEventListener('click', function() {
    textoBoton = "Otumba";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Otzo').addEventListener('click', function() {
    textoBoton = "Otzoloapan";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Otzol').addEventListener('click', function() {
    textoBoton = "Otzolotepec";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Ozumba').addEventListener('click', function() {
    textoBoton = "Ozumba";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Papal').addEventListener('click', function() {
    textoBoton = "Papalotla";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_LaPaz').addEventListener('click', function() {
    textoBoton = "La Paz";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Polo').addEventListener('click', function() {
    textoBoton = "Polotitlan";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Rayon').addEventListener('click', function() {
    textoBoton = "Rayon";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_SanAn').addEventListener('click', function() {
    textoBoton = "San Antonio la Isla";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_SanFe').addEventListener('click', function() {
    textoBoton = "San Felipe del Progreso";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_SanMar').addEventListener('click', function() {
    textoBoton = "San Martín de las Pirámides";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_SanMateo').addEventListener('click', function() {
    textoBoton = "San Mateo Atenco", 'path168';
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_SanSim').addEventListener('click', function() {
    textoBoton = "San Simon de Guerrero";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_SantoTom').addEventListener('click', function() {
    textoBoton = "Santo Tomas";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Soya').addEventListener('click', function() {
    textoBoton = "Soyaniquilpan de Juarez";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Sulte').addEventListener('click', function() {
    textoBoton = "Sultepec";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Teca').addEventListener('click', function() {
    textoBoton = "Tecamac";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Teju').addEventListener('click', function() {
    textoBoton = "Tejupilco";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Temama').addEventListener('click', function() {
    textoBoton = "Temamatla";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Temas').addEventListener('click', function() {
    textoBoton = "Temascalapa";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_TemasC').addEventListener('click', function() {
    textoBoton = "Temascalcingo";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_TemasCal').addEventListener('click', function() {
    textoBoton = "Temascaltepec";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Temoaya').addEventListener('click', function() {
    textoBoton = "Temoaya";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Tenan').addEventListener('click', function() {
    textoBoton = "Tenancingo";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_TenanA').addEventListener('click', function() {
    textoBoton = "Tenancingo del Aire";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_TenanV').addEventListener('click', function() {
    textoBoton = "Tenango del Valle";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Teol').addEventListener('click', function() {
    textoBoton = "Teoloyucan";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Teoti').addEventListener('click', function() {
    textoBoton = "Teotihuacan";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Tepetla').addEventListener('click', function() {
    textoBoton = "Tepetlaoxtoc";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Tepet').addEventListener('click', function() {
    textoBoton = "Tepetlixpa";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Tepoz').addEventListener('click', function() {
    textoBoton = "Tepotzotlan";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Tequix').addEventListener('click', function() {
    textoBoton = "Tequixquiac";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Texcal').addEventListener('click', function() {
    textoBoton = "Texcaltitlan";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Texcalya').addEventListener('click', function() {
    textoBoton = "Texcalyacac";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Texcoco').addEventListener('click', function() {
    textoBoton = "Texcoco";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Tezoy').addEventListener('click', function() {
    textoBoton = "Tezoyuca";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Tianguis').addEventListener('click', function() {
    textoBoton = "Tianguistenco";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Timilpan').addEventListener('click', function() {
    textoBoton = "Timilpan";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Tlalma').addEventListener('click', function() {
    textoBoton = "Tlalmanalco";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Tlalne').addEventListener('click', function() {
    textoBoton = "Tlalnepantla de Baz";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Tlatla').addEventListener('click', function() {
    textoBoton = "Tlatlaya";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Toluca').addEventListener('click', function() {
    textoBoton = "Toluca";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Tonatico').addEventListener('click', function() {
    textoBoton = "Tonatico";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Tultepec').addEventListener('click', function() {
    textoBoton = "Tultepec";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Tulti').addEventListener('click', function() {
    textoBoton = "Tultitlan";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Tulti').addEventListener('click', function() {
    textoBoton = "Tultitlan";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_ValleB').addEventListener('click', function() {
    textoBoton = "Valle de Bravo";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_ValleS').addEventListener('click', function() {
    textoBoton = "Valle de Chalco Solidaridad";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_VillaA').addEventListener('click', function() {
    textoBoton = "Villa de Allende";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_VillaC').addEventListener('click', function() {
    textoBoton = "Villa del Carbon";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_VillaG').addEventListener('click', function() {
    textoBoton = "Villa Guerrero";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_VillaV').addEventListener('click', function() {
    textoBoton = "Villa Victoria";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Xala').addEventListener('click', function() {
    textoBoton = "Xalatlaco";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Xona').addEventListener('click', function() {
    textoBoton = "Xonacatlan";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Zacanzo').addEventListener('click', function() {
    textoBoton = "Zacanzonapan";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Zacua').addEventListener('click', function() {
    textoBoton = "Zacualpan";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Zinacan').addEventListener('click', function() {
    textoBoton = "Zinacantepec";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Zumpa').addEventListener('click', function() {
    textoBoton = "Zumpahuacan";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Zumpan').addEventListener('click', function() {
    textoBoton = "Zumpango";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_SanJose').addEventListener('click', function() {
    textoBoton = "San Jose del Rincon";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})

document.getElementById('opc_Luvi').addEventListener('click', function() {
    textoBoton = "Luvianos";
    if (inputB.value==""){
        inputB.value = textoBoton;
    }
    else if (inputB.value!=""){
        inputB.value += ","+textoBoton;
    }
})



//bloquear click derecho
// document.addEventListener("contextmenu", function(event){
//     event.preventDefault();
// });