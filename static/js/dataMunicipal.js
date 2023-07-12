//VARIABLES
var data;
        // Obtener el valor del parámetro 'contenido' de la URL
var contenido = obtenerParametroURL('contenido');
// var auxYear;
// var auxDatos;
// auxDatos = Object.values(data.edad);
// auxYear = Object.keys(data.edad);

document.addEventListener('DOMContentLoaded', function() {
  fetch('/consultas-pagina', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ dato: contenido })
  })
    .then(response => response.json())
    .then(result => {
      data = result; // Asignar los datos a la variable global
      console.log('Datos: ', data); 

      insertarDatos();
      //REZAGO SOCIAL
      graficaBa('GReSo',etiquetas_graficas.vivienda, Object.keys(data.vivienda), Object.values(data.vivienda));      
      graficaBa('GEd',etiquetas_graficas.educacion, Object.keys(data.educacion), Object.values(data.educacion)); 
      //ECONOMIA
        //Barras
      graficaBa('GEco2',etiquetas_graficas.economia, Object.keys(data.deuda), Object.values(data.deuda)); 
      //POBLACION
        //Barras
      graficaBa('GEdad',etiquetas_graficas.indices, Object.keys(data.edad), Object.values(data.edad)); 
      graficaBa('GLenI',etiquetas_graficas.indigena, Object.keys(data.lengua), Object.values(data.lengua)); 
      graficaBa('GDisc',etiquetas_graficas.disc, Object.keys(data.disc), Object.values(data.disc));
      //POBREZA
      graficaBa('GPobr',etiquetas_graficas.pobre, cadenas.c_pobrezaYEAR, cadenas.c_pobreza); 
      
    })
    .catch(error => {
      console.error('Error al realizar la consulta:', error);
    });
});

document.getElementById('imagenM').href =  '/static/img_mun/'+contenido+'.png';
document.getElementById('imagenMunicipio22').src =  '/static/img_mun/'+contenido+'.png';

// Función para obtener parámetro de la URL
function obtenerParametroURL(nombreParametro) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nombreParametro);
}

function autoScroll(sectionId) {
    const section = document.getElementById(sectionId);
    const sectionPosition = section.offsetTop;
    window.scrollTo({
        top: sectionPosition+310,
        behavior: 'smooth'
    });
}

function insertarDatos(){
    document.getElementById('tituloM').innerText = data.nombre[0];
    document.getElementById('nommbreMun').innerText = data.nombre[0];
}

function graficaBa(seccionID, etiquetas, etiquetasDatasets, datos) {
  const GraficoB = document.getElementById(seccionID);

  const colores = ["#005794", "#0083A2", "#00AFAA", "#2784BE","#4E66CC", "#8475D9",  "#C59CE5", "#F0C4F0", "#FAEBF3"];
  
  const datasets = datos.map((dataset, index) => ({
    label: etiquetasDatasets[index],
    data: dataset,
    backgroundColor: colores[index],
    borderWidth: 1
  }));
  
  new Chart(GraficoB, {
    type: 'bar',
    data: {
      labels: etiquetas,
      datasets: datasets
    },
    options: {
      indexAxis: 'y',
      scales: {
        y: {
          beginAtZero: true
        }
      },
      responsive: true,
    }
  });
}