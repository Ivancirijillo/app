var tablas = []; // tablas generadas
var indiceTablaActual = 0; // Índice de la tabla actualmente visible

function mostrarVistaPrevia(event) {
    var inputContainer = document.getElementById("inputContainer");
    if (event.target.files.length > 0) {
        inputContainer.style.display = "block";
    } else {
        inputContainer.style.display = "none";
    }

    var archivo = event.target.files[0];
    var lector = new FileReader();

    lector.onload = function (e) {
        var contenido = e.target.result;
        var libro = XLSX.read(contenido, { type: 'binary' });
        var contenedor = document.getElementById("vista-previa");

        contenedor.innerHTML = ""; // limpiar el contenedor
        tablas = []; // borrar el array de tablas

        libro.SheetNames.forEach(function (nombreHoja) {
            var hoja = libro.Sheets[nombreHoja];
            var datos = XLSX.utils.sheet_to_json(hoja, { header: 1 });
            var tabla = "<table>";
            var encabezado = datos[0]; // Obtener la primera fila como encabezado

            // Generar el encabezado de la tabla
            tabla += "<thead><tr>";
            for (var i = 0; i < encabezado.length; i++) {
                tabla += "<th>" + encabezado[i] + "</th>";
            }
            tabla += "</tr></thead>";

            // Generar filas y columnas de la tabla (a partir de la segunda fila)
            for (var i = 1; i < datos.length; i++) {
                tabla += "<tr>";
                for (var j = 0; j < datos[i].length; j++) {
                    tabla += "<td>" + datos[i][j] + "</td>";
                }
                tabla += "</tr>";
            }

            tabla += "</table>";
            tablas.push(tabla); // Agregar la tabla al array de tablas
        });

        if (tablas.length > 0) {
            mostrarTablaActual();
            mostrarBotonesTablas(libro.SheetNames);
        }
    };

    lector.readAsBinaryString(archivo);    
}

function mostrarTablaActual() {
    var contenedor = document.getElementById("vista-previa");
    contenedor.innerHTML = tablas[indiceTablaActual];
    contenedor.style.display = "block";
}

function mostrarBotonesTablas(nombresHojas) {
    var contenedorBotones = document.getElementById("contenedor-botones");
    contenedorBotones.innerHTML = "";

    // Generar botones para cambiar de tabla
    nombresHojas.forEach(function (nombreHoja, indice) {
        var boton = document.createElement("button");
        boton.textContent = nombreHoja;
        boton.classList.add("boton");

        // Agregar la clase "ultimo-boton" al último botón generado
        if (indice === nombresHojas.length - 1) {
            boton.classList.add("ultimo-boton");
        }

        boton.addEventListener("click", cambiarTabla.bind(null, indice));
        contenedorBotones.appendChild(boton);
    });
}

function cambiarTabla(indice) {
    indiceTablaActual = indice;
    mostrarTablaActual();
}


// cargar archivo

'use strict';

;(function (document, window, index) {
    var inputs = document.querySelectorAll('.inputfile');
    Array.prototype.forEach.call(inputs, function (input) {
        var label = input.nextElementSibling,
            labelVal = label.innerHTML;

        input.addEventListener('change', function (e) {
            var fileName = '';
            if (this.files && this.files.length === 1) {
                fileName = e.target.value.split('\\').pop();
                label.querySelector('span').innerHTML = fileName;
            } else {
                label.innerHTML = labelVal;
            }

            var styles = window.getComputedStyle(input);
            console.log(styles); // Imprime las propiedades CSS en la consola del navegador
        });
    });
}(document, window, 0));

// Función para ocultar el pop-up 
setTimeout(function(){
    document.getElementById('popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}, 3000);


// Obtener todos los botones
const buttons = document.querySelectorAll('.boton');

// Agregar el evento click a cada botón
buttons.forEach(button => {
  button.addEventListener('click', () => {
    // Remover la clase 'selected' de todos los botones
    buttons.forEach(button => {
      button.classList.remove('selected');
    });
    
    // Agregar la clase 'selected' al botón seleccionado
    button.classList.add('selected');
  });
});


//funciones de la ventana flotante
function mostrarVentanaFlotante() {
    document.getElementById("ventanaFlotante").style.display = "flex";
  }
function cerrarVentanaFlotante() {
  document.getElementById("ventanaFlotante").style.display = "none";
}

// funcion boton salir
function json_wind(mode){
    window.location.href = mode;
}
document.getElementById("logoutBtn").addEventListener("click", function() {
    json_wind("/logout");
})