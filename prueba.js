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
    const expresionRegular = /^15(?:0[0-9][1-9]|1[0-2][0-5])(?:,(?!$)15(?:0[0-9][1-9]|1[0-2][0-5]))*(?:-15(?:0[0-9][1-9]|1[0-2][0-5]))?$/;
  
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

  //NUMEROS DEL 1-6498
  let expresion2 = /^(?:[1-9]|[0-9][0-9]{1,2}|[0-5][0-9]{3}|6[0-4][0-9][0-9]|649[0-8])(?:,(?!$)([1-9]|[0-9][0-9]{1,2}|[0-5][0-9]{3}|6[0-4][0-9][0-9]|649[0-8]))*(?:-(?!$)([1-9]|[0-9][0-9]{1,2}|[0-5][0-9]{3}|6[0-4][0-9][0-9]|649[0-8]))?$/;
  let mensaje2 = "1-6500";
  console.log(expresion2.test(mensaje2))