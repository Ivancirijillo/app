let etiquetas_graficas = {
  vivienda:   ['Piso de tierra', 'No disponen de excusado o sanitario', 'No disponen de agua entubada de la red pública', 'No disponen de drenaje', 'No disponen de energía eléctrica', 'No disponen de lavadora', 'No disponen de refrigerador'],
  educacion:  ['15 años o más analfabeta', '6 a 14 años que no asiten a la escuela', '15 años o más con educación básica incompleta'],
  economia:   ['Unidades Económicas', 'Proporción Deuda Pública / Ingresos', 'Proporción servicio de Deuda / Ingresos', 'Obligaciones Corto Plazo / Ingresos'],
  genero:     ['Hombres', 'Mujeres'],
  indices:    ['Edad Mediana', 'Mediana Hombres', 'Mediana Mujeres', 'Relación Hombre-Mujer', 'Índice de envejecimiento total', 'Índice de envejecimiento Hombres', 'Índice de envejecimiento Mujeres', 'Razón de dependencia Total', 'Razón de dependencia Infantil', 'Razón de dependencia de Vejez'],
  indigena:   ['Población de 3 años o más', 'Población que habla lengua índigena', 'Población índigena que habla español', 'Población índigena que no habla español', 'Población que no habla lengua índigena'],
  disc:       ['Personas con discapacidad','Personas con discapacidad total', 'Personas con discapacidad parcial o limitaciones', 'Población con algún problema o condición mental', 'Población sin discapacidad, limitacion, problema o condición mental'],
  afil:       ['IMSS', 'ISSSTE', 'ISSSTE Estatal', 'Pemex, Defensa o Marina', 'INSABI', 'IMSS BIENESTAR', 'Institución privada', 'Otra afiliación', 'No afiliado'],
  loc:        ['Vive en la entidad', 'Vive en otra entidad', 'Vive en EE. UU.', 'Viven en otro país'],
  hogares:    ['Con limitación alimentaria', 'Sin limitación alimentaria'],
  pobre:      ['Porcentaje de pobreza', 'Porcentaje de pobreza extrema' , 'Pobreza extrema carencias promedio' , 'Pobreza moderada' , 'Porcentaje de no pobre y no vulnerable' , 'Porcentaje de rezago educativo' , 'Promedio de carencia de salud' , 'Carencia Salud Carencias promedio' , 'Porcentaje carencia Seguro Social' , 'Porcentaje carencia de calidad de vivienda' , 'Porcentaje carencia de servicios de vivienda' , 'Porcentaje carencia de alimentación' , 'Porcentaje de ingreso inferior pobreza' , 'Porcentaje de ingreso inferior pobreza extrema'],
  empl:       ['Agricultura, Ganadería, Silvicultura, Pesca y Caza', 'Comercio', 'Industria Eléctrica y Captación, y suministro de Agua Potable', 'Industrias de la Construcción', 'Industrias de Transformación', 'Industrias de Transformación 2', 'Industrias Extractivas', 'Servicios para Empresas, Personas y el Hogar', 'Servicios Sociales y Comunales', 'Transportes y comunicaciones'],
  delitos:    ['Delitos de alto impacto', 'Homicidios', 'Feminicidios', 'Secuestros', 'Desapariciones', 'Robos', 'Robos transporte', 'Violencia de género en todas sus modalidades', 'Violencia familiar'],
  desap:      ['Hombres', 'Mujeres'],
  padron:     ['Padrón hombres', 'Padrón mujeres', 'Lista nominal hombres', 'Lista nominal mujeres']
};

var data;
var cadenas = {
  c_general: [],
  c_viviendas: [],
  c_viviendasYEAR: [],
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
  c_padron: [],
  c_PIB: [],
  c_PIBY: []
}
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
      console.log('Datos: ', data); //imprime los resultados de la consuylta a la base de datos
      //console.log('Datos: ', (((Object.values(data.empleo)).length)-1)); 
      procesarDatos(); // Llamar a la función que utiliza los datos
      insertarDatos();
      //Tabla apoyos
      generarTabla(cadenas.c_apoyos);
      // Llamar a la funcion de las grafica
      //graficaRe('GReSo',etiquetas_graficas.vivienda, 'Número de viviendas', cadenas.c_viviendas ); 

      graficaBORRADOR('GReSo',etiquetas_graficas.vivienda, cadenas.c_viviendasYEAR, cadenas.c_viviendas );

      graficaRe('GEd',etiquetas_graficas.educacion, 'Población', cadenas.c_educacion ); 
      graficaRe('GEco2',etiquetas_graficas.economia, '$', cadenas.c_economia ); 
      graficaLi('GEco', 'Producto Interno Bruto', cadenas.c_PIB, cadenas.c_PIBY); 
      graficaPA('GGene',etiquetas_graficas.genero, 'Población', cadenas.c_Pgeneral ); 
      graficaRe('GEdad',etiquetas_graficas.indices, '', cadenas.c_edad ); 
      graficaRe('GLenI',etiquetas_graficas.indigena, '', cadenas.c_lenguaI ); 
      graficaRe('GDisc',etiquetas_graficas.disc, 'Personas con discapacidad', cadenas.c_disc ); 
      graficaPA('GAfil',etiquetas_graficas.afil, 'Afiliados totales a sistemas de seguridad social', cadenas.c_afili ); 
      //graficaRe('GAfil',etiquetas_graficas.afil, 'Afiliados totales a sistemas de seguridad social', cadenas.c_afili ); 
      graficaPA('GLoc',etiquetas_graficas.loc, 'Población', cadenas.c_loc ); 
      graficaPA('GAli',etiquetas_graficas.hogares, 'Hogares', cadenas.c_alimen ); 
      graficaRe('GPobr',etiquetas_graficas.pobre, 'Porcentaje', cadenas.c_pobreza ); 
      graficaRe('GEmp',etiquetas_graficas.empl, 'No', cadenas.c_empleo ); 
      graficaRe('GDeli',etiquetas_graficas.delitos, 'No Casos', cadenas.c_deli ); 
      if(data.deli[(((Object.values(data.deli)).length)-6)]!=0){
        graficaPA('GDeliHyM',etiquetas_graficas.desap, 'Desapariciones', cadenas.c_deliHM ); 
        document.getElementById('parrafoDeli').innerText = "El número de desapariciones totales en " + data.deli[(((Object.values(data.deli)).length)-13)] +" fue de " + data.deli[(((Object.values(data.deli)).length)-6)] + ", siendo " + ((100*(data.deli[(((Object.values(data.deli)).length)-7)]))/(data.deli[(((Object.values(data.deli)).length)-6)])).toFixed(2) + "% mujeres y " + ((100*(data.deli[(((Object.values(data.deli)).length)-8)]))/(data.deli[(((Object.values(data.deli)).length)-6)])).toFixed(2) + "% hombres." ;
        
      }
      graficaPA2('GPaE',etiquetas_graficas.padron, 'No Ciudadanos', cadenas.c_padron ); 
    })
    .catch(error => {
      console.error('Error al realizar la consulta:', error);
    });
});

function procesarDatos() {
  //REZAGO
      //Vivienda
  console.log('Datos: ', ((Object.values(data.rezago)).length));
  for (let i = 0; i < (((Object.values(data.rezago)).length)); i+=18) {
    cadenas.c_viviendas.push([data.rezago[i+8], data.rezago[i+9], data.rezago[i+10], data.rezago[i+11], data.rezago[i+12], data.rezago[i+13], data.rezago[i+14]]);
    cadenas.c_viviendasYEAR.push(data.rezago[i+1])
  }
  
  //REZAGO
    //general
  cadenas.c_general.push(data.rezago[1]);
  for (let i = 15; i < 18; i++) {
    cadenas.c_general.push(data.rezago[i]);
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
  for (let i = 4; i < 8; i++) {
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
  for (let i = 42; i < 44; i++) {
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
  //PIB
  for (let i = 0; i < ((data.pib).length)-2; i+=2) {
    cadenas.c_PIB.push(data.pib[i]);
  }  
  //PIB años
  for (let i = 1; i < ((data.pib).length)-2; i+=2) {
    cadenas.c_PIBY.push(data.pib[i]);
  } 
}

function autoScroll(sectionId) {
    const section = document.getElementById(sectionId);
    const sectionPosition = section.offsetTop;
    window.scrollTo({
        top: sectionPosition+310,
        behavior: 'smooth'
    });
}



function graficaBORRADOR(seccionID, etiquetas, etiquetasDatasets, datos) {
  const GReSo = document.getElementById(seccionID);
  
  const datasets = datos.map((dataset, index) => ({
    label: etiquetasDatasets[index],
    data: dataset,
    borderWidth: 1
  }));
  
  new Chart(GReSo, {
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

  new Chart(GReSo, {
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

function graficaPA2(seccionID, etiquetas, etiqueta, datos) {
  const GReSo = document.getElementById(seccionID);

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

function graficaLi (seccionID, etiqueta, datos, etiquetas) {
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
    
    // Agregar la fila a la tabla
    tabla.appendChild(fila);
  }
  
  // Agregar la tabla al contenedor
  tablaContainer.appendChild(tabla);
}

function insertarDatos(){
  // Asignar el valores a la pagina
  //datos que se utilizan más de una vez
  //pobCAntidad=(((Object.values(data.poblacion)).length)-42);
  document.getElementById('tituloM').innerText = data.nombre[0];
  document.getElementById('nommbreMun').innerText = data.nombre[0];
  document.getElementById('tituloPoblacion').innerText = agregarComas(data.poblacion[(((Object.values(data.poblacion)).length)-42)]);  
  document.getElementById('tituloPoblacionA').innerText = data.poblacion[(((Object.values(data.poblacion)).length)-43)]; 
  document.getElementById('tituloEdad').innerText = data.poblacion[(((Object.values(data.poblacion)).length)-39)];  
  document.getElementById('tituloEdadA').innerText = data.poblacion[(((Object.values(data.poblacion)).length)-43)];  
  document.getElementById('tituloPobreza').innerText = (Math.floor(data.tpobreza[(((Object.values(data.tpobreza)).length)-14)])) + ' %';  
  document.getElementById('tituloPobrezaA').innerText = data.tpobreza[(((Object.values(data.tpobreza)).length)-15)];  
  document.getElementById('tituloPIB').innerText = '$' + agregarComas(data.economia[(((Object.values(data.economia)).length)-6)]);   
  document.getElementById('tituloPIBA').innerText = data.economia[(((Object.values(data.economia)).length)-7)];  
  document.getElementById('tituloUE').innerText = agregarComas(data.economia[(((Object.values(data.economia)).length)-3)]);  
  document.getElementById('tituloUEA').innerText = data.economia[(((Object.values(data.economia)).length)-7)];  
  document.getElementById('tituloSalario').innerText = '$' +  data.empleo[(((Object.values(data.empleo)).length)-1)]; 
  document.getElementById('tituloSalarioA').innerText = data.empleo[(((Object.values(data.empleo)).length)-13)]; 
  document.getElementById('reYear').innerText = data.rezago[(((Object.values(data.rezago)).length)-17)];
  document.getElementById('indiceRe').innerText = data.rezago[(((Object.values(data.rezago)).length)-3)];
  document.getElementById('gradoRe').innerText = data.rezago[(((Object.values(data.rezago)).length)-2)];
  document.getElementById('posicionRe').innerText = 'N° ' + data.rezago[(((Object.values(data.rezago)).length)-1)];
  document.getElementById('sinSalud').innerText = data.rezago[(((Object.values(data.rezago)).length)-11)];
  document.getElementById('gini').innerText = data.rezago[(((Object.values(data.rezago)).length)-16)];
  document.getElementById('razonI').innerText = data.rezago[(((Object.values(data.rezago)).length)-15)];
  document.getElementById('apoyoYear').innerText = data.apoyos[1];
  document.getElementById('economiaYear').innerText = data.economia[(((Object.values(data.economia)).length)-7)];
  document.getElementById('pobYear').innerText = data.poblacion[(((Object.values(data.poblacion)).length)-43)];
  document.getElementById('etiquetaPib').innerText = '$' +  agregarComas(data.economia[(((Object.values(data.economia)).length)-6)]);
  document.getElementById('etiquetaPer').innerText = '$' +  agregarComas(data.economia[(((Object.values(data.economia)).length)-5)]);
  document.getElementById('etquetaAfil').innerText = agregarComas(data.poblacion[(((Object.values(data.poblacion)).length)-19)]);
  document.getElementById('etiquetaAli').innerText = agregarComas(data.poblacion[(((Object.values(data.poblacion)).length)-5)]);
  document.getElementById('poYear').innerText = data.tpobreza[(((Object.values(data.tpobreza)).length)-15)];
  document.getElementById('emYear').innerText = data.empleo[(((Object.values(data.empleo)).length)-13)];
  document.getElementById('etiquetaTota').innerText = agregarComas(data.empleo[(((Object.values(data.empleo)).length)-2)]);
  document.getElementById('etiquetaSa').innerText = '$' +  agregarComas(data.empleo[(((Object.values(data.empleo)).length)-1)]);
  document.getElementById('deliYear').innerText =data.deli[(((Object.values(data.deli)).length)-13)];
  document.getElementById('paeleYear').innerText =data.padron[(((Object.values(data.padron)).length)-7)];
  document.getElementById('etiquetaP').innerText =agregarComas(data.padron[(((Object.values(data.padron)).length)-4)]);
  document.getElementById('etiquetaLista').innerText =agregarComas(data.padron[(((Object.values(data.padron)).length)-1)]);
  document.getElementById('parrafoPob').innerText = "La población total de " + data.nombre[0] + " en " + data.poblacion[(((Object.values(data.poblacion)).length)-43)] +" fue de " + agregarComas(data.poblacion[(((Object.values(data.poblacion)).length)-42)]) + " habitantes, siendo " + ((100*(data.poblacion[(((Object.values(data.poblacion)).length)-40)]))/(data.poblacion[(((Object.values(data.poblacion)).length)-42)])).toFixed(2) + "% mujeres y " + ((100*(data.poblacion[(((Object.values(data.poblacion)).length)-41)]))/(data.poblacion[(((Object.values(data.poblacion)).length)-42)])).toFixed(2) + "% hombres." ;
  document.getElementById('parrafoAfil').innerText = "Se considera que una persona se encuentra en situación de carencia por acceso a los servicios de salud cuando no cuenta con adscripción o derecho a recibir servicios médicos de alguna institución que los presta. En este sentido, dentro del municipio, existe una población de " + agregarComas(data.poblacion[(((Object.values(data.poblacion)).length)-10)]) + " personas que no están afiliadas a ninguna de estas instituciones, mientras que hay " + agregarComas(data.poblacion[(((Object.values(data.poblacion)).length)-19)]) + " personas que sí están afiliadas.";
  document.getElementById('parrafoEmpleo').innerText = "Con el fin de obtener una perspectiva sobre la distribución del empleo formal entre los diferentes sectores en el municipio, se presenta en la gráfica las industrias que generan el mayor número de empleos. Se destaca que las industrias de transformación son las que generan la mayor cantidad de empleos, con un total de " + agregarComas(data.empleo[(((Object.values(data.empleo)).length)-2)]) + " empleos.";
  document.getElementById('parrafoAlimentacion').innerText = "En el año " + data.poblacion[(((Object.values(data.poblacion)).length)-43)] + ", los hogares con limitación alimentaria representaron el " + ((100*(data.poblacion[(((Object.values(data.poblacion)).length)-2)]))/(data.poblacion[(((Object.values(data.poblacion)).length)-5)])).toFixed(2) + " % de total, mientras que los hogares sin esta limitación representaron el " + ((100*(data.poblacion[(((Object.values(data.poblacion)).length)-1)]))/(data.poblacion[(((Object.values(data.poblacion)).length)-5)])).toFixed(2) + " restante.";
}

document.getElementById('imagenM').href =  '/static/img_mun/'+contenido+'.png';
document.getElementById('imagenMunicipio22').src =  '/static/img_mun/'+contenido+'.png';

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

function agregarComas(numero) {
  return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
