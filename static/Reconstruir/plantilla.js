//Tabla de apoyos


//Graficas
const labels = new Array ("Alto Impacto", "Homicidios", "Feminicidios", "Secuestros", 
"Desapariciones Totales", "Robos", "Robo Transporte");
const colors = ['rgb(69,177,223)', 'rgb(99,201,122)', 'rgb(203,82,82)', 'rgb(229,224,88)', 'rgb(229,224,88)', 'rgb(229,224,88)', 'rgb(229,224,88)'];
 
const graphA = document.querySelector("#graphA");
const graphPE = document.querySelector("#graphPE");
const graphPob = document.querySelector("#graphPob");
const graphEm = document.querySelector("#graphEm");
const graphP = document.querySelector("#graphP");
const graphP1 = document.querySelector("#graphP1");
const graphR = document.querySelector("#graphR");
 
 
const data = {
    labels: labels,
    datasets: [{
        data: [1, 2, 3, 4, 10],
        backgroundColor: colors
    }]
};
 
const config = {
    type: 'bar',
    data: data,
};
 
new Chart(graphA, config);

const configPE = {
    type: 'pie',
    data: data,
};

new Chart(graphPE, configPE);

const configPob = {
    type: 'bar',
    data: data,
};

new Chart(graphPob, configPob);

const configEm = {
    type: 'pie',
    data: data,
};

new Chart(graphEm, configEm);

const configP = {
    type: 'bar',
    data: data,
};

new Chart(graphP, configP);

const configP1 = {
    type: 'pie',
    data: data,
};

new Chart(graphP1, configP1);

const configR = {
    type: 'bar',
    data: data,
};

new Chart(graphR, configR);


const texto_A = document.getElementById('textoA')
const texto_D = document.getElementById('textoD')
const texto_PE = document.getElementById('textoPE')
const texto_Pob = document.getElementById('textoPob')
const texto_Eco = document.getElementById('textoEco')
const texto_Em = document.getElementById('textoEm')
const texto_P = document.getElementById('textoP')
const texto_RS = document.getElementById('textoRS')

const informacion = {
    'Apoyos': "Construir familias fuertes en los municipios significa que todos los miembros de la familia tengan la oportunidad de desarrollarse plenamente en todas las etapas de la vida. Esto significa abordar directa e indirectamente temas como la reducción de la desigualdad, la promoción de la salud y el bienestar, la garantía de una educación de calidad y la prevención de la violencia doméstica, especialmente para niños, jóvenes y grupos vulnerables. Para lograrlo, el municipio brinda los siguientes apoyos para atender las necesidades de los ciudadanos.",
    'Delincuencia': "La persistente problemática de la delincuencia en el municipio ha sido objeto de diversos intentos para combatirla a lo largo del tiempo. A pesar de los esfuerzos realizados, todavía se presentan numerosos casos que provocan un sentimiento de inseguridad entre la población.",
    'Padron': "El padrón electoral es una base de datos que almacena los datos de los ciudadanos mexicanos que han pedido ser incluidos en él, con el propósito de obtener su credencial para votar con fotografía y así ejercer su derecho al voto. La lista nominal, por otro lado, comprende a todos los ciudadanos que solicitaron su inclusión en el Padrón Electoral y ya cuentan con su credencial para votar con fotografía válida.",
    'Pobreza': "Según el Consejo Nacional de Evaluación de la Política de Desarrollo Social, una persona se considera en estado de pobreza cuando experimenta al menos una falta en áreas sociales como educación, salud, seguridad, vivienda, servicios básicos y alimentación, además de no poder acceder a bienes y servicios para satisfacer sus necesidades esenciales (CONEVAL, 2010). El gráfico muestra los porcentajes de población que se encuentran en situación de pobreza en diferentes variables, así como una representación visual de los niveles de atraso y carencias en aspectos fundamentales como vivienda, seguro social y alimentación.",
    'Economía': "El Estado de México, es una de las entidades federativas más importantes en términos económicos y demográficos. Su economía es diversa y abarca diversos sectores que contribuyen significativamente al desarrollo del país.",
    'Empleo': "El empleo es un tema fundamental en cualquier economía, y el Estado de México no es la excepción. Como una de las entidades más pobladas de México, el estado enfrenta diversos desafíos y oportunidades en cuanto a la generación de empleo.",
    'Población': "Según el Instituto Nacional de Estadística y Geografía (INEGI) y el Consejo Nacional de Población (CONAPO), en 2021, se estimaba que la población del Estado de México era de alrededor de 17-18 millones de habitantes, lo que lo convertía en el estado más poblado de México en ese momento.",
    'Rezago Social': "El rezago social en el Estado de México es un tema importante y complejo que refleja desigualdades y carencias en diversos aspectos que afectan la calidad de vida de una parte significativa de la población. A pesar de ser una entidad federativa con un importante desarrollo económico y urbano, también enfrenta desafíos sociales y económicos que impactan en el bienestar de sus habitantes."
}

texto_A.textContent = informacion['Apoyos'],
texto_D.textContent = informacion['Delincuencia'],
texto_PE.textContent = informacion['Padron'],
texto_Pob.textContent = informacion['Pobreza'],
texto_Eco.textContent = informacion['Economía'],
texto_Em.textContent = informacion['Empleo'],
texto_P.textContent = informacion['Población'],
texto_RS.textContent = informacion['Rezago Social']


