const vivienda =['Viviendas con piso de tierra', 'Viviendas que no disponen de excusado o sanitario', 'Viviendas que no disponen de agua entubada de la red pública', 'Viviendas que no disponen de drenaje', 'Viviendas que no disponen de energía eléctrica', 'viviendas que no disponen de lavadora', 'Viviendas que no disponen de refrigerador']

function autoScroll(sectionId) {
    const section = document.getElementById(sectionId);
    const sectionPosition = section.offsetTop;
    window.scrollTo({
        top: sectionPosition,
        behavior: 'smooth'
    });
}

const ctx = document.getElementById('GReSo');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Viviendas con piso de tierra', 'Viviendas que no disponen de excusado o sanitario', 'Viviendas que no disponen de agua entubada de la red pública', 'Viviendas que no disponen de drenaje', 'Viviendas que no disponen de energía eléctrica', 'viviendas que no disponen de lavadora', 'Viviendas que no disponen de refrigerador'],
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
