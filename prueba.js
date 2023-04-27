// // let graficas = {};
// // graficas["lista[i]"] = {};
// // graficas["lista[i]"]["id"] = "grafica1";
// // graficas["lista[i]"]["type"] = "line";
// // graficas["lista[i]"]["labels"] = [1,2,3,4,5,6];
// // graficas["lista[i]"]["datasets"] = [];
// // graficas["lista[i]"]["datasets"]["label"] = "conjunto1";
// // graficas["lista[i]"]["datasets"]["data"] = [1,2,3,4,5,6];
// // graficas["lista[i]"]["datasets"]["background"] = "red";
// // graficas["lista[i]"]["opciones"] = {}
// // graficas["lista[i]"]["opciones"]["titulo"] = {} 
// // graficas["lista[i]"]["opciones"]["titulo"]["display"] = "true";
// // graficas["lista[i]"]["opciones"]["titulo"]["text"] = "ventas";
// // graficas["lista[i]"]["opciones"]["titulo"]["fontSize"] = 18;

// // console.log(graficas);

// const labels = ['Enero', 'Febrero', 'Marzo'];
// const data1 = [10, 20, 30];
// const data2 = [15, 25, 35];

// const datasets = [
//   { label: 'Conjunto de datos 1', data: data1, backgroundColor: 'red' },
//   { label: 'Conjunto de datos 2', data: data2, backgroundColor: 'blue' }
// ];

// const datasetsConfig = [];
// for (let i = 0; i < datasets.length; i++) {
//   datasetsConfig.push({
//     label: datasets[i].label,
//     data: datasets[i].data,
//     backgroundColor: datasets[i].backgroundColor
//   });
// }

// const config = {
//   type: 'bar',
//   data: {
//     labels: labels,
//     datasets: datasetsConfig
//   },
//   options: {
//     // opciones adicionales de configuración
//   }
// };

// console.log(config)

function validarEntradaUsuario(entrada) {
    // Expresión regular para validar la entrada del usuario
    const expresionRegular = /^15(?:0[0-9][0-9]|1[0-1][0-9]|1[0-2][0-5])(?:,(?!$)15(?:0[0-9][0-9]|1[0-1][0-9]|1[0-2][0-5]))*(?:-15(?:0[0-9][0-9]|1[0-1][0-9]|1[0-2][0-5]))?$/;
  
    ;
  
    // Validar la entrada del usuario utilizando la expresión regular
    if (expresionRegular.test(entrada)) {
      console.log('La entrada es válida');
    } else {
      console.log('La entrada no es válida');
    }
  }
  
  // Ejemplo de uso
  validarEntradaUsuario('15001,15002,15010'); // La entrada es válida
  validarEntradaUsuario('15001, 15127, 15128'); // La entrada no es válida
  validarEntradaUsuario('15001dsfsdfasdf'); // La entrada no es válida
  validarEntradaUsuario('15001-15002');//La entrada es valida
  validarEntradaUsuario('15001-15002-15003');//La entrada no es valida
  validarEntradaUsuario('15001-15002,');//La entrada no es valida

  
  //NUMEROS DEL 15001-15125
  let expresion = /^15(?:0[0-9][1-9]|1[0-2][0-5])(?:,(?!$)15(?:0[0-9][1-9]|1[0-2][0-5]))*(?:-15(?:0[0-9][1-9]|1[0-2][0-5]))?$/;
  let mensaje = "15001-15125";
  console.log(expresion.test(mensaje))

  //LETRAS QUE ACEPTE MINIMO 6 Y MAXIMO 20 
  let expresion1 = /^[a-zA-Z\s]{6,20}$/;
  let mensaje1 = "QWERTQ";
  console.log(expresion1.test(mensaje1))

  //NUMEROS DEL 1-6637
  let expresion2 = /^(?:[1-9]|[0-9][0-9]{1,2}|[0-5][0-9]{3}|6[0-5][0-9][0-9]|66[0-3][0-7]|66[0-2][0-9])(?:,(?!$)([1-9]|[0-9][0-9]{1,2}|[0-5][0-9]{3}|6[0-5][0-9][0-9]|66[0-3][0-7]|66[0-2][0-9]))*(?:-(?!$)([1-9]|[0-9][0-9]{1,2}|[0-5][0-9]{3}|6[0-5][0-9][0-9]|66[0-3][0-7]|66[0-2][0-9]))?$/;
  let mensaje2 = "1-6599";
  console.log(expresion2.test(mensaje2))

// //let cadena = "ACAMBAY DE RUÍZ CASTAÑEDA. SECCION: 33";
// const numeros = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
// //const contieneNumero = numeros.some(numero => cadena.includes(numero));

// const cadena = "ACAMBAY DE RUÍZ CASTAÑEDA. SECCION: 1";
// const contieneNumero = /[0-9]/.test(cadena);
// console.log(contieneNumero); // true


// console.log(contieneNumero);

let lista = [];
let diccionario = {};

for (let i = 2015; i < 2018; i++) {
  diccionario[i] = {}
  diccionario[i] = {
    label: 'Density of Planet (kg/m3)',
    data: [5427, 5243, 5514, 3933, 1326, 687, 1271, 1638],
    backgroundColor: 'rgba(0, 99, 132, 0.6)',
    borderColor: 'rgba(0, 99, 132, 1)',
    yAxisID: "y-axis-density"
  }
}

// Creamos un array vacío para almacenar los datos convertidos
let chartData = [];

// Recorremos las llaves del objeto original
for (let key in diccionario) {

  // Obtenemos la información de la llave actual
  let info = diccionario[key];

  // Creamos un objeto temporal para almacenar los datos convertidos
  let tempData = {};

  // Añadimos la etiqueta y los datos
  tempData.label = info.label;
  tempData.data = Object.values(info.data);

  // Añadimos los colores
  tempData.backgroundColor = info.backgroundColor;
  tempData.borderColor = info.borderColor;

  // Añadimos el ID del eje y
  tempData.yAxisID = info.yAxisID;

  // Añadimos el objeto temporal al array de datos convertidos
  chartData.push(tempData);
}



console.log(Object.keys(diccionario))
console.log(chartData)