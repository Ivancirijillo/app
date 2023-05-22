let data;

document.addEventListener('DOMContentLoaded', function() {
  fetch('/consultas-pagina')
    .then(response => response.json())
    .then(result => {
      data = result; // Asignar los datos a la variable global
      procesarDatos(); // Llamar a la función que utiliza los datos
    })
    .catch(error => {
      console.error('Error al realizar la consulta:', error);
    });
});

function procesarDatos() {
  // Utilizar la variable data en esta función
  console.log('Resultados:', data);
  // Resto del código...
}


const vivienda =['Viviendas con piso de tierra', 'Viviendas que no disponen de excusado o sanitario', 'Viviendas que no disponen de agua entubada de la red pública', 'Viviendas que no disponen de drenaje', 'Viviendas que no disponen de energía eléctrica', 'viviendas que no disponen de lavadora', 'Viviendas que no disponen de refrigerador']

function autoScroll(sectionId) {
    const section = document.getElementById(sectionId);
    const sectionPosition = section.offsetTop;
    window.scrollTo({
        top: sectionPosition,
        behavior: 'smooth'
    });
}

const GReSo = document.getElementById('GReSo');
console.log('Resultados:', data.rezago);
  new Chart(GReSo, {
    
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