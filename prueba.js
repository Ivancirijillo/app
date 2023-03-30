// let graficas = {};
// graficas["lista[i]"] = {};
// graficas["lista[i]"]["id"] = "grafica1";
// graficas["lista[i]"]["type"] = "line";
// graficas["lista[i]"]["labels"] = [1,2,3,4,5,6];
// graficas["lista[i]"]["datasets"] = [];
// graficas["lista[i]"]["datasets"]["label"] = "conjunto1";
// graficas["lista[i]"]["datasets"]["data"] = [1,2,3,4,5,6];
// graficas["lista[i]"]["datasets"]["background"] = "red";
// graficas["lista[i]"]["opciones"] = {}
// graficas["lista[i]"]["opciones"]["titulo"] = {} 
// graficas["lista[i]"]["opciones"]["titulo"]["display"] = "true";
// graficas["lista[i]"]["opciones"]["titulo"]["text"] = "ventas";
// graficas["lista[i]"]["opciones"]["titulo"]["fontSize"] = 18;

// console.log(graficas);

const labels = ['Enero', 'Febrero', 'Marzo'];
const data1 = [10, 20, 30];
const data2 = [15, 25, 35];

const datasets = [
  { label: 'Conjunto de datos 1', data: data1, backgroundColor: 'red' },
  { label: 'Conjunto de datos 2', data: data2, backgroundColor: 'blue' }
];

const datasetsConfig = [];
for (let i = 0; i < datasets.length; i++) {
  datasetsConfig.push({
    label: datasets[i].label,
    data: datasets[i].data,
    backgroundColor: datasets[i].backgroundColor
  });
}

const config = {
  type: 'bar',
  data: {
    labels: labels,
    datasets: datasetsConfig
  },
  options: {
    // opciones adicionales de configuración
  }
};

console.log(config)