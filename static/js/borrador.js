let etiquetas_graficas = {
  vivienda:   ['Piso de tierra', 'No disponen de excusado o sanitario', 'No disponen de agua entubada de la red pública', 'No disponen de drenaje', 'No disponen de energía eléctrica', 'No disponen de lavadora', 'No disponen de refrigerador'],
  educacion:  ['15 años o más analfabeta', '6 a 14 años que no asiten a la escuela', '15 años o mas con educacion basica incompleta'],
  economia:   ['PIB', 'PBI PER Cápita', 'Unidades Economicas', 'Proporción Deuda Pública / Ingresos', 'Proporción servicio de Deuda / Ingresos', 'Obligaciones Corto Plazo / Ingresos'],
  genero:     ['Hombres', 'Mujeres'],
  indices:    ['Edad Mediana', 'Mediana Hombres', 'Mediana Mujeres', 'Relación Hombre-Mujer', 'Índice de envejecimiento total', 'Índice de envejecimiento Hombres', 'Índice de envejecimiento Mujeres', 'Razón de dependencia Total', 'Razón de dependencia Infantil', 'Razón de dependencia de Vejez'],
  indigena:   ['Población de 3 años o más', 'Población que habla lengua índigena', 'Población índigena que habla español', 'Población índigena que no habla español', 'Población que no habla lengua índigena'],
  disc:       ['Personas con discapacidad','Personas con discapacidad total', 'Personas con discapacidad parcial o limitaciones', 'Población con algún problema o condición mental', 'Población sin discapacidad, limitacion, problema o condición mental'],
  afil:       ['IMSS', 'ISSSTE', 'ISSSTE Estatal', 'Pemex, Defensa o Marina', 'INSABI', 'IMSS BIENESTAR', 'Institución privada', 'Otra afiliación', 'No afiliado'],
  loc:        ['Vive en la entidad', 'Vive en otra entidad', 'Vive en EE. UU.', 'Viven en otro país'],
  hogares:    ['Con limitación alimentaria', 'Sin limitación alimentaria', 'Hogares con limitación alimentaria', 'Hogares sin limitación alimentaria'],
  pobre:      ['Porcentaje de pobreza', 'Porcentaje de pobreza extrema' , 'Pobreza extrema carencias promedio' , 'Pobreza moderada' , 'Porcentaje de no pobre y no vulnerable' , 'Porcentaje de rezago educativo' , 'Promedio de carencia de salud' , 'Carencia Salud Carencias promedio' , 'Porcentaje carencia Seguro Social' , 'Porcentaje carencia de calidad de vivienda' , 'Porcentaje carencia de servicios de vivienda' , 'Porcentaje carencia de alimentación' , 'Porcentaje de ingreso inferior pobreza' , 'Porcentaje de ingreso inferior pobreza extrema'],
  empl:       ['Agricultura, Ganaderia, Silvicultura, Pesca y Caza', 'Comercio', 'Industria Electrica y Captación, y suministro de Agua Potable', 'Industrias de la Construccion', 'Industrias de Transformación', 'Industrias de Transformación 2', 'Industrias Extractivas', 'Servicios para Empresas, Personas y el Hogar', 'Servicios Sociales y Comunales', 'Transportes y comunicaciones'],
  delitos:    ['Delitos de alto impacto', 'Homicidios', 'Feminicidios', 'Secuestros', '>Desapariciones', 'Robos', 'Robos transporte', 'Violencia de género en todas sus modalidades', 'Violencia familiar'],
  desap:      ['Hombres', 'Mujeres'],
  padron:     ['Padrón hombres', 'Padrón mujeres', 'Lista nominal hombres', 'Lista nominal mujeres']
};

var data;
var cadenas = {
  c_general: [],
  c_viviendas: [],
  c_carencias: [],
  c_educacion: [],
  c_apoyos: [],
  c_economia: [],
  c_Pgeneral: [],
  c_edad: [],
  c_lenguaI: [],
  c_disc: [],
  c_afili: [],
  c_loc: [],
  c_alimen: [],
  c_pobreza: [],
  c_empleo: [],
  c_deli: [],
  c_deliHM: [],
  c_padron: []
}
// Obtener el valor del parámetro 'contenido' de la URL
var contenido = obtenerParametroURL('contenido');
var contenido2=23;

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
      procesarDatos(); // Llamar a la función que utiliza los datos
      insertarDatos();
      //Tabla apoyos
      generarTabla(cadenas.c_apoyos);
      // Llamar a la funcion de las grafica
      graficaRe('GReSo',etiquetas_graficas.vivienda, 'Número de viviendas', cadenas.c_viviendas ); 
      graficaRe('GEd',etiquetas_graficas.educacion, 'Población', cadenas.c_educacion ); 
      graficaRe('GEco',etiquetas_graficas.economia, '$', cadenas.c_economia ); 
      graficaPA('GGene',etiquetas_graficas.genero, 'Población', cadenas.c_Pgeneral ); 
      graficaRe('GEdad',etiquetas_graficas.indices, '', cadenas.c_edad ); 
      graficaRe('GLenI',etiquetas_graficas.indigena, '', cadenas.c_lenguaI ); 
      graficaRe('GDisc',etiquetas_graficas.disc, 'Personas con discapacidad', cadenas.c_disc ); 
      graficaPA('GAfil',etiquetas_graficas.afil, 'Afiliados totales a sistemas de seguridad social', cadenas.c_afili ); 
      //graficaRe('GAfil',etiquetas_graficas.afil, 'Afiliados totales a sistemas de seguridad social', cadenas.c_afili ); 
      graficaPA('GLoc',etiquetas_graficas.loc, 'Poblacion', cadenas.c_loc ); 
      graficaRe('GAli',etiquetas_graficas.hogares, 'Hogares', cadenas.c_alimen ); 
      graficaRe('GPobr',etiquetas_graficas.pobre, 'Porcentaje', cadenas.c_pobreza ); 
      graficaRe('GEmp',etiquetas_graficas.empl, 'No', cadenas.c_empleo ); 
      graficaRe('GDeli',etiquetas_graficas.delitos, 'No Casos', cadenas.c_deli ); 
      graficaPA('GDeliHyM',etiquetas_graficas.desap, 'Desapariciones', cadenas.c_deliHM ); 
      graficaPA2('GPaE',etiquetas_graficas.padron, 'No Ciudadanos', cadenas.c_padron ); 
    })
    .catch(error => {
      console.error('Error al realizar la consulta:', error);
    });
});

function procesarDatos() {
  //REZAGO
    //general
  cadenas.c_general.push(data.rezago[1]);
  for (let i = 15; i < 18; i++) {
    cadenas.c_general.push(data.rezago[i]);
  }
    //vivenda
  for (let i = 8; i < 15; i++) {
    cadenas.c_viviendas.push(data.rezago[i]);
  }
    //Carencias
    cadenas.c_carencias.push(data.rezago[7]);
  for (let i = 2; i < 4; i++) {
    cadenas.c_carencias.push(data.rezago[i]);
  }
    //Educacion
  for (let i = 4; i < 7; i++) {
    cadenas.c_educacion.push(data.rezago[i]);
  }
  //ECONOMIA
  for (let i = 2; i < 8; i++) {
    cadenas.c_economia.push(data.economia[i]);
  }
  //POBLACION
  for (let i = 3; i < 5; i++) {
    cadenas.c_Pgeneral.push(data.poblacion[i]);
  }
    //Edad
  for (let i = 5; i < 15; i++) {
    cadenas.c_edad.push(data.poblacion[i]);
  }
    //Lengua indigena
  for (let i = 15; i < 20; i++) {
    cadenas.c_lenguaI.push(data.poblacion[i]);
  }
  //Discapacidad
  for (let i = 20; i < 25; i++) {
    cadenas.c_disc.push(data.poblacion[i]);
  }
    //Afiliado
  for (let i = 26; i < 35; i++) {
    cadenas.c_afili.push(data.poblacion[i]);
  }
    //Localizacion
  for (let i = 35; i < 39; i++) {
    cadenas.c_loc.push(data.poblacion[i]);
  }
    //Hogares
  for (let i = 40; i < 44; i++) {
    cadenas.c_alimen.push(data.poblacion[i]);
  }
  //POBREZA
  for (let i = 2; i < 16; i++) {
    cadenas.c_pobreza.push(data.tpobreza[i]);
  }
  //EMPLEO
  for (let i = 2; i < 12; i++) {
    cadenas.c_empleo.push(data.empleo[i]);
  }
  //DELITOS
  for (let i = 2; i < 6; i++) {
    cadenas.c_deli.push(data.deli[i]);
  }
  for (let i = 8; i < 13; i++) {
    cadenas.c_deli.push(data.deli[i]);
  }
    //Desapariciones
  for (let i = 6; i < 8; i++) {
    cadenas.c_deliHM.push(data.deli[i]);
  }
  //PADRON
  for (let i = 2; i < 4; i++) {
    cadenas.c_padron.push(data.padron[i]);
  }
  for (let i = 5; i < 7; i++) {
    cadenas.c_padron.push(data.padron[i]);
  }
  //Apoyos
  for (let i = 0; i < (data.apoyos).length; i++) {
    cadenas.c_apoyos.push(data.apoyos[i]);
  }  
}

function autoScroll(sectionId) {
    const section = document.getElementById(sectionId);
    const sectionPosition = section.offsetTop;
    window.scrollTo({
        top: sectionPosition,
        behavior: 'smooth'
    });
}

function graficaRe(seccionID, etiquetas, etiqueta, datos) {
  const GReSo = document.getElementById(seccionID);
  new Chart(GReSo, {
    type: 'bar',
    data: {
      labels: etiquetas,
      datasets: [{
        label: etiqueta,
        data: datos  /*[3.8, 14.9, 10.4, 20.9, 2.6, 63.2, 32.4]*/,
        borderWidth: 1
      }]
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

function graficaPA(seccionID, etiquetas, etiqueta, datos) {
  const GReSo = document.getElementById(seccionID);

  var datosPastel = {
    labels: etiquetas,
    datasets: [
        {
            data: datos,
            backgroundColor: [
              "#FF6384",
              "#63FF84",
              "#8463FF",
              "#2AADE7",
              "#6384FF",
              "#00AFAA",
              "#B012AE",
              "#B01261",
              "#A2B012"
            ]
        }]
};

  new Chart(GReSo, {
    type: 'pie',
    data: datosPastel,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: etiqueta
        }
      }
    },
  });

}

function graficaPA2(seccionID, etiquetas, etiqueta, datos) {
  const GReSo = document.getElementById(seccionID);

  const data = {
    labels: etiquetas,
    datasets: [
      {
        backgroundColor: ['#AAA', '#777'],
        data: [datos[0], datos[1]]
      },
      {
        backgroundColor: ['hsl(0, 100%, 60%)', 'hsl(0, 100%, 35%)'],
        data: [datos[2], datos[3]]
      }
    ]
  };

  new Chart(GReSo, {
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
// Función para obtener parámetro de la URL
function obtenerParametroURL(nombreParametro) {
  var urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(nombreParametro);
}

function generarTabla(CadenaA) {
  // Obtener el contenedor de la tabla
  var tablaContainer = document.getElementById("GApo");
  // Crear la tabla
  var tabla = document.createElement("table");
  // Crear la fila de encabezado
  var encabezado = document.createElement("tr");
  // Crear las celdas de encabezado
  var encabezadoCelda1 = document.createElement("th");
  encabezadoCelda1.textContent = "Apoyo";
  encabezado.appendChild(encabezadoCelda1);
  var encabezadoCelda2 = document.createElement("th");
  encabezadoCelda2.textContent = "Periodo";
  encabezado.appendChild(encabezadoCelda2);
  var encabezadoCelda3 = document.createElement("th");
  encabezadoCelda3.textContent = "No. apoyos";
  encabezado.appendChild(encabezadoCelda3);
  
  // Agregar el encabezado a la tabla
  tabla.appendChild(encabezado);
  
  // Crear las filas de datos
  for (var i = 0; i <= CadenaA.length; i+=6) {
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
    
    // Agregar la fila a la tabla
    tabla.appendChild(fila);
  }
  
  // Agregar la tabla al contenedor
  tablaContainer.appendChild(tabla);
}

function insertarDatos(){
  // Asignar el valores a la pagina
  document.getElementById('tituloM').innerText = data.nombre[0];
  document.getElementById('nommbreMun').innerText = data.nombre[0];
  document.getElementById('tituloPoblacion').innerText = data.poblacion[2];  
  document.getElementById('tituloPoblacionA').innerText = data.poblacion[1]; 
  document.getElementById('tituloEdad').innerText = data.poblacion[5];  
  document.getElementById('tituloEdadA').innerText = data.poblacion[1];  
  document.getElementById('tituloPobreza').innerText = data.tpobreza[2] + ' %';  
  document.getElementById('tituloPobrezaA').innerText = data.tpobreza[1];  
  document.getElementById('tituloPIB').innerText = '$' + data.economia[2];   
  document.getElementById('tituloPIBA').innerText = data.economia[1];  
  document.getElementById('tituloUE').innerText = data.economia[4];  
  document.getElementById('tituloUEA').innerText = data.economia[1];  
  document.getElementById('tituloSalario').innerText = '$' +  data.empleo[13];  
  document.getElementById('tituloSalarioA').innerText = data.empleo[1];
}

document.getElementById('imagenM').href =  '/static/img_mun/'+contenido+'.png';
document.getElementById('imagenMunicipio22').src =  '/static/img_mun/'+contenido+'.png';
  
