/**
 * Funciones e interaciones del mapa
 * @author MedioByte
 */

/* HEADER */

/**
 * Cambiar de ventana de acuerdo a una ruta valida
 * @param {String} ventana Ruta a la que cambiara de ventana
 */
function wind_pag(ventana){
    window.location.href = ventana;
}

const btnMenu = document.getElementById('regresar-menu');
btnMenu.addEventListener('click', function (){ //Regresa a la ventena
    wind_pag('/Menu')
});

/* MAIN */

/* SUBTARJETA lISTAS */
const divAnio = document.getElementById('contenido-anio'),
      divCategoria = document.getElementById('contenido-categoria'),
      ulAnio = document.getElementById('opciones-ul-anio'),
      ulCategoria = document.getElementById('opciones-ul-categoria'),
      textListaPAnio = divAnio.querySelector('p').textContent,
      textListaPCategoria = divCategoria.querySelector('p').textContent;

/**
 * Restaurar la clase secundario por el primario
 * @param {Object} elem_cont Elemento del contenedor
 */
function restausarClases(elem_cont){
    let Aux = elem_cont.querySelectorAll('.li-seg')
    Aux.forEach(element => {
        element.classList.remove('li-seg');
    })
    elem_cont.classList.add('ul-prim')
    elem_cont.classList.remove('ul-seg')
}

/**
 * Despliegar elementos UL al que se desea visualizar el contenido de las opciones 
 * @param {Object} elem_des Elemento a desplegar
 * @param {Object} elem_remove Elemento a remover
 */
function desplegarUl(elem_des, elem_remove){
    elem_remove.classList.add('ul-prim')
    elem_remove.classList.remove('ul-seg')
    elem_des.classList.toggle('ul-prim')
    elem_des.classList.toggle('ul-seg')
}

/**
 * Guadar las opciones seleccionadas del ul activo y remplaza el texto que contenga el div activo 
 * @param {Object} divActivo Elemento DIV que se esta manipulando 
 * @param {Object} ulActivo Elemento UL que se esta manipulando
 * @param {String} textOrigin Texto Original del DIV activo
 * @returns Opciones seleccionadas que contienen los elementos UL
 */
function opcSeleccionado(divActivo, ulActivo, textOrigin){
    var textSelec = ' ',
        contador = 0,
        seleccion = ' '
    let claseActiva = ulActivo.querySelectorAll('.li-seg')
    
    let opciones = [];

    claseActiva.forEach(element => {
        opciones[contador] = element.textContent
        contador++
        textSelec += ' -' + element.textContent
        seleccion = element.textContent
    })

    if(textSelec != ' '){
        divActivo.querySelector('p').textContent = textSelec;
        divActivo.classList.add('contenido-lista-seg')
    }else if(contador == 0){
        divActivo.querySelector('p').textContent = textOrigin;
        divActivo.classList.remove('contenido-lista-seg')
    }
    return opciones
}

divAnio.addEventListener('click', function(){ //Despliega el UL del DIV Año
    desplegarUl(ulAnio, ulCategoria)
})

divCategoria.addEventListener('click', function(){ //Despliega el UL del DIV Categoria
    desplegarUl(ulCategoria, ulAnio)
})

var anio = [], categoria = ' ';
ulAnio.addEventListener('click', (e) => {
    if(e.target && e.target.tagName === 'LI'){
        e.target.classList.toggle('li-seg'); //Marca las opciones elegidas del UL
    }
    anio = opcSeleccionado(divAnio, ulAnio, textListaPAnio) //Guarda la respuesta de la funcion en una variable especifica del año
})

ulCategoria.addEventListener('click', (e) => {
    if(e.target && e.target.tagName === 'LI'){
        e.target.classList.toggle('li-seg'); //Marca las opciones elegidas del UL
    }
    categoria = opcSeleccionado(divCategoria, ulCategoria, textListaPCategoria) //Guarda la respuesta de la funcion en una variable especifica de la categoria
})

/* SUBTARJETA TABLA */

/**
 * Crear una tabla que es guardado en una estructura para que sea leido en html en la varibale "templete", la ultima posicion 
 * contiene la direccion que tomara la tabla (Vertical u Horizantal)
 * @param {Array} tablas Contenido de la tabla 
 * @param {Array} cabecera Cabezales de la tabla
 * @returns Estrutura completa de la tabla a mostar o un titulo 
 */
function tabla_crear(tablas, cabecera){
    var template = '';
    direccion = cabecera[cabecera.length-1];
    if(direccion == "V"){
        for(var i = 0; i < tablas.length ; i++){
            for (let j = 0; j < tablas[i].length; j++) {
                if(tablas[i][j] == null){
                    template += '<tr><th>'+cabecera[j]+'<td>-</td>';
                }else{
                    template += '<tr><th>'+cabecera[j]+'</th><td>'+tablas[i][j]+'</td></tr>';
                }
            }
        }
    }else{
        template += '<tr>';
        for(var i = 0; i < (cabecera.length)-1; i++){
            template += '<th>'+cabecera[i]+'</th>';
        }
        template += '</tr>';
        for(var i = 0; i < tablas.length ; i++){
            template += '<tr>';
            for (let j = 0; j < tablas[i].length; j++) {
                if(tablas[i][j] == null){
                    template += '<td>-</td>';
                }else{
                    template += '<td>'+tablas[i][j]+'</td>';
                }
            }
            template += '</tr>';
        }
    }
    if(tablas.length == 0) template = '<tr><td><h2> Datos inexistentes </h2></td></tr>';
    return template;
}

/**
 * Enviar informacion en formato JSON a python y que devulva una respuesta, respuesta que es procesado en python
 * @param {Object} data Datos a enviar al python con json 
 * @returns Respuesta de python a la solicitud
 */
function enviar_json (data){
    return fetch('/impresiones', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {return response.json()})
}

/**
 * Muestrar una ventana de emergencia flotante que el elemento especifica en su contenido un aviso en un tiempo especifico
 * @param {Object} elem_emerg Elemento emergente a mostrar
 * @param {Number} tiempo Tiempo de espera
 */
function avisoEmergente(elem_emerg, tiempo){
    elem_emerg.classList.toggle('v-emergen');
    elem_emerg.classList.toggle('v-emergen_validado_R');
    setTimeout(() => {
        elem_emerg.classList.toggle('v-emergen_validado_R');
        elem_emerg.classList.toggle('v-emergen');
    }, tiempo);
}

var comp = 0

const btnContinuar = document.getElementById('continuar'),
      tabla = document.getElementById('tabla'),
      ventanaEmergente = document.getElementById('v-emergen')
btnContinuar.addEventListener('click', function (){
    var cabecera_consul_A = new Array ("Nombre", "Número de Apoyos", " ");
    var cabecera_consul_D = new Array ("Alto Impacto", "Homicidios", "Feminicidios", "Secuestros", 
                                        "Desapariciones Totales", "Robos", "Robo Transporte", "V");
    var cabecera_consul_Pa = new Array ("Padrón Hombres", "Padrón Mujeres", "Padrón Total", "Lista Nominal Hombres", 
                                        "Lista Nominal Mujeres", "Lista Nominal Total", "V");
    var cabecera_consul_Po = new Array ("Pobreza", "Porcentaje de Pobreza extrema", "Pobreza moderada", "Porcentaje de Rezago Educativo", 
                                        "Porcentaje Carencia Seguro Social", "Porcentaje Carencia de Calidad de Vivienda.", "Porcentaje Carencia de Alimentación.", "PIB", "UET", "V");
    var cabecera_consul_Eco = new Array ("PIB", "PIB PER CÁPITA", "Unidades económicas", "V");
    var cabecera_consul_Em = new Array ("Total General", "Salario Promedio", "V");
    var cabecera_consul_Pob = new Array ("Población total", "Edad mediana", "Habla lengua indígena", "Personas con discapacidad", 
                                        "Afiliados al sistema de seguridad social", "No Afiliado", "Hogares", "Con Limitación Alimentaria","Sin Limitación Alimentaria", "V");
    var cabecera_consul_R = new Array ("Coeficiente de Gini", "Índice de Rezago Social", "Grado de Rezago Social", "Lugar Nacional", "V");
    const fil_cabecera = { //Filtro de los cabezales, solo se mostraran los seleccionados
        'Apoyos': cabecera_consul_A,
        'Delincuencia': cabecera_consul_D,
        'Padrón Electoral': cabecera_consul_Pa,
        'Pobreza': cabecera_consul_Po,
        'Economía': cabecera_consul_Eco,
        'Empleo': cabecera_consul_Em,
        'Población': cabecera_consul_Pob,
        'Rezago Social': cabecera_consul_R
    }

    const elementos = new Array(anio.length);//Variable de arreglo con tamaño al de los años seleccionados
    
    if(anio.length != 0 && categoria.length != 0){ //Podra ejecutarse solo en caso de haber variables seleccionados
        for (let valorAnio of anio){

            elementos[anio.indexOf(valorAnio)] = new Array(categoria.length+1); //Variable de arreglo con tamaño al de las categorias seleccionados
            elementos[anio.indexOf(valorAnio)][0] = '<p class="pAnio">'+valorAnio+'</p>';

            for (let valorCategoria of categoria){

                elementos[anio.indexOf(valorAnio)][categoria.indexOf(valorCategoria)+1] = '<p>'+valorCategoria+'</p>';
                let data = {
                    tipo_c: valorCategoria,
                    year: valorAnio,
                    id: id_municipio,
                    modo: ' ' //if(data.modo != "impresion") //Solo se desea obtener informacion
                }
                console.log(data)
                enviar_json(data) //Envia el objeto para tener una respuesta y manipular la informacion recibida
                .then(dataRespuesta => {
                    let cosultaDB = dataRespuesta["consulta"];
                    console.log(dataRespuesta["consulta"])
                    elementos[anio.indexOf(valorAnio)][categoria.indexOf(valorCategoria)+1] += '<table>'+tabla_crear(cosultaDB, fil_cabecera[valorCategoria])+'</table>';
                });
            }
        }
        
        setTimeout(() => { //Hace espera de medio segundo para terminar de cargar la informacion que es enviada de python
            tabla.innerHTML = ' ' //Vacia la variable en caso de ya haber tenido informacion
            for(let i = 0; i < elementos.length; i++){
                for(let j = 0; j < elementos[i].length; j++){
                    tabla.innerHTML += elementos[i][j]
                }
            }
        }, 500);

        cambioTarjeta(2) // Cambia de tarjeta de Filtro al de Tablas
        comp = 0 // Variable campo que confirma que el filtro fue del Municipio
    }else{ //En caso de no haber años o categorias selecionadas mostrara un ventana emergente
        avisoEmergente(ventanaEmergente, 3000)
    }
});

const btnVolver = document.getElementById('volver')
btnVolver.addEventListener('click', function (){
    cambioTarjeta(1) //Regresa al filtro de Municipio
    if(comp == 1) cambioTarjeta(4) //Vuelve al filtro de Seccion solo en caso de que el campo sea 1

    ulAnio.classList.remove('ul-prim')
    ulAnio.classList.add('ul-seg')
    desplegarUl(ulAnio, ulCategoria) //Se aplico una forma de mantener las opciones activas del ultimo filtrado para la parte de Municipio
    ulAnio2.classList.remove('ul-prim')
    ulAnio2.classList.add('ul-seg')
    desplegarUl(ulAnio2, ulCategoria2)  //Se aplico una forma de mantener las opciones activas del ultimo filtrado para la parte de Seccion
});

/* SUBTARJETA SECCIONES */
const divAnio2 = document.getElementById('contenido-anio-2'),
      divCategoria2 = document.getElementById('contenido-categoria-2'),
      ulAnio2 = document.getElementById('opciones-ul-anio-2'),
      ulCategoria2 = document.getElementById('opciones-ul-categoria-2'),
      textListaPAnio2 = divAnio2.querySelector('p').textContent,
      textListaPCategoria2 = divCategoria2.querySelector('p').textContent;

divAnio2.addEventListener('click', function(){  //Despliega el UL del DIV Año
    desplegarUl(ulAnio2, ulCategoria2)
})

divCategoria2.addEventListener('click', function(){ //Despliega el UL del DIV Categoria
    desplegarUl(ulCategoria2, ulAnio2)
})

var anio2 = [], categoria2 = ' ';
ulAnio2.addEventListener('click', (e) => {
    if(e.target && e.target.tagName === 'LI'){
        e.target.classList.toggle('li-seg'); //Marca las opciones elegidas del UL
    }
    anio2 = opcSeleccionado(divAnio2, ulAnio2, textListaPAnio2) //Guarda la respuesta de la funcion en una variable especifica del año
})

ulCategoria2.addEventListener('click', (e) => {
    if(e.target && e.target.tagName === 'LI'){
        e.target.classList.toggle('li-seg'); //Marca las opciones elegidas del UL
    }
    categoria2 = opcSeleccionado(divCategoria2, ulCategoria2, textListaPCategoria2) //Guarda la respuesta de la funcion en una variable especifica de la categoria
})

const continuarSeccion = document.getElementById('continuarSeccion');
continuarSeccion.addEventListener('click', function (){
    console.log("entra")
    var cabecera_consul_V = new Array ("Año", "Votos Válidos", "Votos Nulos", "Total de Votos", "Lista Nominal", "V");
    const fil_cabecera = {
        'Votos': cabecera_consul_V
    }

    const elementos = new Array(anio2.length); //Variable de arreglo con tamaño al de los años seleccionados
    
    if(anio2.length != 0 /*&& categoria.length != 0*/){ //Podra ejecutarse solo en caso de haber variables seleccionados
        for (let valorAnio of anio2){

            // elementos[anio.indexOf(valorAnio)] = new Array(categoria.length+1);
            elementos[anio2.indexOf(valorAnio)]/*[0]*/ = '<p class="pAnio">'+valorAnio+'</p>';

            // for (let valorCategoria of categoria){

                // elementos[anio.indexOf(valorAnio)][categoria.indexOf(valorCategoria)+1] = '<p>'+valorCategoria+'</p>';
                let data = {
                    tipo_c: 'Votos',
                    year: valorAnio,
                    id: id_seccion,
                    modo: ' ' //if(data.modo != "impresion")
                }
                enviar_json(data)  //Envia el objeto para tener una respuesta y manipular la informacion recibida
                .then(dataRespuesta => {
                    let cosultaDB = dataRespuesta["consulta"];
                    elementos[anio2.indexOf(valorAnio)]/*[categoria.indexOf(valorCategoria)+1]*/ += '<table>'+tabla_crear(cosultaDB, fil_cabecera['Votos'])+'</table>';
                    
                });
            // }
        }

        setTimeout(() => {
            tabla.innerHTML = ' '
            for(let i = 0; i < elementos.length; i++){
                tabla.innerHTML += elementos[i]
            }
        }, 500);

        cambioTarjeta(2) // Cambia de tarjeta de Filtro al de Tablas

        comp = 1 // Variable campo que confirma que el filtro fue de la Seccion 
    }else{ //En caso de no haber años o categorias selecionadas mostrara un ventana emergente
        avisoEmergente(ventanaEmergente2, 3000)
    }
});

function printDiv(nombreDiv) {
    var contenido= document.getElementById(nombreDiv).innerHTML;
    var contenidoOriginal = document.body.innerHTML;

    document.body.innerHTML = contenido;

    var div = document.querySelector('div'); 
    div.style.backgroundColor = 'white'; 
    div.style.color = 'black'; 
    div.style.border = '1px solid white';
    div.style.width = '100vw'; 
    div.style.height = '100vh';
    
    window.print();
    wind_pag('/Mapa')
}

document.getElementById('reporte').addEventListener('click', function(){
    let data = {
        tipo_c: 'general',
        year: 2022,
        id: id_municipio,
        modo: 'impresion' //if(data.modo != "impresion")
    }
    enviar_json(data)
    .then(dataRespuesta => {
        let cosultaDB = dataRespuesta["consulta"];
    });


    window.open("/pdf","_blank")
})