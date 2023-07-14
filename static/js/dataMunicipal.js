//VARIABLES
var data;
  // Obtener el valor del parámetro 'contenido' de la URL
var contenido = obtenerParametroURL('contenido');

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

      //console.log('Datos: ', data["sexo"][Object.keys(data.sexo)[Object.keys(data.sexo).length - 1]]);

      insertarDatos();
      //REZAGO SOCIAL
      graficaBa('GReSo',etiquetas_graficas.vivienda, Object.keys(data.vivienda), Object.values(data.vivienda));      
      graficaBa('GEd',etiquetas_graficas.educacion, Object.keys(data.educacion), Object.values(data.educacion)); 
      //ECONOMIA
        //Barras
      graficaBa('GEco2',etiquetas_graficas.economia, Object.keys(data.deuda), Object.values(data.deuda)); 
        //lineal
      graficaLi('GEco', 'Producto Interno Bruto', Object.values(data.pib).flat(), Object.keys(data.pib)); 
      //POBLACION
        //Barras
      graficaBa('GEdad',etiquetas_graficas.indices, Object.keys(data.edad), Object.values(data.edad)); 
      graficaBa('GLenI',etiquetas_graficas.indigena, Object.keys(data.lengua), Object.values(data.lengua)); 
      graficaBa('GDisc',etiquetas_graficas.disc, Object.keys(data.disc), Object.values(data.disc));
        //Pastel
      graficaPA('GGene',etiquetas_graficas.genero, 'Población', (data["sexo"][Object.keys(data.sexo)[Object.keys(data.sexo).length - 1]])); 
        seleccion("opcionPob", "sexo", "contenedorPastel1", "GGene", "genero", "Población")
      graficaPA('GLoc',etiquetas_graficas.loc, 'Población', (data["loc"][Object.keys(data.loc)[Object.keys(data.loc).length - 1]])); 
        seleccion("opcionLoc", "loc", "contenedorPastel2", "GLoc", "loc", "Población")
      graficaPA('GAfil',etiquetas_graficas.afil, 'Afiliados totales a sistemas de seguridad social', (data["afil"][Object.keys(data.afil)[Object.keys(data.afil).length - 1]])); 
        seleccion("opcionAfil", "afil", "contenedorPastel3", "GAfil", "afil", "Afiliados totales a sistemas de seguridad social")
      graficaPA('GAli',etiquetas_graficas.hogares, 'Hogares', (data["alim"][Object.keys(data.alim)[Object.keys(data.alim).length - 1]])); 
        seleccion("opcionAlim", "alim", "contenedorPastel4", "GAli", "hogares", "Hogares")
      //POBREZA
      graficaBa('GPobr',etiquetas_graficas.pobre, Object.keys(data.tpobreza), Object.values(data.tpobreza)); 
      //EMPLEO
      //graficaBa('GEmp',etiquetas_graficas.empl, Object.keys(data.empleo), Object.values(data.empleo)); 
      //DELINCUENCIA
      graficaBa('GDeli',etiquetas_graficas.delitos, Object.keys(data.deli), Object.values(data.deli)); 
      //PADRON ELECTORAL
      graficaPA2('GPaE',etiquetas_graficas.padron,  (data["padron"][Object.keys(data.padron)[Object.keys(data.padron).length - 1]])); 
        seleccion("opcionPadron", "padron", "contenedorP", "GPaE", "padron", "")
      
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

function graficaLi (seccionID, etiqueta, datos, etiquetas ) {
  var GraficaLineal = document.getElementById(seccionID);

  var PIBanual = {
    label: etiqueta,
    data: datos,
    lineTension: 0,
    fill: false,
    borderColor: 'red'
  };

  var ConteoAnual = {
    labels: etiquetas,
    datasets: [PIBanual]
  };

  var chartOptions = {
    legend: {
      display: true,
      position: 'top',
      labels: {
        boxWidth: 80,
        fontColor: 'black'
      }
    }
};

new Chart(GraficaLineal, {
  type: 'line',
  data: ConteoAnual,
  options: chartOptions
});

}

function graficaPA(seccionID, etiquetas, etiqueta, datos) {
  const GraficoP = document.getElementById(seccionID);
  var datosPastel = {
    labels: etiquetas,
    datasets: [
        {
            data: datos,
            borderWidth: 0,
            backgroundColor: [
              "#28A1E9",
              "#FFD41F",
              "#FE1F2A",
              "#32F41E",
              "#FF9A1F",
              "#E41EEB",
              "#00C65C",
              "#F21DA8",
              "#0A9292",
              "#F91E68"
            ]
        }]
};

  new Chart(GraficoP, {
    type: 'pie',
    data: datosPastel,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          onHover: handleHover,
          onLeave: handleLeave
        },
        title: {
          display: true,
          text: etiqueta
        }
      }
    },
  });

}

function graficaPA2(seccionID, etiquetas, datos) {
  const GraficoP2 = document.getElementById(seccionID);

  const data = {
    labels: etiquetas,
    datasets: [ 
      {
        backgroundColor: ["#28A1E9", "#FFD41F" ],
        borderWidth: 0,
        data: [datos[0], datos[1]]
      },
      {
        backgroundColor: ["#FE1F2A", "#FF9A1F"],
        borderWidth: 0,
        data: [datos[2], datos[3]]
      }
    ]
  };

  new Chart(GraficoP2, {
    type: 'pie',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            generateLabels: function(chart) {
              // Get the default label list
              const original = Chart.overrides.pie.plugins.legend.labels.generateLabels;
              const labelsOriginal = original.call(this, chart);
  
              // Build an array of colors used in the datasets of the chart
              let datasetColors = chart.data.datasets.map(function(e) {
                return e.backgroundColor;
              });
              datasetColors = datasetColors.flat();
  
              // Modify the color and hide state of each label
              labelsOriginal.forEach(label => {
                // There are twice as many labels as there are datasets. This converts the label index into the corresponding dataset index
                label.datasetIndex = (label.index - label.index % 2) / 2;
  
                // The hidden state must match the dataset's hidden state
                label.hidden = !chart.isDatasetVisible(label.datasetIndex);
  
                // Change the color to match the dataset
                label.fillStyle = datasetColors[label.index];
              });
  
              return labelsOriginal;
            }
          },
          onClick: function(mouseEvent, legendItem, legend) {
            // toggle the visibility of the dataset from what it currently is
            legend.chart.getDatasetMeta(
              legendItem.datasetIndex
            ).hidden = legend.chart.isDatasetVisible(legendItem.datasetIndex);
            legend.chart.update();
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const labelIndex = (context.datasetIndex * 2) + context.dataIndex;
              return context.chart.data.labels[labelIndex] + ': ' + context.formattedValue;
            }
          }
        }
      }
    },
  });

}  

function handleHover(evt, item, legend) {
  legend.chart.data.datasets[0].backgroundColor.forEach((color, index, colors) => {
    colors[index] = index === item.index || color.length === 9 ? color : color + '4D';
  });
  legend.chart.update();
}

function handleLeave(evt, item, legend) {
  legend.chart.data.datasets[0].backgroundColor.forEach((color, index, colors) => {
    colors[index] = color.length === 9 ? color.slice(0, -2) : color;
  });
  legend.chart.update();
}

function seleccion(seccionID, datosID, contenedorID, graficaID, cadenaID, leyenda){
  var select = document.getElementById(seccionID);
  //select.innerHTML = '<option disabled selected>Elije una opción</option>';
  for (let key in data[datosID]) {    
    // Crear una nueva opción
    var option = document.createElement("option");    
    // Establecer el valor y el texto de la opción
    option.value = key;
    option.text = key;    
    // Agregar la opción al select
    select.add(option);
  }

  // Variable para guardar la opción seleccionada
  var opcionSeleccionada;
  // Evento para detectar el cambio de selección
  select.addEventListener("change", function() {
    // Obtener la opción seleccionada
    opcionSeleccionada = select.value;
    console.log(opcionSeleccionada);  
    var contenedor = document.getElementById(contenedorID);
    contenedor.innerHTML = '<canvas class="GraficosPastel" id="'+graficaID+'"></canvas>'; // limpiar el contenedor
    if (datosID=="padron"){
      graficaPA2(graficaID,etiquetas_graficas[cadenaID], data[datosID][opcionSeleccionada]); 
    }
    else{
      graficaPA(graficaID ,etiquetas_graficas[cadenaID], leyenda, data[datosID][opcionSeleccionada]); 
    }    

  }); 
}
