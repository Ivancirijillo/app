/* SELECCION DEL MUNICIPIO DE LA BARRA SUPERIOR */
var click_btn_selec = true;

document.getElementById('btn_selec').addEventListener('click', function() {
    if(click_btn_selec == true){
        document.querySelector(".selec_municipios").style = 'height: 70%; background: rgba(255, 255, 255, 0.94)';
        document.querySelector(".barra_des").style.transform = 'rotate(-90deg)';
        document.querySelector(".opc_municipios").style = 'position: absolute;'
                                +'display: flex; justify-content: center; align-items: center; flex-direction: column;'
        click_btn_selec = false;
    }else if(click_btn_selec == false){
        document.querySelector(".selec_municipios").style = 'height: 22px; background: rgba(255, 255, 255, 0.55)';
        document.querySelector(".barra_des").style.transform = 'rotate(90deg)';
        document.querySelector(".opc_municipios").style.display = 'none';
        click_btn_selec = true;
    }
})

/* ENTRADA DE LA TARJETA EN "INFO" DE TITULO A SUBCONTENEDOR  */
document.getElementById('Map').addEventListener('click', function() {
    des_tarjeta();
})

/* VALIDACION DE LOS INPUT-BOTON CONTINUAR */
var in_filtro_anio = true;
document.getElementById('btnContinuar').addEventListener('click', function () {
    let entrada_anio = document.querySelectorAll("input[name=in_anio]");
    entrada_anio.forEach(item=>{
        if(item.checked)in_filtro_anio=true;
        if(!item.checked)in_filtro_anio=false;
    })
    let entrada_categ = document.querySelectorAll("input[name=in_categ]");
    entrada_categ.forEach(item=>{
        if(item.checked){
            if(in_filtro_anio){
                document.querySelector(".filtro_categoria").style.display = 'none';
                document.querySelector(".filtrado").style.display = 'block';
                if(item.value == 'apoyo'){
                    
                }
                if(item.value == 'deli'){
                    
                }
                if(item.value == 'padron'){
                    
                }
                if(item.value == 'pobreza'){
                    
                }
            }else{
                document.getElementById('v_emergen').classList.remove('v_emergen');
                document.getElementById('v_emergen').classList.add('v_emergen_validado_R');
                setTimeout(() => {
                    document.getElementById('v_emergen').classList.remove('v_emergen_validado_R');
                    document.getElementById('v_emergen').classList.add('v_emergen');
                }, 3000);
            }
        }else{
            document.getElementById('v_emergen').classList.remove('v_emergen');
            document.getElementById('v_emergen').classList.add('v_emergen_validado_R');
            setTimeout(() => {
                document.getElementById('v_emergen').classList.remove('v_emergen_validado_R');
                document.getElementById('v_emergen').classList.add('v_emergen');
            }, 3000);
        }
    })
    
    
})

/* BOTON DE ACERCAMIENTO/ALEJAMIENTO DEL MAPA */
var aumento = 1.0, posicion = 0;

document.getElementById('btnAcercar').addEventListener('click', function() {
    aumento += 0.1;
    document.getElementById('Map').style.transform = 'scale('+aumento+')';
    posicion += 30;
    if(aumento>=1.0){
        document.getElementById('Map').style.top = posicion+'px';
        document.getElementById('Map').style.left = posicion+'px';
    }
})

document.getElementById('btnAlejar').addEventListener('click', function() {
    aumento -= 0.1;
    if(aumento>=1.0){
        document.getElementById('Map').style.transform = 'scale('+aumento+')';
        posicion -= 30;
        if(posicion>=0){
            document.getElementById('Map').style.top = posicion+'px';
            document.getElementById('Map').style.left = posicion+'px';
        }
    }else{
        aumento = 1.0;
    }
})

/* BOTON DE IMPRESION DE LA TARJETA DEL SUBCONTENEDOR */
function imprimirElemento(elemento) {
    var ventana = window.open('', '', 'height=1000,width=1000');
    //ventana.document.write('<html><head><title>' + document.title + '</title>');
    ventana.document.write('<link rel="stylesheet" href="style.css">');
    ventana.document.write('</head><body >');
    ventana.document.write(elemento.innerHTML);
    ventana.document.write('</body></html>');
    ventana.document.close();
    ventana.focus();
    ventana.onload = function() {
        ventana.print();
        ventana.close();
    };
    return true;
}

document.getElementById('btnImprimir').addEventListener("click", function() {
    var div = document.querySelector(".imprimible");
    imprimirElemento(div);
});

/* FUNCIONES PARA LOS MUNICIPIOS */
function tarjeta_out (municipio, path_n){
    document.getElementById(path_n).style.fill = 'lightgreen';
    document.querySelector(".selec_municipios").style = 'height: 22px; rgba(255, 255, 255, 0.55)';
    document.querySelector(".barra_des").style.transform = 'rotate(90deg)';
    document.querySelector(".opc_municipios").style.display = 'none';
    click_btn_selec = true;
    setTimeout(() => {
        //funcion de espera
    document.getElementById(path_n).style = '/*fill: lightgreen;*/';
    }, 5500);
    document.querySelector("#municipio").textContent = "Seleccion - " + municipio
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
}

function des_tarjeta (){
    document.getElementById('enc').classList.remove('active');
    document.getElementById('entrada').classList.remove('active');
    document.querySelector(".titulo").style.display = 'none';
    document.querySelector(".subcontenedor").style.display = 'block';
    document.querySelector(".info").style.height = '85%';
    document.querySelector(".filtro_categoria").style.display = 'block';
    document.querySelector(".filtrado").style.display = 'none';
    document.getElementById('v_emergen').classList.add('v_emergen');
    setTimeout(() => {
        //funcion de espera
        document.getElementById('enc').classList.add('active');
        document.getElementById('entrada').classList.add('active');
    }, 150);
}

/*BOTONES PARTE SUPERIOR - ENTRADA A TARJETA */
document.getElementById('opc_acambay').addEventListener('click', function() {
    tarjeta_out("Acambay", 'path16');
    des_tarjeta();
})

document.getElementById('opc_atlaco').addEventListener('click', function() {
    tarjeta_out("Atlacomulco", 'path42');
    des_tarjeta();
})

/* PATH´S INDIVIDUALES DE SELECCION AL MUNICIPIO */
document.getElementById('path42').addEventListener('click', function() {
    tarjeta_out("Atlacomulco", 'path42');
    des_tarjeta();
})

document.getElementById('path16').addEventListener('click', function() {
    tarjeta_out("Acambay", 'path16');
    des_tarjeta();
})

document.getElementById('path18').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Acolman"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path20').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Aculco"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path22').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Almoloya de Alquisiras"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path24').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Almoloya de Juárez"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path26').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Almoloya del Río"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path28').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Amanalco"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path30').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Amatepec"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path32').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Amecameca"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path34').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Apaxco"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path36').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Atenco"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path38').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Atizapán"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path40').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Atizapán de Zaragoza"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path44').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Atlautla"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path46').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Axapusco"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path48').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Ayapango"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path50').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Calimaya"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path52').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Capulhuac"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path54').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Chalco"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path56').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Chapa de Mota"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path58').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Chapultepec"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path60').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Chiautla"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path62').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Chicoloapan"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path64').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Chiconcuac"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path66').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Chimalguacán"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path68').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Coacalco de Berriozábal"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path70').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Coatepec Harinas"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path72').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Cocotitlán"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path74').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Coyotepec"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path76').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Cuautitlán"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path78').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Cuautitlán Izcalli"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path80').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Donato Guerra"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path82').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Ecatepec de Morelos"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path84').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Ecatzingo"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path86').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Huehuetoca"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path88').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Hueypoxtla"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path90').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Huixquilucan"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path92').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Isidro Fabela"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path94').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Ixtapaluca"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path96').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Ixtapan de la Sal"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path98').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Ixtapan del Oro"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path100').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Ixtlahuaca"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path102').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Jaltenco"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path104').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Tonanitla"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path106').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Jilotepec"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path108').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Jilotzingo"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path110').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Jiquipilco"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path112').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Jocotitlán"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path114').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Joquicingo"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path116').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Juchitepec"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path118').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Lerma"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path120').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Malinalco"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path122').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Melcor Ocampo"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path124').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Metepec"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path126').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Mexicaltzingo"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path128').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Morelos"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path130').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Naucalpan de juarez"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path132').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Nextlalpan"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path134').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Nezahualcoyotl"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path136').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Nicolas Romero"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path138').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Nopaltepec"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path140').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Ocoyocoac"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path142').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Ocuilan"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path144').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - El Oro"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path146').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Otumba"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path148').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Otzoloapan"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path150').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Otzolotepec"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path152').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Ozumba"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path154').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Papalotla"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path156').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - La Paz"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path158').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Polotitlán"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path160').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Rayón"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path162').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - San Antonio la Isla"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path164').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - San Felipe del Progreso"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path166').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - San Martín de las Pirámides"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path168').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - San Mateo Atenco"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path170').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - San Simón de Guerrero"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path172').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Santo Tomás"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path174').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Soyaniquilpan de Juárez"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path176').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Sultepec"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path178').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Tecámac"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path180').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Tejupilco"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path182').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Temamatla"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path184').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Temascalapa"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path186').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Temascalcingo"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path188').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Temascaltepec"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path190').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Temoaya"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path192').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Tenancingo"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path194').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Tenango del Aire"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path196').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Tenango del Valle"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path198').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Teoloyucan"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path200').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Teotihuacán"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path202').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Tepetlaoxtoc"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path204').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Tepetlixpa"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path206').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Tepotzoplán"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path208').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Tequixquiac"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path210').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Texcaltitlán"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path212').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Texcalyacac"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path214').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Texcoco"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path216').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Tezoyuca"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path218').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Tianguistenco"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path220').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Timilpan"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path222').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Tlalmanalco"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path224').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Tlalnepantla de Baz"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path226').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Tlalnepantla de Baz"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path228').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Tlatlaya"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path230').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion -Toluca"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path232').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion -Tonatico"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path234').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Tultepec"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path236').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Tultitlán"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path238').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Tultitlán"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path240').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Valle de Bravo"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path242').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Valle de Chalco Solidaridad"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path244').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Villa de Allende"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path246').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Villa del Carbón"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path248').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Villa Guerrero"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path250').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Villa Victoria"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path252').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Xalatlaco"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path254').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Xonacatlán"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path256').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Zacazonapan"
    document.querySelector("#habitantes").textContent = "93,718 habitantes, del Censo de Población 2010"
})

document.getElementById('path258').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Zacualpan"
    document.querySelector("#habitantes").textContent = "##"
})

document.getElementById('path260').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Zinacantepec"
    document.querySelector("#habitantes").textContent = "##"
})

document.getElementById('path262').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Zumpahuacán"
    document.querySelector("#habitantes").textContent = "##"
})
document.getElementById('path264').addEventListener('click', function() {
    document.querySelector("#municipio").textContent = "Seleccion - Zumpango"
    document.querySelector("#habitantes").textContent = "##"
})
