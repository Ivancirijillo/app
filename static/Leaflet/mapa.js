let map = L.map('map').setView([19.350,-99.574],9)

//Agregar tilelAyer mapa base desde openstreetmap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  minZoom: 6,
  maxZoom: 11,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

map.on('mousemove', function(e){
  var long = e.latlng.lng, latt = e.latlng.lat
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
info.update = function(props){
  this._div.innerHTML = '<h4>Información del Municipio</h4>' + 
                          (props ? '<b>' + props.NOM_MUN + '</b><br/>Clave: ' + props.CVEGEO + '</sup>'
                          : 'Pase el puntero por un municipio');
};
info.addTo(map);

// Crear la funcion para mostrar la simbologia de acuerdo al campo TOT_VIVIEN
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
  subTarjetas[0].style.display = 'none';
  subTarjetas[1].classList.add('seg-tarjeta')
  subTarjetas[2].classList.remove('seg-tarjeta')
  restausarClases(ulAnio)
  restausarClases(ulCategoria)
  divAnio.querySelector('p').textContent = textListaPAnio;
  divAnio.classList.remove('contenido-lista-seg')
  divCategoria.querySelector('p').textContent = textListaPCategoria;
  divCategoria.classList.remove('contenido-lista-seg')
}

var layerX = ' '
var id_municipio;
function selectLayer(e){
  var layer = e.target;
  
  zoomToFeature(e);
  if(layerX != ' ') resetHighlight(layerX);
  highlightFeature(e)
  explandirTarjeta()
  
  id_municipio = layer.feature.properties.CVEGEO
  layerX = e.target;
}

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
}