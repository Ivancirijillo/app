let map = L.map('map').setView([19.350,-99.574],9) //Punto incial de visualizacion del mapa

//Agregar tilelAyer mapa base desde openstreetmap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  minZoom: 6, //Minimo de zoom
  maxZoom: 11, //Maximo de zoom
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//Limitar los rangos de longitud y latitud en el API
map.on('mousemove', function(e){
  var long = e.latlng.lng, latt = e.latlng.lat
  //Si sobrepasa los valores regresara al punto central del mapa de estos mismos rangos
  if (latt >= 33.00 || latt <= 13.00 || long <= -118.00 || long >= -85.00) map.flyTo([23.00, -101.00], 6)
})

var info = L.control();

// Crear un div con una clase info
info.onAdd = function(map){
  this._div = L.DomUtil.create('div','info');
  this.update();
  return this._div;
};

// Agregar el metodo que actualiza el control segun el puntero vaya pasando
var clave = "0", municipio = " ";
info.update = function(props){
  this._div.innerHTML = '<h4>Información del Municipio</h4>' + 
                          (props ? '<b>' + municipio + '</b><br/>Clave: ' + clave + '</sup>'
                          : 'Pase el puntero por un municipio');
};
info.addTo(map);

var btnRegresarM = L.control();
btnRegresarM.onAdd = function(map){
  this._button = L.DomUtil.create('button','btnRegresar');
  this.update();
  return this._button;
};

// Agregar el metodo que actualiza el control segun el puntero vaya pasando
btnRegresarM.update = function(props){
  this._button.innerHTML = '<button class="botonvolver" id="botonvolver">Volver</button>' 
};

// Crear la funcion para mostrar la simbologia de acuerdo al campo
function style(feature){
  return {
    fillColor: '#1B998B',
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.45
  };
}

// AGregar interaccion del puntero con la capa para resaltar el objeto
function highlightFeature(e) {
  var layer = e.target;
  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.8
  });
  info.update(layer.feature.properties);
}

// Configurar los cambios de resaltado y zoom de la capa
var mexicoJS;
function resetHighlight(e){
  mexicoJS.resetStyle(e.target);
  info.update();
}

function zoomToFeature(e){
  map.fitBounds(e.target.getBounds());
}

const subTarjetas = document.querySelectorAll('#subtarjeta'),
      tarjeta = document.getElementById('tarjeta');
function explandirTarjeta(){
  tarjeta.classList.add('tarjeta-seg')

  cambioTarjeta(1) //Muestra la primera tarjeta - Filtrado - Municipio

  restausarClases(ulAnio) //Vuelve a las clases que originalmente fueron colocados
  restausarClases(ulCategoria) //para no tener opciones marcadas en caso de haber puesto alguno

  divAnio.querySelector('p').textContent = textListaPAnio; //Revierte el texto para dar seleccion de estas opciones en Año
  divAnio.classList.remove('contenido-lista-seg')
  divCategoria.querySelector('p').textContent = textListaPCategoria; //Revierte el texto para dar seleccion de estas opciones en Categoria
  divCategoria.classList.remove('contenido-lista-seg')
}

/**
 * Cambiar de tarjeta a vizualizar: 0.Titulo inicial 1.Filtro Municipio 2.Tablas 3. Titulo Seccion 4.Filtro Seccion 
 * @param {Number} pos Posicion de la tarjeta a mostrar
 */
function cambioTarjeta(pos){
  subTarjetas[0].style.display = 'none';
  subTarjetas.forEach(element => {
    element.classList.remove('seg-tarjeta')
  })

  subTarjetas[pos].classList.add('seg-tarjeta')
}

var layerX = ' '
var id_municipio;
var num;
var dbl_clic = false

/**
 * Marcar el Layer que se esta utilizando para ser manipulado, en este se obtiene la informacion del layer para hacer su correcto
 * filtrado dependiendo del identificador
 * @param {Element} e Elemento de la capa seleccionada
 */
function selectLayer(e){
  var layer = e.target;
  id_municipio = layer.feature.properties.CVEGEO
  clave = id_municipio;
  municipio = layer.feature.properties.NOM_MUN

  restausarClases(ulAnio)
  restausarClases(ulCategoria)

  var recorteM = id_municipio.slice(2,5)
  num = parseInt(recorteM);

  if(num > 24 && num < 122) {
    num++
    if(num == 122) num = 25
  }
  
  zoomToFeature(e);
  if(layerX != ' ') resetHighlight(layerX);
  highlightFeature(e)
  explandirTarjeta()

  if(dbl_clic == true && layerX == e.target){
    map.removeLayer(mexicoJS);
    btnRegresarM.addTo(map);

    const botonvolver = document.getElementById('botonvolver')
    botonvolver.addEventListener('click', function (){
      explandirTarjeta()

      //Las capas son rempalazadas por las de municipios
      map.removeControl(btnRegresarM);
      map.removeLayer(Seccionesjs);
      mexicoJS = L.geoJson(mexico,{
        style: style,
        onEachFeature: onEachFeature
      }).addTo(map);
    });

    cambioTarjeta(3) // Cambia de tarjeta de Titulo al de Seccion

    //Las capas son rempalazadas por las de secciones
    Seccionesjs = L.geoJson(Secciones_MEX,{
      style: styleSec,
      onEachFeature: cadaCaracteristica 
    }).addTo(map);
  }
  dbl_clic = true
  
  layerX = e.target;
}

/**
 * Aplicar un recorrido de las capas de los municipios y tomar en cuenta al que se le haya dado click
 * @param {*} feature 
 * @param {*} layer 
 */
function onEachFeature(feature, layer){
  layer.on({
    click: selectLayer
  });
}

// Agregar capa en formato GeoJson
mexicoJS = L.geoJson(mexico,{
  style: style,
  onEachFeature: onEachFeature
}).addTo(map);

function enviarDatos() {
  window.location.href = '/DatosMunicipio?contenido=' + id_municipio;
  // window.open('http://127.0.0.1:8000/DatosMunicipio?contenido=' + id_municipio);
}

//Area de secciones 
function getColor(d) {
  let recorte = d.slice(5,8)
  return recorte == num ? 'blue':
                    '#ffffff00';
}

// Funcion para mostrar la simbologia de acuerdo con el atributo 
function styleSec(feature) {
  return {
      fillColor: getColor(feature.properties.CLAVEGEO),
      weight: 1,
      opacity: 1,
      color: 'red',
      dashArray: '',
      fillOpacity: 0.3
  };
}

var id_seccion;
function selectFeature(e){
  var layer = e.target;
  id_seccion = layer.feature.properties.CLAVEGEO
  id_seccion = id_seccion.slice(8,13)
  clave = id_seccion;
  console.log(id_seccion)
  cambioTarjeta(4)
  highlightFeature(e)
}

var Seccionesjs;

function cadaCaracteristica(features, layer){
  layer.on(
    {
      click: selectFeature
    }
  );
}