function enviar_json (data){
    return fetch('/impresiones', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {return response.json()})
}



const labels = new Array ("Alto Impacto", "Homicidios", "Feminicidios", "Secuestros", 
"Desapariciones Totales", "Robos", "Robo Transporte");
const colors = ['rgb(69,177,223)', 'rgb(99,201,122)', 'rgb(203,82,82)', 'rgb(229,224,88)', 'rgb(229,224,88)', 'rgb(229,224,88)', 'rgb(229,224,88)'];
 
const graph = document.querySelector("#graph");
 
const data = {
    labels: labels,
    datasets: [{
        data: [1, 2, 3, 4, 10],
        backgroundColor: colors
    }]
};
 
const config = {
    type: 'pie',
    data: data,
};
 
new Chart(graph, config);

const texto_c = document.getElementById('texto')
const informacion = {
    'Apoyos': "Construir familias fuertes en los municipios significa que todos los miembros de la familia tengan la oportunidad de desarrollarse plenamente en todas las etapas de la vida. Esto significa abordar directa e indirectamente temas como la reducción de la desigualdad, la promoción de la salud y el bienestar, la garantía de una educación de calidad y la prevención de la violencia doméstica, especialmente para niños, jóvenes y grupos vulnerables. Para lograrlo, el municipio brinda los siguientes apoyos para atender las necesidades de los ciudadanos.",
    'Delincuencia': "Representación de Gráfica de Delincuencia",
    'Padron Electoral': "Grafica de Padron Electoral",
    'Pobreza': "Representación de Gráfica de Pobre",
    'Economía': "Grafica de Economia",
    'Empleo': "Representación de Gráfica de EMPLEO",
    'Población': "Grafica de Pobla",
    'Rezago Social': "Representación de Gráfica de RS"
}
texto_c.textContent = informacion['Apoyos']



