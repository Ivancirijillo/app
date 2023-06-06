/* HEADER */
function wind_pag(ventana){
    window.location.href = ventana;
}

const btnMenu = document.getElementById('regresar-menu');
btnMenu.addEventListener('click', function (){
    wind_pag('/')
});

/* MAIN */

/* SUBTARJETA lISTAS */
const divAnio = document.getElementById('contenido-anio'),
      divCategoria = document.getElementById('contenido-categoria'),
      ulAnio = document.getElementById('opciones-ul-anio'),
      ulCategoria = document.getElementById('opciones-ul-categoria'),
      textListaPAnio = divAnio.querySelector('p').textContent,
      textListaPCategoria = divCategoria.querySelector('p').textContent;

function restausarClases(elem_cont){
    elem_cont.classList.add('ul-prim')
    elem_cont.classList.remove('ul-seg')
}

var click_divAnio = false, click_divCategoria = false;

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
    console.log(opciones)

    if(textSelec != ' '){
        divActivo.querySelector('p').textContent = textSelec;
        divActivo.classList.add('contenido-lista-seg')
    }else if(contador == 0){
        divActivo.querySelector('p').textContent = textOrigin;
        divActivo.classList.remove('contenido-lista-seg')
    }
    return opciones
}

divAnio.addEventListener('click', function(){
    restausarClases(ulCategoria)
    ulAnio.classList.toggle('ul-prim')
    ulAnio.classList.toggle('ul-seg')
})

divCategoria.addEventListener('click', function(){
    restausarClases(ulAnio)
    ulCategoria.classList.toggle('ul-prim')
    ulCategoria.classList.toggle('ul-seg')
})

var anio = [], categoria = ' ';
ulAnio.addEventListener('click', (e) => {
    if(e.target && e.target.tagName === 'LI'){
        e.target.classList.toggle('li-seg');
    }
    anio = opcSeleccionado(divAnio, ulAnio, textListaPAnio)
})

ulCategoria.addEventListener('click', (e) => {
    if(e.target && e.target.tagName === 'LI'){
        e.target.classList.toggle('li-seg');
    }
    categoria = opcSeleccionado(divCategoria, ulCategoria, textListaPCategoria)
})

/* SUBTARJETA TABLA */
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
            if(i==8) i = tablas.length
        }
    }
    if(tablas.length == 0) template = '<tr><td><h2> Datos inexistentes </h2></td></tr>';
    return template;
}

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

function cambiarTarjeta(){
    subTarjetas[1].classList.toggle('seg-tarjeta')
    subTarjetas[2].classList.toggle('seg-tarjeta')
}

const btnContinuar = document.getElementById('continuar'),
      tabla = document.getElementById('tabla')
      ventanaEmergente = document.getElementById('v-emergen')
btnContinuar.addEventListener('click', function (){
    var cabecera_consul_A = new Array ("NombreA", "NoApoyo", " ");
    var cabecera_consul_D = new Array ("DelitosAI", "Homicidios", "Feminicidios", "Secuestros", 
                                        "DespT", "Robo", "RoboT", "V");
    var cabecera_consul_Pa = new Array ("PHombres", "PMujeres", "PTotal", "LNHombres", 
                                        "LNMujeres", "LNTotal", "V");
    var cabecera_consul_Po = new Array ("Pobreza", "PobExt", "PobMod", "RezagoEd", 
                                        "CarSS", "CarCalidadViv", "CarAlim", "PIB", "UET", "V");
    const fil_cabecera = {
        'Apoyos': cabecera_consul_A,
        'Delincuencia': cabecera_consul_D,
        'Padrón Electoral': cabecera_consul_Pa,
        'Pobreza': cabecera_consul_Po
    }

    const elementos = new Array(anio.length);
    
    if(anio.length != 0 && categoria.length != 0){
        for (let valorAnio of anio){

            elementos[anio.indexOf(valorAnio)] = new Array(categoria.length+1);
            elementos[anio.indexOf(valorAnio)][0] = '<p class="pAnio">'+valorAnio+'</p>';

            for (let valorCategoria of categoria){

                elementos[anio.indexOf(valorAnio)][categoria.indexOf(valorCategoria)+1] = '<p>'+valorCategoria+'</p>';
                let data = {
                    tipo_c: valorCategoria,
                    year: valorAnio,
                    id: id_municipio,
                    modo: ' ' //if(data.modo != "impresion")
                }
                enviar_json(data)
                .then(dataRespuesta => {
                    let cosultaDB = dataRespuesta["consulta"];
                    elementos[anio.indexOf(valorAnio)][categoria.indexOf(valorCategoria)+1] += '<table>'+tabla_crear(cosultaDB, fil_cabecera[valorCategoria])+'</table>';
                });
            }
        }
        
        setTimeout(() => {
            tabla.innerHTML = ' '
            for(let i = 0; i < elementos.length; i++){
                for(let j = 0; j < elementos[i].length; j++){
                    tabla.innerHTML += elementos[i][j]
                }
            }
        }, 500);

        cambiarTarjeta()
    }else{
        ventanaEmergente.classList.toggle('v-emergen');
        ventanaEmergente.classList.toggle('v-emergen_validado_R');
        setTimeout(() => {
            ventanaEmergente.classList.toggle('v-emergen_validado_R');
            ventanaEmergente.classList.toggle('v-emergen');
        }, 3000);
    }
});

const btnVolver = document.getElementById('volver')
btnVolver.addEventListener('click', function (){
    cambiarTarjeta()
    restausarClases(ulAnio)
    restausarClases(ulCategoria)
});
