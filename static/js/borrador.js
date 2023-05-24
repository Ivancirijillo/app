const vivienda =['Piso de tierra', 'No disponen de excusado o sanitario', 'No disponen de agua entubada de la red pública', 'No disponen de drenaje', 'No disponen de energía eléctrica', 'No disponen de lavadora', 'No disponen de refrigerador']

var data;
var c_viviendas = [];

document.addEventListener('DOMContentLoaded', function() {
  fetch('/consultas-pagina')
    .then(response => response.json())
    .then(result => {
      data = result; // Asignar los datos a la variable global
      procesarDatos(); // Llamar a la función que utiliza los datos
      graficaRe(); // Llamar a la funcion de la grafica
    })
    .catch(error => {
      console.error('Error al realizar la consulta:', error);
    });
});

function procesarDatos() {
  // REZAGO
  //  general
  //  vivenda
  for (let i = 8; i < 15; i++) {
    c_viviendas.push(data.rezago[i]);
  }
  console.log('Datos: ', data.rezago[0]);
  console.log('Datos: ', c_viviendas);
  // Resto del código...
}

function autoScroll(sectionId) {
    const section = document.getElementById(sectionId);
    const sectionPosition = section.offsetTop;
    window.scrollTo({
        top: sectionPosition,
        behavior: 'smooth'
    });
}

function graficaRe() {
  const GReSo = document.getElementById('GReSo');

  new Chart(GReSo, {
    
    type: 'bar',
    data: {
      labels: vivienda,
      datasets: [{
        label: 'Número de viviendas',
        data: c_viviendas  /*[3.8, 14.9, 10.4, 20.9, 2.6, 63.2, 32.4]*/,
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

  const Ed = document.getElementById('Ed');

  new Chart(Ed, {
    type: 'bar',
    data: {
      labels: vivienda,
      datasets: [{
        label: 'Número de viviendas',
        data: [3.8, 14.9, 10.4, 20.9, 2.6, 63.2, 32.4],

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