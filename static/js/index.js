//pantalla completa
// const elem = document.documentElement;
// if (elem.requestFullscreen) {
//      elem.requestFullscreen();
//      } else if (elem.webkitRequestFullscreen) { /* Safari */
//      elem.webkitRequestFullscreen();
//      } else if (elem.msRequestFullscreen) { /* IE11 */
//      elem.msRequestFullscreen();
// }

//tipos de busqiedas
const TIPOS = Object.freeze({
    VARIOS:"varios",
    RANGO:"rango",
    NOMBRE:"nombre"
});
//expresiones regulares
const EXPRESIONES = Object.freeze({
    ID_MUNICIPIO:/^15(?:0[0-9][0-9]|1[0-2][0-5])(?:,(?!$)15(?:0[0-9][0-9]|1[0-2][0-5]))*(?:-15(?:0[0-9][0-9]|1[0-2][0-5]))?$/,
    NOMBRE_MUNICIPIO:/^[a-zA-Z\s]{6,20}$/,
    SECCION_MUNICIPIO:/^(?:[1-9]|[0-9][0-9]{1,2}|[0-5][0-9]{3}|6[0-5][0-9][0-9]|66[0-3][0-7]|66[0-2][0-9])(?:,(?!$)([1-9]|[0-9][0-9]{1,2}|[0-5][0-9]{3}|6[0-5][0-9][0-9]|66[0-3][0-7]|66[0-2][0-9]))*(?:-(?!$)([1-9]|[0-9][0-9]{1,2}|[0-5][0-9]{3}|6[0-5][0-9][0-9]|66[0-3][0-7]|66[0-2][0-9]))?$/
});
//arregos
const ARREGLOS = Object.freeze({
    PARTIDOS:["PAN","PRI", "PRD", "PT", "PVEM", "MC", "NA", "MORENA", "ES", "VR", "PH", "PES", "PFD", "RSP", "FXM", "NAEM", "INDEP"],
    COLORES:["#0453A5", "#FF0108","#FFB928", "#FD4146", "#00C65C", "#FF7400",   "#33BDBD", "#BA0005",  "#B632BF", "#FF018C", "#DC3892",    "#72017A", "#FF9945", "#FD4146", "#EF7CBB", "#6BDBDB", "#BB9A00" ],
    COLORES2:['#0453A5','#FF7400','#FFB928','#FF0108'],
});

// const PARTIDOS = ["PAN","PRI", "PRD", "PT", "PVEM", "MC", "NA", "MORENA", "ES", "VR", "PH", "PES", "PFD", "RSP", "FXM", "NAEM", "INDEP"];
// const COLORES = ["#0453A5", "#FF0108","#FFB928", "#FD4146", "#00C65C", "#FF7400",   "#33BDBD", "#BA0005",  "#B632BF", "#FF018C", "#DC3892",    "#72017A", "#FF9945", "#FD4146", "#EF7CBB", "#6BDBDB", "#BB9A00" ];
//const COLORES2 = ['#0453A5','#FF7400','#FFB928','#FF0108'];

//let boton = document.querySelector(".buscar")
let buscador = document.querySelector(".Ibuscar")
let boton_buscador = document.querySelector(".Bbuscar")
let botones_rapidos = document.querySelectorAll(".sRapida")
boton_buscador.disabled = true

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
            tipo: TIPOS.NOMBRE,
            datos: element.getAttribute("id"),
            years: ["2015","2017","2018","2021"]
        }
        //console.log(json);
        enviar_datos(json)
        .then(data_s => {
            //console.log(Object.keys(data_s.datos));
            crear_grafica(data_s, TIPOS.NOMBRE);
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
    if(EXPRESIONES.ID_MUNICIPIO.test(dato) || EXPRESIONES.NOMBRE_MUNICIPIO.test(dato) || EXPRESIONES.SECCION_MUNICIPIO.test(dato)) { 
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
    if(EXPRESIONES.ID_MUNICIPIO.test(dato) || EXPRESIONES.NOMBRE_MUNICIPIO.test(dato) || EXPRESIONES.SECCION_MUNICIPIO.test(dato)) { 
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
        tipo = TIPOS.VARIOS;
        datos_analizados =  datos.split(",");
        json = {
            tipo: tipo,
            datos: datos_analizados,
            years:obtener_years()
        }
        enviar_datos(json)
        .then(data_s => {
            //console.log(data_s.datos);
            crear_grafica(data_s);
        });

    } else if(datos.indexOf("-") != -1){
        tipo = TIPOS.RANGO;
        datos_analizados =  datos.split("-");
        json = {
            tipo: tipo,
            datos: datos_analizados,
            years:obtener_years()
        }
        enviar_datos(json)
        .then(data_s => {
            //console.log(data_s.datos);
            crear_grafica(data_s);
        });
    } else { 
        tipo = TIPOS.NOMBRE
        json = {
            tipo: tipo,
            datos: datos,
            years:obtener_years()
        }
        enviar_datos(json)
        .then(data_s => {
            //console.log(data_s.datos);
            crear_grafica(data_s);
        });
    }
}

function crear_grafica(data_s){

    let municipios = [];
    let years = Object.keys(data_s.datos);
    let partidos = [];
    let chartData = {};
    

    municipios = encontrar_municipios(years, data_s);
    let totalDatos = years.length * municipios.length;
    console.log(totalDatos);
    partidos = ordenar_partidos(municipios, years, data_s);
    chartData = crear_diccionario(municipios, years, partidos);

    let fragmento = document.createDocumentFragment();
    let municipio = [];
    let year = 0;
    let aux = 0;
    for(let i=0;i<municipios.length;i++){
        //municipio.splice();
        // verificar el filtrado, incongruencias al encontrar municipios con nombre parecido.
        //console.log(municipio);
        //municipio = chartData.filter(item =>item.label.includes(municipios[i])); 
        municipio = chartData.filter(item=>
            item.label.substring(0,municipios[i].length).endsWith(municipios[i])
            //console.log(item.label.substring(0,municipios[i].length))
        );
        console.log(municipio);
        let canvas = document.createElement("canvas");
        canvas.setAttribute("class", "grafica0");
        
        let contexto = canvas.getContext("2d");
        let char = new Chart(contexto, {
                type: "bar",
                data: {
                labels: ARREGLOS.PARTIDOS,
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
    let listayear = Array.from(years).reduce((year, item)=>{
        if (item.checked) year.push(item.getAttribute("value"));
        return year;
    },[]);
    
    return listayear;
}

function encontrar_municipios(years, data_s){
    let municipios = [];
    let n_municipios = Object.keys(data_s.datos[years[0]]).length
    /**formato de js(data_s)
     * 1.data_s.datos[years[0]] determina el año
     * 2.data_s.datos[years[0]][2] determina el la posicion del arreglo
     * 3.data_s.datos[years[0]][2]["ACULCO"] determina el municipio
     * 4.data_s.datos[years[0]][2]["ACULCO"]["PAN"] determina el partido
     * nota: el 2 y el 3 deben ser iguales, ejemplo:
     * si existen 3 municipios 2 debe de estar posicionado en el arreglo donde
     * se encuentre aculco, es el numero del municipio.
     */
    //console.log(data_s.datos[years[0]][0][municipios[0]][PARTIDOS[0]]);

    for (let i = 0; i < years.length; i++) {
        for (let j = 0; j < n_municipios; j++) {
            let municipio = Object.keys(data_s.datos[years[i]][j])[0];
            if (!municipios.some((m) => municipio.startsWith(m) && municipio.endsWith(m))) { // verificar el filtro, repite municipios con nombres similares
                municipios.push(municipio);
            }
        }
    }
        
    return municipios;
}

function ordenar_partidos(municipios, years, data_s){
    let aux = 0;
    let partidos = [];
    console.log(Object.keys(data_s.datos[years[0]]))
    while(aux < municipios.length){
        //console.log(aux)
        for (let i = 0; i < years.length; i++) {
            //console.log(i)
            let partidosAnuales = [];
            for (let j = 0; j < ARREGLOS.PARTIDOS.length; j++) {
                //console.log(`${PARTIDOS[j]}:`+data_s.datos[years[i]][aux][municipios[aux]][PARTIDOS[j]])
                try{
                    // let partido = data_s.datos[years[i]][aux][municipios[aux]][ARREGLOS.PARTIDOS[j]];
                    // partidosAnuales.push(partido)
                    if(data_s.datos[years[i]][aux][municipios[aux]][ARREGLOS.PARTIDOS[j]] === undefined){
                        partidosAnuales.push(0);
                    }else partidosAnuales.push(data_s.datos[years[i]][aux][municipios[aux]][ARREGLOS.PARTIDOS[j]]);
                }catch(error){
                    console.log(error);
                }

                // if(j==1){
                //     console.log(municipios[aux]+":"+partido)
                // }
                
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

    //formato diccionario
    //diccionario[0] indica el año
    //diccionario[0][0] indica el municipio
    //let info = diccionario[0][0]

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
                backgroundColor: ARREGLOS.COLORES[j],
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
    return chartData;
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
