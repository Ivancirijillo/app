//Tipos de busqiedas
const TIPOS = Object.freeze({
    VARIOS:"varios",
    RANGO:"rango",
    NOMBRE:"nombre"
});
//Expresiones regulares
const EXPRESIONES = Object.freeze({
    ID_MUNICIPIO:/^15(?:0[0-9][0-9]|1[0-2][0-5])(?:,(?!$)15(?:0[0-9][0-9]|1[0-2][0-5]))*(?:-15(?:0[0-9][0-9]|1[0-2][0-5]))?$/,
    NOMBRE_MUNICIPIO:/^[a-zA-Z\s]{6,20}$/,
    SECCION_MUNICIPIO:/^(?:[1-9]|[0-9][0-9]{1,2}|[0-5][0-9]{3}|6[0-5][0-9][0-9]|66[0-3][0-7]|66[0-2][0-9])(?:,(?!$)([1-9]|[0-9][0-9]{1,2}|[0-5][0-9]{3}|6[0-5][0-9][0-9]|66[0-3][0-7]|66[0-2][0-9]))*(?:-(?!$)([1-9]|[0-9][0-9]{1,2}|[0-5][0-9]{3}|6[0-5][0-9][0-9]|66[0-3][0-7]|66[0-2][0-9]))?$/
});
//Arreglos
const ARREGLOS = Object.freeze({
    PARTIDOS:["PAN","PRI", "PRD", "PT", "PVEM", "MC", "NA", "MORENA", "ES", "VR", "PH", "PES", "PFD", "RSP", "FXM", "NAEM", "INDEP"],
    COLORES:["#0453A5", "#FF0108","#FFB928", "#FD4146", "#00C65C", "#FF7400",   "#33BDBD", "#BA0005",  "#B632BF", "#FF018C", "#DC3892",    "#72017A", "#FF9945", "#FD4146", "#EF7CBB", "#6BDBDB", "#BB9A00" ],
    COLORES2:['#0453A5','#FF7400','#FFB928','#FF0108'],
});

//let boton = document.querySelector(".buscar")
let buscador = document.querySelector(".Ibuscar")
let boton_buscador = document.querySelector(".Bbuscar")
let botones_rapidos = document.querySelectorAll(".sRapida")
boton_buscador.disabled = true

//FUNCION DEL BOTON MOSTRAR Y OCULTAR
const contenedordiv = document.querySelector('#mostrar')
let isClicked = true
// Muestra la ventana de opciones rapidas
let mostrarocultar = function(){
    //verifica si el boton fue presionado
    if(isClicked){
        //Cambia el display del contenedor
        contenedordiv.style.display = 'flex';
        isClicked = false;
    }else{
        //Cambia el display del contenedor para ocultarlo
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
/**
 * Eventos para busquedas rapidas
 * Se agrega a todos los botones de la seleccion rapida la misma funcion
 */
botones_rapidos.forEach(element => {
    //Evento de clcik para todos los elementos
    element.addEventListener("click",(e)=>{
        //desactiva el evento por defecto
        e.preventDefault();
        //Objeto json para enviar a flask
        json = {
            tipo: TIPOS.NOMBRE,
            datos: element.getAttribute("id"),
            years: ["2015","2017","2018","2021"]
        }
        //Envia los datos al backend
        enviar_datos(json)
        .then(data_s => {
            crear_grafica(data_s, TIPOS.NOMBRE);
        });
        //metodos para la carga de la grafica
        ventana_carga();
        scrollToSection("Abajoxd");
        mostrarocultar();
        
    });
});

/**
 * Eventos de validacion de datos de entrada
*/
buscador.addEventListener("input",(e)=>{
    //Desactiva el evento por defecto
    e.preventDefault();
    //Valor de entrada a buscar
    let dato = buscador.value
    //Valida si el dato a buscar desactivando el boton de envio si es un
    // - Nombre
    // - ID
    // - Seccion
    if(EXPRESIONES.ID_MUNICIPIO.test(dato) || EXPRESIONES.NOMBRE_MUNICIPIO.test(dato) || EXPRESIONES.SECCION_MUNICIPIO.test(dato)) { 
        boton_buscador.disabled = false;
        boton_buscador.style.borderColor = "#0453A5";
    }else {
        boton_buscador.disabled = true;
        boton_buscador.style.borderColor = "#FF0108";
    }
});

/**
 * Eventos de validacion de datos de salida
 */
buscador.addEventListener("blur",(e)=>{
    //Desactiva el evento por defecto
    e.preventDefault();
    //Valor de entrada a buscar
    let dato = buscador.value;
        //Valida si el dato a buscar desactivando el boton de envio si es un
    // - Nombre
    // - ID
    // - Seccion
    if(EXPRESIONES.ID_MUNICIPIO.test(dato) || EXPRESIONES.NOMBRE_MUNICIPIO.test(dato) || EXPRESIONES.SECCION_MUNICIPIO.test(dato)) { 
        boton_buscador.disabled = false;
        boton_buscador.style.borderColor = "#0453A5";
    }else {
        boton_buscador.disabled = true;
        boton_buscador.style.borderColor = "#FF0108";
    }
});

/**
 * Eventos de boton buscador
 * Campura los datos del input para su analisis 
 */
boton_buscador.addEventListener("click", (e)=>{
    //Desactiva el evento por defecto
    e.preventDefault();
    //Objeto combobox que contiene los años
    let cbox = document.querySelectorAll(".cbox");
    //verifica si por minimo hay un elemento seleccionado
    let pass = Array.from(cbox).some((item)=>{
        return item.checked
    });
    //si hay uno elemento seleccionado entonces analiza los datos
    if(pass){
        ventana_carga();
        analizar_datos();
    } else{
        //de lo contrario muestra un alerta sobre el problema
        mostrarAlerta();
        setTimeout(function() {
            ocultarAlerta(); 
        }, 1500);
    }
});

/**
 * Boton limpiar
 * Elimina los datos del input 
*/
document.getElementById('BLimpiar').addEventListener('click', function() {
    buscador.value= "";
})

/**
 * Muestra una ventana de alerta que indica la falta 
 * de un parametro para realizar una busqueda
*/
function mostrarAlerta() {
    const alerta = document.getElementById("mi-alert");
    alerta.style.display = "flex";
}
/**
 * Oculta la ventana de alerta
*/
function ocultarAlerta() {
    const alerta = document.getElementById("mi-alert");
    alerta.style.display = "none";
}
/**
 * Envia los datos analizados al backend.
 * @param {object} data Son los datos a enviar, debe de ser un diccionario.
 * @returns {object} Respuesta del servidor.
 */

function enviar_datos(data){
    //Retorna el API fetch
    return fetch('/consultas-buscador', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
    })
    //Retorna la respuesta en formato json
    .then(response =>{
        return response.json()
    });
}

/**
 * Analiza los datos del buscador para
 * determinar el tipo de busqueda a realizar.
 * Los tipos de busqueda son:
 * -ID
 * -Nombre
 * -Seccion
*/
function analizar_datos(){
    //Variables para guardar los datos del input
    let datos = buscador.value.toUpperCase();
    let datos_analizados = "";
    let tipo = "";
    let json = {};
    //Determina si el input contiene una ",", en se caso es de tipo varios
    if(datos.indexOf(",") != -1){
        tipo = TIPOS.VARIOS;
        //Separa los datos por la ","
        datos_analizados =  datos.split(",");
        //Crea el diccionario con los datos analizados
        json = {
            tipo: tipo,
            datos: datos_analizados,
            years:obtener_years()//Obtiene los años a buscar
        }
        enviar_datos(json)
        .then(data_s => {
            //Crea la grafica
            crear_grafica(data_s);
        });

    }
    //Determina si los datos estan separados por un "-", en ese caso es de tipo rango
    else if(datos.indexOf("-") != -1){
        tipo = TIPOS.RANGO;
        //Separa los datos por "-"
        datos_analizados =  datos.split("-");
        //Crea el diccionario con los datos analizados
        json = {
            tipo: tipo,
            datos: datos_analizados,
            years:obtener_years()//Obtiene los años a buscar
        }
        enviar_datos(json)
        .then(data_s => {
            //Crea la grafica
            crear_grafica(data_s);
        });
    } 
    //De lo contrario es de tipo Nombre
    else { 
        tipo = TIPOS.NOMBRE
        //Crea el diccionario con los datos analizados
        json = {
            tipo: tipo,
            datos: datos,
            years:obtener_years()//Obtiene los años a buscar
        }
        enviar_datos(json)
        .then(data_s => {
            //Crea la grafica
            crear_grafica(data_s);
        });
    }
}

/**
 * Crea una grafica con los datos ingresados.
 * @param {Object} data_s Son los datos recibidos del backend, debe de ser un diccionario. 
 */
function crear_grafica(data_s){
    //Variables para guardar los datos de los municipios a buscar
    let municipios = [];
    let municipios_seccion = [];
    let seccion = false;
    let years = Object.keys(data_s.datos);
    let partidos = [];
    //Variable que guarda los datos de las graficas
    let chartData = {};
    
    //Separa la informacion de los municipios
    informacion_municipos = encontrar_municipios(years, data_s);
    municipios = informacion_municipos[0];
    seccion = informacion_municipos[1];
    municipios_seccion = informacion_municipos[2];
    //Ordena los partidos y crea un diccionario con los nuevos datos ordenados
    partidos = ordenar_partidos(municipios, years, data_s);
    chartData = crear_diccionario(municipios, years, partidos);
    //Guarda un conjunto de graficas
    let fragmento = document.createDocumentFragment();
    //Guarda los municipios buscados
    let municipio = [];
    //Recorre n cantidad de veces hasta completar la cantidad de municipios buscados
    for(let i=0;i<municipios.length;i++){
        //Filtra todos los municipios buscados(busca los municipios)
        municipio = chartData.filter(item=> {
            //Identifica si contiene la palabra seccion
            if(seccion){
                //busca el ultimo espacio an
                let penultimo_espacio = item.label.substring(0,item.label.lastIndexOf(" "));
                let ultimo_espacio = penultimo_espacio.lastIndexOf(" ");
                //console.log(item.label.substring(0,ultimo_espacio));
                return item.label.substring(0,ultimo_espacio).startsWith(municipios[i]) && item.label.substring(0,ultimo_espacio).endsWith(municipios[i])
            }else{
                //busca la letra a, debido a que todos los nombres tienen año en ellos
                //restamos una posicion para eliminar el espacio
                //ejemplo Acambay an
                let longitud = item.label.indexOf("a")-1;
                return item.label.substring(0,longitud).startsWith(municipios[i]) && item.label.substring(0,longitud).endsWith(municipios[i])
            }
        }),[];
        //console.log(municipio);
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
    let municipios_seccion = [];
    let seccion = false;
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
            if(municipio.includes("SECCION")){
                seccion = true;
                //console.log("longitud:"+municipio.length+"-"+municipio.substring(0, municipio.length - 11))
                let indicePunto = municipio.indexOf(".");
                //console.log(municipio.substring(0,indicePunto))
                if (!municipios_seccion.some((m) => municipio.substring(0,indicePunto).startsWith(m) && municipio.substring(0, indicePunto).endsWith(m))) { // verificar el filtro, repite municipios con nombres similares
                    municipios_seccion.push(municipio.substring(0,indicePunto));
                }
                if (!municipios.some((m) => municipio.startsWith(m) && municipio.endsWith(m))) { // verificar el filtro, repite municipios con nombres similares
                    municipios.push(municipio);
                }
            }else{
                if (!municipios.some((m) => municipio.startsWith(m) && municipio.endsWith(m))) { // verificar el filtro, repite municipios con nombres similares
                    municipios.push(municipio);
                }
            }

        }
    }

    return [municipios, seccion, municipios_seccion];
}

function ordenar_partidos(municipios, years, data_s){
    let aux = 0;
    let partidos = [];
    let a = [];
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

    //encontrar municipios


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
