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
      borrador();
      //POBLACION
        //Barras
      graficaBa('GEdad',etiquetas_graficas.indices, Object.keys(data.edad), Object.values(data.edad)); 
      graficaBa('GLenI',etiquetas_graficas.indigena, Object.keys(data.lengua), Object.values(data.lengua)); 
      graficaBa('GDisc',etiquetas_graficas.disc, Object.keys(data.disc), Object.values(data.disc));
        //Pastel
      graficaPA('GGene',etiquetas_graficas.genero, 'Población', (data["sexo"][Object.keys(data.sexo)[Object.keys(data.sexo).length - 1]])); 
      //POBREZA
      graficaBa('GPobr',etiquetas_graficas.pobre, Object.keys(data.tpobreza), Object.values(data.tpobreza)); 
      //EMPLEO
      //graficaBa('GEmp',etiquetas_graficas.empl, Object.keys(data.empleo), Object.values(data.empleo)); 
      //DELINCUENCIA
      graficaBa('GDeli',etiquetas_graficas.delitos, Object.keys(data.deli), Object.values(data.deli)); 
      
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

function borrador(){
  var select = document.getElementById("opcionPob");
  //select.innerHTML = '<option disabled selected>Elije una opción</option>';
  for (let key in data.sexo) {    
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
    var contenedor = document.getElementById("contenedorPastel1");
    hola="sexo"
    hola2="GraficosPastel"
    contenedor.innerHTML = '<canvas class="'+hola2+'" id="GGene"></canvas>'; // limpiar el contenedor
    graficaPA('GGene',etiquetas_graficas.genero, 'Población', data[hola][opcionSeleccionada]); 

  }); 
}