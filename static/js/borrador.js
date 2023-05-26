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
var c_general = [];
var c_viviendas = [];
var c_carencias = [];
var c_educacion = [];
var c_apoyos = [];
var c_economia = [];
var c_Pgeneral = [];
var c_edad = [];
var c_lenguaI = [];
var c_disc = [];
var c_afili = [];
var c_loc = [];
var c_alimen = [];
var c_pobreza = [];
var c_empleo = [];
var c_deli = [];
var c_deliHM = [];
var c_padron = [];

document.addEventListener('DOMContentLoaded', function() {
  fetch('/consultas-pagina')
    .then(response => response.json())
    .then(result => {
      data = result; // Asignar los datos a la variable global
      console.log('Datos: ', data);
      procesarDatos(); // Llamar a la función que utiliza los datos
      // Llamar a la funcion de la grafica
      graficaRe('GReSo',etiquetas_graficas.vivienda, 'Número de viviendas', c_viviendas ); 
      graficaRe('GEd',etiquetas_graficas.educacion, 'Población', c_educacion ); 
      graficaRe('GEco',etiquetas_graficas.economia, '$', c_economia ); 
      graficaPA('GGene',etiquetas_graficas.genero, 'Población', c_Pgeneral ); 
      graficaRe('GEdad',etiquetas_graficas.indices, '', c_edad ); 
      graficaRe('GLenI',etiquetas_graficas.indigena, '', c_lenguaI ); 
      graficaRe('GDisc',etiquetas_graficas.disc, 'Personas con discapacidad', c_disc ); 
      graficaPA('GAfil',etiquetas_graficas.afil, 'Afiliados totales a sistemas de seguridad social', c_afili ); 
      //graficaRe('GAfil',etiquetas_graficas.afil, 'Afiliados totales a sistemas de seguridad social', c_afili ); 
      graficaPA('GLoc',etiquetas_graficas.loc, 'Poblacion', c_loc ); 
      graficaRe('GAli',etiquetas_graficas.hogares, 'Hogares', c_alimen ); 
      graficaRe('GPobr',etiquetas_graficas.pobre, 'Porcentaje', c_pobreza ); 
      graficaRe('GEmp',etiquetas_graficas.empl, 'No', c_empleo ); 
      graficaRe('GDeli',etiquetas_graficas.delitos, 'No Casos', c_deli ); 
      graficaPA('GDeliHyM',etiquetas_graficas.desap, 'Desapariciones', c_deliHM ); 
      graficaPA2('GPaE',etiquetas_graficas.padron, 'No Ciudadanos', c_padron ); 
    })
    .catch(error => {
      console.error('Error al realizar la consulta:', error);
    });
});

function procesarDatos() {
  //REZAGO
    //general
  c_general.push(data.rezago[1]);
  for (let i = 15; i < 18; i++) {
    c_general.push(data.rezago[i]);
  }
    //vivenda
  for (let i = 8; i < 15; i++) {
    c_viviendas.push(data.rezago[i]);
  }
    //Carencias
    c_carencias.push(data.rezago[7]);
  for (let i = 2; i < 4; i++) {
    c_carencias.push(data.rezago[i]);
  }
    //Educacion
  for (let i = 4; i < 7; i++) {
    c_educacion.push(data.rezago[i]);
  }
  //ECONOMIA
  for (let i = 2; i < 8; i++) {
    c_economia.push(data.economia[i]);
  }
  //POBLACION
  for (let i = 3; i < 5; i++) {
    c_Pgeneral.push(data.poblacion[i]);
  }
    //Edad
  for (let i = 5; i < 15; i++) {
    c_edad.push(data.poblacion[i]);
  }
    //Lengua indigena
  for (let i = 15; i < 20; i++) {
    c_lenguaI.push(data.poblacion[i]);
  }
  //Discapacidad
  for (let i = 20; i < 25; i++) {
    c_disc.push(data.poblacion[i]);
  }
    //Afiliado
  for (let i = 26; i < 35; i++) {
    c_afili.push(data.poblacion[i]);
  }
    //Localizacion
  for (let i = 35; i < 39; i++) {
    c_loc.push(data.poblacion[i]);
  }
    //Hogares
  for (let i = 40; i < 44; i++) {
    c_alimen.push(data.poblacion[i]);
  }
  //POBREZA
  for (let i = 2; i < 16; i++) {
    c_pobreza.push(data.tpobreza[i]);
  }
  //EMPLEO
  for (let i = 2; i < 12; i++) {
    c_empleo.push(data.empleo[i]);
  }
  //DELITOS
  for (let i = 2; i < 6; i++) {
    c_deli.push(data.deli[i]);
  }
  for (let i = 8; i < 13; i++) {
    c_deli.push(data.deli[i]);
  }
    //Desapariciones
  for (let i = 6; i < 8; i++) {
    c_deliHM.push(data.deli[i]);
  }
  //PADRON
  for (let i = 2; i < 4; i++) {
    c_padron.push(data.padron[i]);
  }
  for (let i = 5; i < 7; i++) {
    c_padron.push(data.padron[i]);
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
