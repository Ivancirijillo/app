let etiquetas_graficas = {
  vivienda:   ['Piso de tierra', 'No disponen de excusado o sanitario', 'No disponen de agua entubada de la red pública', 'No disponen de drenaje', 'No disponen de energía eléctrica', 'No disponen de lavadora', 'No disponen de refrigerador'],
  educacion:  ['15 años o más analfabeta', '6 a 14 años que no asiten a la escuela', '15 años o mas con educacion basica incompleta']
};

var data;
var c_general = [];
var c_viviendas = [];
var c_carencias = [];
var c_educacion = [];
var c_apoyos = [];
var c_economia = [];

document.addEventListener('DOMContentLoaded', function() {
  fetch('/consultas-pagina')
    .then(response => response.json())
    .then(result => {
      data = result; // Asignar los datos a la variable global
      console.log('Datos: ', data);
      procesarDatos(); // Llamar a la función que utiliza los datos
      // Llamar a la funcion de la grafica
      graficaRe('GReSo',etiquetas_graficas.vivienda, 'Número de viviendas', c_viviendas ); 
      graficaRe('Ed',etiquetas_graficas.educacion, 'Población', c_educacion ); 
      //graficaEd();
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
//Economia
for (let i = 2; i < 8; i++) {
  c_economia.push(data.economia[i]);
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

