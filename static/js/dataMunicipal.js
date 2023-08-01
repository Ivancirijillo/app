//VARIABLES Archivo: "variables.js"
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
      //APOYOS
      generarTabla(Object.values(data.apoyos).flat());
        cambiarT("opcionApo", "apoYears", "GApo")
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
      graficaBa('GEmp',etiquetas_graficas.empl, Object.keys(data.empleo), Object.values(data.empleo)); 
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
        // top: sectionPosition+310,
        top: sectionPosition,
        behavior: 'smooth'
    });
}

function insertarDatos(){
    //Titulo
    document.getElementById('tituloM').innerText = data.nombre[0];
    document.getElementById('nommbreMun').innerText = data.nombre[0];
    document.getElementById('tituloPoblacion').innerText = agregarComas(data.datoPob[1]);  
    document.getElementById('tituloPoblacionA').innerText = data.datoPob[0];  
    document.getElementById('tituloEdad').innerText = data.datoPob[2];   
    document.getElementById('tituloEdadA').innerText = data.datoPob[0];  
    document.getElementById('tituloPobreza').innerText = (Math.floor(data.datoPobre[1])) + ' %';  
    document.getElementById('tituloPobrezaA').innerText = data.datoPobre[0];  
    document.getElementById('tituloPIB').innerText = '$' + agregarComas(data.datoEco[1]);   
    document.getElementById('tituloPIBA').innerText = data.datoEco[0];  
    document.getElementById('tituloUE').innerText = agregarComas(data.datoEco[3]);  
    document.getElementById('tituloUEA').innerText = data.datoEco[0];  
    document.getElementById('tituloSalario').innerText = '$' +  agregarComas(data.datoEmp[1]); 
    document.getElementById('tituloSalarioA').innerText = data.datoEmp[0]; 
    //Rezago Social
    document.getElementById('reYear').innerText = data.datoRe[0];
    document.getElementById('indiceRe').innerText = data.datoRe[1];
    document.getElementById('gradoRe').innerText = data.datoRe[2];
    document.getElementById('posicionRe').innerText = 'N° ' + agregarComas(data.datoRe[3]);
    document.getElementById('sinSalud').innerText = agregarComas(data.datoRe[4]);
    document.getElementById('gini').innerText = data.datoRe[5];
    document.getElementById('razonI').innerText = data.datoRe[6];
    //Economia
    document.getElementById('economiaYear').innerText = data.datoEco[0]; 
    document.getElementById('etiquetaPib').innerText = '$' +  agregarComas(data.datoEco[1]);
    document.getElementById('etiquetaPer').innerText = '$' +  agregarComas(data.datoEco[2]);
    //Poblacion
    document.getElementById('pobYear').innerText = data.datoPob[0];  
    document.getElementById('etquetaAfil').innerText = agregarComas(data.datoPob[3]);
    document.getElementById('etiquetaAli').innerText = agregarComas(data.datoPob[4]);
    document.getElementById('parrafoPob').innerText = "La población total de " + data.nombre[0] + " en " + data.datoPob[0] +" fue de " + agregarComas(data.datoPob[1]) + " habitantes, siendo " + ((100*(data.datoPob[5]))/(data.datoPob[1])).toFixed(2) + "% mujeres y " + ((100*(data.datoPob[6]))/(data.datoPob[1])).toFixed(2) + "% hombres." ;
    document.getElementById('parrafoAfil').innerText = "Se considera que una persona se encuentra en situación de carencia por acceso a los servicios de salud cuando no cuenta con adscripción o derecho a recibir servicios médicos de alguna institución que los presta. En este sentido, dentro del municipio, existe una población de " + agregarComas(data.datoPob[7]) + " personas que no están afiliadas a ninguna de estas instituciones, mientras que hay " + agregarComas(data.datoPob[3]) + " personas que sí están afiliadas.";
    document.getElementById('parrafoAlimentacion').innerText = "En el año " + data.datoPob[0] + ", los hogares con limitación alimentaria representaron el " + data.datoPob[8] + " % de total, mientras que los hogares sin esta limitación representaron el " + data.datoPob[9] + " % restante.";
    //Pobreza
    document.getElementById('poYear').innerText = data.datoPobre[0];  
    //Empleo
    document.getElementById('emYear').innerText = data.datoEmp[0];
    document.getElementById('etiquetaTota').innerText = agregarComas(data.datoEmp[2]);
    document.getElementById('etiquetaSa').innerText = '$' +  agregarComas(data.datoEmp[1]);
    //Padron Electoral
    document.getElementById('paeleYear').innerText = data.datoPa[0];
    document.getElementById('etiquetaP').innerText =agregarComas(data.datoPa[1]);
    document.getElementById('etiquetaLista').innerText =agregarComas(data.datoPa[2]);
  
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
      indexAxis: 'x',
      scales: {
        y: {
          beginAtZero: true
        }
      },
      interaction: {
        intersect: true,
        mode: 'index',
      },
      plugins: {
        subtitle: {
          display: true,
          text: 'Dar clic sobre el año para deseleccionar o seleccionar',
          color: '#00817d',
        },
        
        tooltip: {
          enabled: false,
          external: externalTooltipHandler
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
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      tooltip: {
        enabled: false,
        external: externalTooltipHandler
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

function cambiarT(seccionID, datosID, contenedorID){
  var select = document.getElementById(seccionID);
  //select.innerHTML = '<option disabled selected>Selecciona una opción</option>';
  for (let key in data[datosID]) {    
    // Crear una nueva opción
    var option = document.createElement("option");    
    // Establecer el valor y el texto de la opción
    option.value = data[datosID][key];
    option.text = data[datosID][key];    
    // Agregar la opción al select
    select.add(option);
  }

  // Variable para guardar la opción seleccionada
  var opcionSeleccionada;
  // Evento para detectar el cambio de selección
  select.addEventListener("change", async function() {
    // Obtener la opción seleccionada
    opcionSeleccionada = select.value;
    console.log(opcionSeleccionada);  
    var aux = [contenido, opcionSeleccionada];
  try {
      const resultado = await consultaT(aux);
      console.log('Tablas: ', resultado); 
    
      var contenedor = document.getElementById(contenedorID);
      contenedor.innerHTML = ''; // limpiar el contenedor
      generarTabla(Object.values(resultado).flat());
  } catch (error) {
      console.error('Error:', error);
  }
  

  }); 
}

function agregarComas(numero) {
  return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function generarTabla(CadenaA) {
  // Obtener el contenedor de la tabla
  var tablaContainer = document.getElementById("GApo");
  // Crear la tabla
  var tabla = document.createElement("table");
  tabla.classList.add("table");
  // Crear la fila de encabezado
  var encabezado = document.createElement("tr");
  // Crear las celdas de encabezado
  var encabezadoCelda1 = document.createElement("th");
  encabezadoCelda1.textContent = "Nombre del Apoyo";
  encabezado.appendChild(encabezadoCelda1);
  var encabezadoCelda2 = document.createElement("th");
  encabezadoCelda2.textContent = "Periodo";
  encabezado.appendChild(encabezadoCelda2);
  var encabezadoCelda3 = document.createElement("th");
  encabezadoCelda3.textContent = "No. apoyos";
  encabezado.appendChild(encabezadoCelda3);
  var encabezadoCelda4 = document.createElement("th");
  encabezadoCelda4.textContent = "Tipo";
  encabezado.appendChild(encabezadoCelda4);
  
  // Agregar el encabezado a la tabla
  tabla.appendChild(encabezado);
  
  // Crear las filas de datos
  for (var i = 0; i < CadenaA.length; i+=6) {
    var fila = document.createElement("tr");
    
    var datoCelda1 = document.createElement("td");
    datoCelda1.textContent = CadenaA[i+3];
    fila.appendChild(datoCelda1);
    
    var datoCelda2 = document.createElement("td");
    datoCelda2.textContent = CadenaA[i+2];
    fila.appendChild(datoCelda2);
    
    var datoCelda3 = document.createElement("td");
    datoCelda3.textContent = CadenaA[i+4];
    fila.appendChild(datoCelda3);
    
    var datoCelda4 = document.createElement("td");
    var tipo =CadenaA[i+5]
    if (tipo=="0"){
      tipo="No definido"
    }
    datoCelda4.textContent = tipo;
    fila.appendChild(datoCelda4);
    
    // Agregar la fila a la tabla
    tabla.appendChild(fila);
  }
  
  // Agregar la tabla al contenedor
  tablaContainer.appendChild(tabla);
}

function consultaT(dato) {
  return new Promise((resolve, reject) => {
      fetch('/consultas-tabla', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ dato: dato })
      })
      .then(response => response.json())
      .then(data => resolve(data.resultado))
      .catch(error => reject(error));
  });
}


/// configuracion para el tooltip

const getOrCreateTooltip = (chart) => {
  let tooltipEl = chart.canvas.parentNode.querySelector('div');

  // Estilos del tooltip
  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.style.fontSize = '13px';
    tooltipEl.style.background = 'rgba(0, 0, 0,0.7)';
    tooltipEl.style.borderRadius = '10px';
    tooltipEl.style.color = 'white';
    tooltipEl.style.opacity = 1;
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.transform = 'translate(-50%, 0)';
    tooltipEl.style.transition = 'all .1s ease';

    const table = document.createElement('table');
    table.style.margin = '0px';

    tooltipEl.appendChild(table);
    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  return tooltipEl;
};


const externalTooltipHandler = (context) => {
  // Tooltip Element
  const {chart, tooltip} = context;
  const tooltipEl = getOrCreateTooltip(chart);

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  

  // Set Text
  if (tooltip.body) {
    const titleLines = tooltip.title || [];
    const bodyLines = tooltip.body.map(b => b.lines);

    const tableHead = document.createElement('thead');

    titleLines.forEach(title => {
      const tr = document.createElement('tr');
      tr.style.borderWidth = 0;

      const th = document.createElement('th');
      th.style.borderWidth = 0;
      th.style.backgroundColor = '#00afaa';
      const text = document.createTextNode(title);

      th.appendChild(text);
      tr.appendChild(th);
      tableHead.appendChild(tr);
    });

    const tableBody = document.createElement('tbody');
    bodyLines.forEach((body, i) => {
      const colors = tooltip.labelColors[i];

      const span = document.createElement('span');
      span.style.background = colors.backgroundColor;
      span.style.borderColor = colors.borderColor;
      span.style.borderWidth = '1px';
      span.style.marginRight = '10px';
      span.style.height = '8px';
      span.style.width = '10px';
      span.style.display = 'inline-block';

      const tr = document.createElement('tr');
      tr.style.color = "#000";
      tr.style.backgroundColor = '#fff';
      tr.style.borderWidth = 0;

      const td = document.createElement('td');
      td.style.borderWidth = 0;

      const text = document.createTextNode(body);

      td.appendChild(span);
      td.appendChild(text);
      tr.appendChild(td);
      tableBody.appendChild(tr);
    });

    const tableRoot = tooltipEl.querySelector('table');

    // Remove old children
    while (tableRoot.firstChild) {
      tableRoot.firstChild.remove();
    }

    // Add new children
    tableRoot.appendChild(tableHead);
    tableRoot.appendChild(tableBody);
  }

  const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = positionX + tooltip.caretX + 'px';
  tooltipEl.style.top = positionY + tooltip.caretY + 'px';
};



// // Antualizacion de pagina en cada redimencion de pantalla

// let windowWidth = window.innerWidth;
// let windowHeight = window.innerHeight;

// // Función para verificar si las dimensiones de la ventana han cambiado
// function checkWindowDimensions() {
//   const newWindowWidth = window.innerWidth;
//   const newWindowHeight = window.innerHeight;

//   if (newWindowWidth !== windowWidth || newWindowHeight !== windowHeight) {
//     windowWidth = newWindowWidth;
//     windowHeight = newWindowHeight;
//     location.reload();
//   }
// }

// // Función para iniciar la verificación periódica
// function startAutoRefresh() {
//   setInterval(checkWindowDimensions, 500); // Verificar cada 500 milisegundos (ajustable según tus necesidades)
// }

// // Llamar a la función para iniciar la verificación periódica
// startAutoRefresh();

// OCULTAR MENÚ DE HAMBURGUESA

document.addEventListener('DOMContentLoaded', function() {
  const checkbox = document.getElementById('check');

  // Función para ocultar el menú cuando se hace clic en un elemento <li>
  function ocultarMenu() {
    checkbox.checked = false; // Desmarca el checkbox para ocultar el menú
  }

  // Agregar evento de clic a los elementos <li>
  const liElements = document.querySelectorAll('ul li');
  liElements.forEach(function(li) {
    li.addEventListener('click', function() {
      ocultarMenu();
    });
  });

  // Agregar evento de clic al label para ocultar el menú
  const label = document.querySelector('label[for="check"]');
  label.addEventListener('click', function() {
    ocultarMenu();
  });
});