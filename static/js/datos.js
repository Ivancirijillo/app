/* SELECCION DEL MUNICIPIO DE LA BARRA SUPERIOR */
var click_btn_selec = true;

function ocultar_superior(){
    document.querySelector(".selec_municipios").style = 'height: 22px; background: rgba(255, 255, 255, 0.55)';
    document.querySelector(".barra_des").style.transform = 'rotate(90deg)';
    document.querySelector(".opc_municipios").style.display = 'none';
    document.getElementById('con_cortina').style.visibility = 'hidden';
    click_btn_selec = true;
}

document.getElementById('btn_selec').addEventListener('click', function() {
    if(click_btn_selec == true){
        document.querySelector(".selec_municipios").style = 'height: 70%; background: rgba(255, 255, 255, 0.94)';
        document.querySelector(".barra_des").style.transform = 'rotate(-90deg)';
        document.querySelector(".opc_municipios").style = 'position: absolute;'
                                +'display: flex; justify-content: center; align-items: center; flex-direction: column;'
        document.getElementById('con_cortina').style.visibility = 'visible';
        click_btn_selec = false;
    }else if(click_btn_selec == false){
        ocultar_superior();
    }
})

document.getElementById('con_cortina').addEventListener('click', function(){
    ocultar_superior();
})

/*BOTONES DE MENU*/
document.getElementById('btn_filtro').addEventListener('click', function(){
    document.querySelector(".filtro_categoria").style.display = 'flex';
    document.querySelector(".btn_regresar").style.visibility = 'visible';
    document.getElementById('menu').style.display='none';
})

/*FUNCIONES PARA LA INFORMACIÓN DE LAS TABLAS */

function tabla_crear(template, tablas, cabecera){
    direccion = cabecera[cabecera.length-1];
    if(direccion == "V"){
        for(var i = 0; i < tablas.length ; i++){
            for (let j = 0; j < tablas[i].length; j++) {
                if(tablas[i][j] == null){
                    template += '<tr><th>'+cabecera[j]+'<td>-</td>';
                }else{
                    template += '<tr><th>'+cabecera[j]+'</th><td>'+tablas[i][j]+'</td></tr>';
                }
            }
        }
    }else{
        template += '<tr>';
        for(var i = 0; i < (cabecera.length)-1; i++){
            template += '<th>'+cabecera[i]+'</th>';
        }
        template += '</tr>';
        for(var i = 0; i < tablas.length ; i++){
            template += '<tr>';
            for (let j = 0; j < tablas[i].length; j++) {
                if(tablas[i][j] == null){
                    template += '<td>-</td>';
                }else{
                    template += '<td>'+tablas[i][j]+'</td>';
                }
            }
            template += '</tr>';
            if(i==8) i = tablas.length
        }
    }
    if(tablas.length == 0) template = '<tr><td><h2> Datos inexistentes </h2></td></tr>';
    return template;
}

function enviar_json (mode, cabecera){
    let data = {
        tipo_c: tipo,
        year: anio_selec,
        id: id_municipio,
        modo: mode
    }
    fetch('/impresiones', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        let tablas = data["consulta"];
        if(mode != "impresion"){
            var template = '';
            template = tabla_crear(template, tablas, cabecera);
            document.querySelector(".tableDatos").innerHTML = template;
        }
    });
}

/* VALIDACION DE LOS INPUT-BOTON CONTINUAR */
var id_municipio = "", anio_selec, tipo;
document.getElementById('btnContinuar').addEventListener('click', function () {
    let entrada_anio = document.querySelectorAll("input[name=in_anio]");
    entrada_anio.forEach(item=>{
        if(item.checked) anio_selec = item.value;
    })
    let entrada_categ = document.querySelectorAll("input[name=in_categ]");
    entrada_categ.forEach(item=>{
        if(item.checked){
            if(anio_selec >= 2020 && anio_selec <= 2022){
                document.querySelector(".filtro_categoria").style.display = 'none';
                document.querySelector(".filtrado").style.display = 'block';
                document.querySelector(".btn_regresar").style.visibility = 'visible';

                var cabecera_consul_A = new Array ("NombreA", "NoApoyo", " ");
                var cabecera_consul_D = new Array ("DelitosAI", "Homicidios", "Feminicidios", "Secuestros", 
                                                    "DespT", "Robo", "RoboT", "V");
                var cabecera_consul_Pa = new Array ("PHombres", "PMujeres", "PTotal", "LNHombres", 
                                                    "LNMujeres", "LNTotal", "V");
                var cabecera_consul_Po = new Array ("Pobreza", "PobExt", "PobMod", "RezagoEd", 
                                                    "CarSS", "CarCalidadViv", "CarAlim", "PIB", "UET", "V");
                const fil_cabecera = {
                    'apoyo': cabecera_consul_A,
                    'deli': cabecera_consul_D,
                    'padron': cabecera_consul_Pa,
                    'pobreza': cabecera_consul_Po
                }
                tipo = item.value;
                enviar_json(" ", fil_cabecera[item.value]);
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

document.getElementById('btnImprimir').addEventListener('click', function() {
    enviar_json("impresion", " ")
    window.open("/pdf","_blank")
});

document.getElementById('btn_reporte').addEventListener('click', function(){
    tipo ='general';
    anio_selec = 2022
    enviar_json("impresion", " ");
    window.open("/pdf","_blank")
})

/* FUNCIONES PARA LOS MUNICIPIOS */
var path_anterior = ' ';
var nom_munic = ' ';
function tarjeta_out (nom_municipio, path_n){
    ocultar_superior();

<<<<<<< HEAD
    if(path_anterior != ' ') document.getElementById(path_anterior).style.fill = '#c5c5c5';
    document.getElementById(path_n).style.fill = 'var(--color)';
=======
    if(path_anterior != ' ') document.getElementById(path_anterior).style = '/*fill: #D97700;*/';
    document.getElementById(path_n).style.fill = '#D97700';
>>>>>>> 667209f22852f05bed1380e17a74e7cc7ef388ee

    document.getElementById('municipio').textContent = "Selección - " + nom_municipio
    des_tarjeta();
    nom_munic = nom_municipio;
    path_anterior = path_n;
}

function des_tarjeta (){
    document.getElementById('enc').classList.remove('active');
    document.getElementById('entrada').classList.remove('active');
    document.querySelector(".titulo").style.display = 'none';
    document.querySelector(".subcontenedor").style.display = 'block';
    document.getElementById('menu').style.display='flex';
    document.getElementById('filtro_categoria').style.display='none';
    document.querySelector(".info").style.height = '85%';
    document.querySelector(".filtrado").style.display = 'none';
    document.getElementById('v_emergen').classList.add('v_emergen');
    document.querySelector(".btn_regresar").style.visibility = 'hidden';
    setTimeout(() => {
        //funcion de espera
        document.getElementById('enc').classList.add('active');
        document.getElementById('entrada').classList.add('active');
    }, 150);
}

/* BOTON DE REGRESAR AL FILTRO INPUT */
document.getElementById('btn_regresar').addEventListener('click', function(){
    tarjeta_out(nom_munic, path_anterior);
})

/* ---------------------------------------------------------------------------*/
/* ---------------------------------------------------------------------------*/
/* ---------------------------------------------------------------------------*/

/*BOTONES PARTE SUPERIOR - ENTRADA A TARJETA */

document.getElementById('opc_atlaco').addEventListener('click', function() {
    tarjeta_out("Atlacomulco", 'path42');
    id_municipio = "15014";
})

document.getElementById('opc_acambay').addEventListener('click', function() {
    tarjeta_out("Acambay", 'path16');
    id_municipio = "15001";
})

document.getElementById('opc_Acol').addEventListener('click', function() {
    tarjeta_out("Acolman", 'path18');
    id_municipio = "15002";
})

document.getElementById('opc_Acul').addEventListener('click', function() {
    tarjeta_out("Aculco", 'path20');
    id_municipio = "15003";
})

document.getElementById('opc_AlmodA').addEventListener('click', function() {
    tarjeta_out("Almoloya de Alquisiras", 'path22');
    id_municipio = "15004";
})

document.getElementById('opc_AlmodJ').addEventListener('click', function() {
    tarjeta_out("Almoloya de Juárez", 'path24');
    id_municipio = "15005";
})

document.getElementById('opc_AlmodR').addEventListener('click', function() {
    tarjeta_out("Almoloya del Río", 'path26');
    id_municipio = "15006";
})

document.getElementById('opc_Amana').addEventListener('click', function() {
    tarjeta_out("Amanalco", 'path28');
    id_municipio = "15007";
})

document.getElementById('opc_Amate').addEventListener('click', function() {
    tarjeta_out("Amatepec", 'path30');
    id_municipio = "15008";
})

document.getElementById('opc_Amecame').addEventListener('click', function() {
    tarjeta_out("Amecameca", 'path32');
    id_municipio = "15009";
})

document.getElementById('opc_Apaxco').addEventListener('click', function() {
    tarjeta_out("Apaxco", 'path34');
    id_municipio = "15010";
})

document.getElementById('opc_Atenco').addEventListener('click', function() {
    tarjeta_out("Atenco", 'path36');
    id_municipio = "15011";
})

document.getElementById( 'opc_Atiza').addEventListener('click', function() {
    tarjeta_out("Atizapán", 'path38');
    id_municipio = "15012";
})

document.getElementById('opc_AtizadZ').addEventListener('click', function() {
    tarjeta_out("Atizapán de Zaragoza", 'path40');
    id_municipio = "15013";
})

document.getElementById('opc_Atlau').addEventListener('click', function() {
    tarjeta_out("Atlautla", 'path44');
    id_municipio = "15015";
})

document.getElementById('opc_Axapus').addEventListener('click', function() {
    tarjeta_out("Axapusco", 'path46');
    id_municipio = "15016";
})

document.getElementById('opc_Ayapan').addEventListener('click', function() {
    tarjeta_out("Ayapango", 'path48');
    id_municipio = "15017";
})

document.getElementById('opc_Calima').addEventListener('click', function() {
    tarjeta_out("Calimaya", 'path50');
    id_municipio = "15018";
})

document.getElementById('opc_Capulhu').addEventListener('click', function() {
    tarjeta_out("Capulhuac", 'path52');
    id_municipio = "15019";
})

document.getElementById('opc_Chalco').addEventListener('click', function() {
    tarjeta_out("Chalco", 'path54');
    id_municipio = "15025";
})

document.getElementById('opc_Chap').addEventListener('click', function() {
    tarjeta_out("Chapa de Mota", 'path56');
    id_municipio = "15026";
})

document.getElementById('opc_Chapul').addEventListener('click', function() {
    tarjeta_out("Chapultepec", 'path58');
    id_municipio = "15027";
})

document.getElementById('opc_Chia').addEventListener('click', function() {
    tarjeta_out("Chiautla", 'path60');
    id_municipio = "15028";
})

document.getElementById('opc_Chico').addEventListener('click', function() {
    tarjeta_out("Chicoloapan", 'path62');
    id_municipio = "15029";
})

document.getElementById('opc_Chin').addEventListener('click', function() {
    tarjeta_out("Chiconcuac", 'path64');
    id_municipio = "15030";
})

document.getElementById('opc_Chima').addEventListener('click', function() {
    tarjeta_out("Chimalhuacán", 'path66');
    id_municipio = "15031";
})

document.getElementById('opc_Coacal').addEventListener('click', function() {
    tarjeta_out("Coacalco de Berriozábal", 'path68');
    id_municipio = "15020";
})

document.getElementById('opc_Coate').addEventListener('click', function() {
    tarjeta_out("Coatepec Harinas", 'path70');
    id_municipio = "15021";
})

document.getElementById('opc_Coco').addEventListener('click', function() {
    tarjeta_out("Cocotitlán", 'path72');
    id_municipio = "15022";
})

document.getElementById('opc_Coyo').addEventListener('click', function() {
    tarjeta_out("Coyotepec", 'path74');
    id_municipio = "15023";
})

document.getElementById('opc_Cuau').addEventListener('click', function() {
    tarjeta_out("Cuautitlán", 'path76');
    id_municipio = "15024";
})

document.getElementById('opc_Cuauti').addEventListener('click', function() {
    tarjeta_out("Cuautitlán Izcalli", 'path78');
    id_municipio = "15121";
})

document.getElementById('opc_DondG').addEventListener('click', function() {
    tarjeta_out("Donato Guerra", 'path80');
    id_municipio = "15032";
})

document.getElementById('opc_Ecat').addEventListener('click', function() {
    tarjeta_out("Ecatepec de Morelos", 'path82');
    id_municipio = "15033";
})

document.getElementById('opc_Ecatz').addEventListener('click', function() {
    tarjeta_out("Ecatzingo", 'path84');
    id_municipio = "15034";
})

document.getElementById('opc_Huehue').addEventListener('click', function() {
    tarjeta_out("Huehuetoca", 'path86');
    id_municipio = "15035";
})

document.getElementById('opc_Huey').addEventListener('click', function() {
    tarjeta_out("Hueypoxtla", 'path88');
    id_municipio = "15036";
})

document.getElementById('opc_Huix').addEventListener('click', function() {
    tarjeta_out("Huixquilucan", 'path90');
    id_municipio = "15037";
})

document.getElementById('opc_Isid').addEventListener('click', function() {
    tarjeta_out("Isidro Fabela", 'path92');
    id_municipio = "15038";
})

document.getElementById('opc_Ixta').addEventListener('click', function() {
    tarjeta_out("Ixtapaluca", 'path94');
    id_municipio = "15039";
})

document.getElementById('opc_IxtapanS').addEventListener('click', function() {
    tarjeta_out("Ixtapan de la Sal", 'path96');
    id_municipio = "15040";
})

document.getElementById('opc_IxtapanO').addEventListener('click', function() {
    tarjeta_out("Ixtapan del Oro", 'path98');
    id_municipio = "15041";
})

document.getElementById('opc_ixtla').addEventListener('click', function() {
    tarjeta_out("Ixtlahuaca", 'path100');
    id_municipio = "15042";
})

document.getElementById('opc_Jalt').addEventListener('click', function() {
    tarjeta_out("Jaltenco", 'path102');
    id_municipio = "15044";
})

document.getElementById('opc_Tonan').addEventListener('click', function() {
    tarjeta_out("Tonanitla", 'path104');
    id_municipio = "15125";
})

document.getElementById('opc_Jilo').addEventListener('click', function() {
    tarjeta_out("Jilotepec", 'path106');
    id_municipio = "15045";
})

document.getElementById('opc_Jilot').addEventListener('click', function() {
    tarjeta_out("Jilotzingo", 'path108');
    id_municipio = "15046";
})

document.getElementById('opc_Jiqui').addEventListener('click', function() {
    tarjeta_out("Jiquipilco", 'path110');
    id_municipio = "15047";
})

document.getElementById('opc_Joco').addEventListener('click', function() {
    tarjeta_out("Jocotitlán", 'path112');
    id_municipio = "15048";
})

document.getElementById('opc_Joqui').addEventListener('click', function() {
    tarjeta_out("Joquicingo", 'path114');
    id_municipio = "15049";
})

document.getElementById('opc_Juchi').addEventListener('click', function() {
    tarjeta_out("Juchitepec", 'path116');
    id_municipio = "15050";
})

document.getElementById('opc_Lerma').addEventListener('click', function() {
    tarjeta_out("Lerma", 'path118');
    id_municipio = "15051";
})

document.getElementById('opc_Mali').addEventListener('click', function() {
    tarjeta_out("Malinalco", 'path120');
    id_municipio = "15052";
})

document.getElementById('opc_MelchO').addEventListener('click', function() {
    tarjeta_out("Melchor Ocampo", 'path122');
    id_municipio = "15053";
})

document.getElementById('opc_Metep').addEventListener('click', function() {
    tarjeta_out("Metepec", 'path124');
    id_municipio = "15054";
})

document.getElementById('opc_Mexi').addEventListener('click', function() {
    tarjeta_out("Mexicaltzingo", 'path126');
    id_municipio = "15055";
})

document.getElementById('opc_Mor').addEventListener('click', function() {
    tarjeta_out("Morelos", 'path128');
    id_municipio = "15056";
})

document.getElementById('opc_NauJ').addEventListener('click', function() {
    tarjeta_out("Naucalpan de Juárez", 'path130');
    id_municipio = "15057";
})

document.getElementById('opc_Next').addEventListener('click', function() {
    tarjeta_out("Nextlalpan", 'path132');
    id_municipio = "15059";
})

document.getElementById('opc_Neza').addEventListener('click', function() {
    tarjeta_out("Nezahualcoyotl", 'path134');
    id_municipio = "15058";
})

document.getElementById('opc_NicoR').addEventListener('click', function() {
    tarjeta_out("Nicolas Romero", 'path136');
    id_municipio = "15060";
})

document.getElementById('opc_Nopal').addEventListener('click', function() {
    tarjeta_out("Nopaltepec", 'path138');
    id_municipio = "15061";
})

document.getElementById('opc_Ocoyoa').addEventListener('click', function() {
    tarjeta_out("Ocoyoacac", 'path140');
    id_municipio = "15062";
})

document.getElementById('opc_Ocuilan').addEventListener('click', function() {
    tarjeta_out("Ocuilan", 'path142');
    id_municipio = "15063";
})

document.getElementById('opc_ElO').addEventListener('click', function() {
    tarjeta_out("El Oro", 'path144');
    id_municipio = "15064";
})

document.getElementById('opc_Otumba').addEventListener('click', function() {
    tarjeta_out("Otumba", 'path146');
    id_municipio = "15065";
})

document.getElementById('opc_Otzo').addEventListener('click', function() {
    tarjeta_out("Otzoloapan", 'path148');
    id_municipio = "15066";
})

document.getElementById('opc_Otzol').addEventListener('click', function() {
    tarjeta_out("Otzolotepec", 'path150');
    id_municipio = "15067";
})

document.getElementById('opc_Ozumba').addEventListener('click', function() {
    tarjeta_out("Ozumba", 'path152');
    id_municipio = "15068";
})

document.getElementById('opc_Papal').addEventListener('click', function() {
    tarjeta_out("Papalotla", 'path154');
    id_municipio = "15069";
})

document.getElementById('opc_LaPaz').addEventListener('click', function() {
    tarjeta_out("La Paz", 'path156');
    id_municipio = "15070";
})

document.getElementById('opc_Polo').addEventListener('click', function() {
    tarjeta_out("Polotitlán", 'path158');
    id_municipio = "15071";
})

document.getElementById('opc_Rayon').addEventListener('click', function() {
    tarjeta_out("Rayón", 'path160');
    id_municipio = "15072";
})

document.getElementById('opc_SanAn').addEventListener('click', function() {
    tarjeta_out("San Antonio la Isla", 'path162');
    id_municipio = "15073";
})

document.getElementById('opc_SanFe').addEventListener('click', function() {
    tarjeta_out("San Felipe del Progreso", 'path164');
    id_municipio = "15074";
})

document.getElementById('opc_SanMar').addEventListener('click', function() {
    tarjeta_out("San Martín de las Pirámides", 'path166');
    id_municipio = "15075";
})

document.getElementById('opc_SanMateo').addEventListener('click', function() {
    tarjeta_out("San Mateo Atenco", 'path168');
    id_municipio = "15076";
})

document.getElementById('opc_SanSim').addEventListener('click', function() {
    tarjeta_out("San Simón de Guerrero", 'path170');
    id_municipio = "15077";
})

document.getElementById('opc_SantoTom').addEventListener('click', function() {
    tarjeta_out("Santo Tomás", 'path172');
    id_municipio = "15078";
})

document.getElementById('opc_Soya').addEventListener('click', function() {
    tarjeta_out("Soyaniquilpan de Juárez", 'path174');
    id_municipio = "15079";
})

document.getElementById('opc_Sulte').addEventListener('click', function() {
    tarjeta_out("Sultepec", 'path176');
    id_municipio = "15080";
})

document.getElementById('opc_Teca').addEventListener('click', function() {
    tarjeta_out("Tecámac", 'path178');
    id_municipio = "15081";
})

document.getElementById('opc_Teju').addEventListener('click', function() {
    tarjeta_out("Tejupilco", 'path180');
    id_municipio = "15082";
})

document.getElementById('opc_Temama').addEventListener('click', function() {
    tarjeta_out("Temamatla", 'path182');
    id_municipio = "15083";
})

document.getElementById('opc_Temas').addEventListener('click', function() {
    tarjeta_out("Temascalapa", 'path184');
    id_municipio = "15084";
})

document.getElementById('opc_TemasC').addEventListener('click', function() {
    tarjeta_out("Temascalcingo", 'path186');
    id_municipio = "15085";
})

document.getElementById('opc_TemasCal').addEventListener('click', function() {
    tarjeta_out("Temascaltepec", 'path188');
    id_municipio = "15086";
})

document.getElementById('opc_Temoaya').addEventListener('click', function() {
    tarjeta_out("Temoaya", 'path190');
    id_municipio = "15087";
})

document.getElementById('opc_Tenan').addEventListener('click', function() {
    tarjeta_out("Tenancingo", 'path192');
    id_municipio = "15088";
})

document.getElementById('opc_TenanA').addEventListener('click', function() {
    tarjeta_out("Tenancingo del Aire", 'path194');
    id_municipio = "15089";
})

document.getElementById('opc_TenanV').addEventListener('click', function() {
    tarjeta_out("Tenango del Valle", 'path196');
    id_municipio = "15090";
})

document.getElementById('opc_Teol').addEventListener('click', function() {
    tarjeta_out("Teoloyucan", 'path198');
    id_municipio = "15091";
})

document.getElementById('opc_Teoti').addEventListener('click', function() {
    tarjeta_out("Teotihuacán", 'path200');
    des_tarjeta();
    id_municipio = "15092";
})

document.getElementById('opc_Tepetla').addEventListener('click', function() {
    tarjeta_out("Tepetlaoxtoc", 'path202');
    id_municipio = "15093";
})

document.getElementById('opc_Tepet').addEventListener('click', function() {
    tarjeta_out("Tepetlixpa", 'path204');
    id_municipio = "15094";
})

document.getElementById('opc_Tepoz').addEventListener('click', function() {
    tarjeta_out("Tepotzotlán", 'path206');
    id_municipio = "15095";
})

document.getElementById('opc_Tequix').addEventListener('click', function() {
    tarjeta_out("Tequixquiac", 'path208');
    id_municipio = "15096";
})

document.getElementById('opc_Texcal').addEventListener('click', function() {
    tarjeta_out("Texcaltitlán", 'path210');
    id_municipio = "15097";
})

document.getElementById('opc_Texcalya').addEventListener('click', function() {
    tarjeta_out("Texcalyacac", 'path212');
    id_municipio = "15098";
})

document.getElementById('opc_Texcoco').addEventListener('click', function() {
    tarjeta_out("Texcoco", 'path214');
    id_municipio = "15099";
})

document.getElementById('opc_Tezoy').addEventListener('click', function() {
    tarjeta_out("Tezoyuca", 'path216');
    id_municipio = "15100";
})

document.getElementById('opc_Tianguis').addEventListener('click', function() {
    tarjeta_out("Tianguistenco", 'path218');
    id_municipio = "15101";
})

document.getElementById('opc_Timilpan').addEventListener('click', function() {
    tarjeta_out("Timilpan", 'path220');
    id_municipio = "15102";
})

document.getElementById('opc_Tlalma').addEventListener('click', function() {
    tarjeta_out("Tlalmanalco", 'path222');
    id_municipio = "15103";
})

document.getElementById('opc_Tlalne').addEventListener('click', function() {
    tarjeta_out("Tlalnepantla de Baz", 'path224');
    id_municipio = "15104";
})

document.getElementById('opc_Tlatla').addEventListener('click', function() {
    tarjeta_out("Tlatlaya", 'path228');
    id_municipio = "15105";
})

document.getElementById('opc_Toluca').addEventListener('click', function() {
    tarjeta_out("Toluca", 'path230');
    id_municipio = "15106";
})

document.getElementById('opc_Tonatico').addEventListener('click', function() {
    tarjeta_out("Tonatico", 'path232');
    id_municipio = "15107";
})

document.getElementById('opc_Tultepec').addEventListener('click', function() {
    tarjeta_out("Tultepec", 'path234');
    id_municipio = "15108";
})

document.getElementById('opc_Tulti').addEventListener('click', function() {
    tarjeta_out("Tultitlán", 'path236');
    id_municipio = "15109";
})

document.getElementById('opc_Tulti').addEventListener('click', function() {
    tarjeta_out("Tultitlán", 'path238');
    id_municipio = "15109";
})

document.getElementById('opc_ValleB').addEventListener('click', function() {
    tarjeta_out("Valle de Bravo", 'path240');
    id_municipio = "15110";
})

document.getElementById('opc_ValleS').addEventListener('click', function() {
    tarjeta_out("Valle de Chalco Solidaridad", 'path242');
    id_municipio = "15122";
})

document.getElementById('opc_VillaA').addEventListener('click', function() {
    tarjeta_out("Villa de Allende", 'path244');
    id_municipio = "15111";
})

document.getElementById('opc_VillaC').addEventListener('click', function() {
    tarjeta_out("Villa del Carbón", 'path246');
    id_municipio = "15112";
})

document.getElementById('opc_VillaG').addEventListener('click', function() {
    tarjeta_out("Villa Guerrero", 'path248');
    id_municipio = "15113";
})

document.getElementById('opc_VillaV').addEventListener('click', function() {
    tarjeta_out("Villa Victoria", 'path250');
    id_municipio = "15114";
})

document.getElementById('opc_Xala').addEventListener('click', function() {
    tarjeta_out("Xalatlaco", 'path252');
    id_municipio = "15043";
})

document.getElementById('opc_Xona').addEventListener('click', function() {
    tarjeta_out("Xonacatlán", 'path254');
    id_municipio = "15115";
})

document.getElementById('opc_Zacanzo').addEventListener('click', function() {
    tarjeta_out("Zacanzonapán", 'path256');
    id_municipio = "15116";
})

document.getElementById('opc_Zacua').addEventListener('click', function() {
    tarjeta_out("Zacualpan", 'path258');
    id_municipio = "15117";
})

document.getElementById('opc_Zinacan').addEventListener('click', function() {
    tarjeta_out("Zinacantepec", 'path260');
    id_municipio = "15118";
})

document.getElementById('opc_Zumpa').addEventListener('click', function() {
    tarjeta_out("Zumpahuacán", 'path262');
    id_municipio = "15119";
})

document.getElementById('opc_Zumpan').addEventListener('click', function() {
    tarjeta_out("Zumpango", 'path264');
    id_municipio = "15120";
})

document.getElementById('opc_SanJose').addEventListener('click', function() {
    tarjeta_out("San Josè del Rincòn", 'path266');
    id_municipio = "15124";
})

document.getElementById('opc_Luvi').addEventListener('click', function() {
    tarjeta_out("Luvianos", 'path268');
    id_municipio = "15123";
})

/* PATH´S INDIVIDUALES DE SELECCION AL MUNICIPIO */ //opc_atlaco

document.getElementById('path42').addEventListener('click', function() {
    tarjeta_out("Atlacomulco", 'path42');
    id_municipio = "15014";
})

document.getElementById('path16').addEventListener('click', function() {
    tarjeta_out("Acambay", 'path16');
    id_municipio = "15001";
})

document.getElementById('path18').addEventListener('click', function() {
    tarjeta_out("Acolman", 'path18');
    id_municipio = "15002";
})

document.getElementById('path20').addEventListener('click', function() {
    tarjeta_out("Aculco", 'path20');
    id_municipio = "15003";
})

document.getElementById('path22').addEventListener('click', function() {
    tarjeta_out("Almoloya de Alquisiras", 'path22');
    id_municipio = "15004";
})

document.getElementById('path24').addEventListener('click', function() {
    tarjeta_out("Almoloya de Juárez", 'path24');
    id_municipio = "15005";
})

document.getElementById('path26').addEventListener('click', function() {
    tarjeta_out("Almoloya del Río", 'path26');
    id_municipio = "15006";
})

document.getElementById('path28').addEventListener('click', function() {
    tarjeta_out("Amanalco", 'path28');
    id_municipio = "15007";
})

document.getElementById('path30').addEventListener('click', function() {
    tarjeta_out("Amatepec", 'path30');
    id_municipio = "15008";
})

document.getElementById('path32').addEventListener('click', function() {
    tarjeta_out("Amecameca", 'path32');
    id_municipio = "15009";
})

document.getElementById('path34').addEventListener('click', function() {
    tarjeta_out("Apaxco", 'path34');
    id_municipio = "15010";
})

document.getElementById('path36').addEventListener('click', function() {
    tarjeta_out("Atenco", 'path36');
    id_municipio = "15011";
})

document.getElementById('path38').addEventListener('click', function() {
    tarjeta_out("Atizapán", 'path38');
    id_municipio = "15012";
})

document.getElementById('path40').addEventListener('click', function() {
    tarjeta_out("Atizapán de Zaragoza", 'path40');
    id_municipio = "15013";
})

document.getElementById('path44').addEventListener('click', function() {
    tarjeta_out("Atlautla", 'path44');
    id_municipio = "15015";
})

document.getElementById('path46').addEventListener('click', function() {
    tarjeta_out("Axapusco", 'path46');
    id_municipio = "15016";
})

document.getElementById('path48').addEventListener('click', function() {
    tarjeta_out("Ayapango", 'path48');
    id_municipio = "15017";
})

document.getElementById('path50').addEventListener('click', function() {
    tarjeta_out("Calimaya", 'path50');
    id_municipio = "15018";
})

document.getElementById('path52').addEventListener('click', function() {
    tarjeta_out("Capulhuac", 'path52');
    id_municipio = "15019";
})

document.getElementById('path54').addEventListener('click', function() {
    tarjeta_out("Chalco", 'path54');
    id_municipio = "15025";
})

document.getElementById('path56').addEventListener('click', function() {
    tarjeta_out("Chapa de Mota", 'path56');
    id_municipio = "15026";
})

document.getElementById('path58').addEventListener('click', function() {
    tarjeta_out("Chapultepec", 'path58');
    id_municipio = "15027";
})

document.getElementById('path60').addEventListener('click', function() {
    tarjeta_out("Chiautla", 'path60');
    id_municipio = "15028";
})

document.getElementById('path62').addEventListener('click', function() {
    tarjeta_out("Chicoloapan", 'path62');
    id_municipio = "15029";
})

document.getElementById('path64').addEventListener('click', function() {
    tarjeta_out("Chiconcuac", 'path64');
    id_municipio = "15030";
})

document.getElementById('path66').addEventListener('click', function() {
    tarjeta_out("Chimalhuacán", 'path66');
    id_municipio = "15031";
})

document.getElementById('path68').addEventListener('click', function() {
    tarjeta_out("Coacalco de Berriozábal", 'path68');
    id_municipio = "15020";
})

document.getElementById('path70').addEventListener('click', function() {
    tarjeta_out("Coatepec Harinas", 'path70');
    id_municipio = "15021";
})

document.getElementById('path72').addEventListener('click', function() {
    tarjeta_out("Cocotitlán", 'path72');
    id_municipio = "15022";
})

document.getElementById('path74').addEventListener('click', function() {
    tarjeta_out("Coyotepec", 'path74');
    id_municipio = "15023";
})

document.getElementById('path76').addEventListener('click', function() {
    tarjeta_out("Cuautitlán", 'path76');
    id_municipio = "15024";
})

document.getElementById('path78').addEventListener('click', function() {
    tarjeta_out("Cuautitlán Izcalli", 'path78');
    id_municipio = "15121";
})

document.getElementById('path80').addEventListener('click', function() {
    tarjeta_out("Donato Guerra", 'path80');
    id_municipio = "15032";
})

document.getElementById('path82').addEventListener('click', function() {
    tarjeta_out("Ecatepec de Morelos", 'path82');
    id_municipio = "15033";
})

document.getElementById('path84').addEventListener('click', function() {
    tarjeta_out("Ecatzingo", 'path84');
    id_municipio = "15034";
})

document.getElementById('path86').addEventListener('click', function() {
    tarjeta_out("Huehuetoca", 'path86');
    id_municipio = "15035";
})

document.getElementById('path88').addEventListener('click', function() {
    tarjeta_out("Hueypoxtla", 'path88');
    id_municipio = "15036";
})

document.getElementById('path90').addEventListener('click', function() {
    tarjeta_out("Huixquilucan", 'path90');
    id_municipio = "15037";
})

document.getElementById('path92').addEventListener('click', function() {
    tarjeta_out("Isidro Fabela", 'path92');
    id_municipio = "15038";
})

document.getElementById('path94').addEventListener('click', function() {
    tarjeta_out("Ixtapaluca", 'path94');
    id_municipio = "15039";
})

document.getElementById('path96').addEventListener('click', function() {
    tarjeta_out("Ixtapan de la Sal", 'path96');
    id_municipio = "15040";
})

document.getElementById('path98').addEventListener('click', function() {
    tarjeta_out("Ixtapan del Oro", 'path98');
    id_municipio = "15041";
})

document.getElementById('path100').addEventListener('click', function() {
    tarjeta_out("Ixtlahuaca", 'path100');
    id_municipio = "15042";
})

document.getElementById('path102').addEventListener('click', function() {
    tarjeta_out("Jaltenco", 'path102');
    id_municipio = "15044";
})

document.getElementById('path104').addEventListener('click', function() {
    tarjeta_out("Tonanitla", 'path104');
    id_municipio = "15125";
})

document.getElementById('path106').addEventListener('click', function() {
    tarjeta_out("Jilotepec", 'path106');
    id_municipio = "15045";
})

document.getElementById('path108').addEventListener('click', function() {
    tarjeta_out("Jilotzingo", 'path108');
    id_municipio = "15046";
})

document.getElementById('path110').addEventListener('click', function() {
    tarjeta_out("Jiquipilco", 'path110');
    id_municipio = "15047";
})

document.getElementById('path112').addEventListener('click', function() {
    tarjeta_out("Jocotitlán", 'path112');
    id_municipio = "15048";
})

document.getElementById('path114').addEventListener('click', function() {
    tarjeta_out("Joquicingo", 'path114');
    id_municipio = "15049";
})

document.getElementById('path116').addEventListener('click', function() {
    tarjeta_out("Juchitepec", 'path116');
    id_municipio = "15050";
})

document.getElementById('path118').addEventListener('click', function() {
    tarjeta_out("Lerma", 'path118');
    id_municipio = "15051";
})

document.getElementById('path120').addEventListener('click', function() {
    tarjeta_out("Malinalco", 'path120');
    id_municipio = "15052";
})

document.getElementById('path122').addEventListener('click', function() {
    tarjeta_out("Melchor Ocampo", 'path122');
    id_municipio = "15053";
})

document.getElementById('path124').addEventListener('click', function() {
    tarjeta_out("Metepec", 'path124');
    id_municipio = "15054";
})

document.getElementById('path126').addEventListener('click', function() {
    tarjeta_out("Mexicaltzingo", 'path126');
    id_municipio = "15055";
})

document.getElementById('path128').addEventListener('click', function() {
    tarjeta_out("Morelos", 'path128');
    id_municipio = "15056";
})

document.getElementById('path130').addEventListener('click', function() {
    tarjeta_out("Naucalpan de Juárez", 'path130');
    id_municipio = "15057";
})

document.getElementById('path132').addEventListener('click', function() {
    tarjeta_out("Nextlalpan", 'path132');
    id_municipio = "15059";
})

document.getElementById('path134').addEventListener('click', function() {
    tarjeta_out("Nezahualcoyotl", 'path134');
    id_municipio = "15058";
})

document.getElementById('path136').addEventListener('click', function() {
    tarjeta_out("Nicolas Romero", 'path136');
    id_municipio = "15060";
})

document.getElementById('path138').addEventListener('click', function() {
    tarjeta_out("Nopaltepec", 'path138');
    id_municipio = "15061";
})

document.getElementById('path140').addEventListener('click', function() {
    tarjeta_out("Ocoyoacac", 'path140');
    id_municipio = "15062";
})

document.getElementById('path142').addEventListener('click', function() {
    tarjeta_out("Ocuilan", 'path142');
    id_municipio = "15063";
})

document.getElementById('path144').addEventListener('click', function() {
    tarjeta_out("El Oro", 'path144');
    id_municipio = "15064";
})

document.getElementById('path146').addEventListener('click', function() {
    tarjeta_out("Otumba", 'path146');
    id_municipio = "15065";
})

document.getElementById('path148').addEventListener('click', function() {
    tarjeta_out("Otzoloapan", 'path148');
    id_municipio = "15066";
})

document.getElementById('path150').addEventListener('click', function() {
    tarjeta_out("Otzolotepec", 'path150');
    id_municipio = "15067";
})

document.getElementById('path152').addEventListener('click', function() {
    tarjeta_out("Ozumba", 'path152');
    id_municipio = "15068";
})

document.getElementById('path154').addEventListener('click', function() {
    tarjeta_out("Papalotla", 'path154');
    id_municipio = "15069";
})

document.getElementById('path156').addEventListener('click', function() {
    tarjeta_out("La Paz", 'path156');
    id_municipio = "15070";
})

document.getElementById('path158').addEventListener('click', function() {
    tarjeta_out("Polotitlán", 'path158');
    id_municipio = "15071";
})

document.getElementById('path160').addEventListener('click', function() {
    tarjeta_out("Rayón", 'path160');
    id_municipio = "15072";
})

document.getElementById('path162').addEventListener('click', function() {
    tarjeta_out("San Antonio la Isla", 'path162');
    id_municipio = "15073";
})

document.getElementById('path164').addEventListener('click', function() {
    tarjeta_out("San Felipe del Progreso", 'path164');
    id_municipio = "15074";
})

document.getElementById('path166').addEventListener('click', function() {
    tarjeta_out("San Martín de las Pirámides", 'path166');
    id_municipio = "15075";
})

document.getElementById('path168').addEventListener('click', function() {
    tarjeta_out("San Mateo Atenco", 'path168');
    id_municipio = "15076";
})

document.getElementById('path170').addEventListener('click', function() {
    tarjeta_out("San Simón de Guerrero", 'path170');
    id_municipio = "15077";
})

document.getElementById('path172').addEventListener('click', function() {
    tarjeta_out("Santo Tomás", 'path172');
    id_municipio = "15078";
})

document.getElementById('path174').addEventListener('click', function() {
    tarjeta_out("Soyaniquilpan de Juárez", 'path174');
    id_municipio = "15079";
})

document.getElementById('path176').addEventListener('click', function() {
    tarjeta_out("Sultepec", 'path176');
    id_municipio = "15080";
})

document.getElementById('path178').addEventListener('click', function() {
    tarjeta_out("Tecámac", 'path178');
    id_municipio = "15081";
})

document.getElementById('path180').addEventListener('click', function() {
    tarjeta_out("Tejupilco", 'path180');
    id_municipio = "15082";
})

document.getElementById('path182').addEventListener('click', function() {
    tarjeta_out("Temamatla", 'path182');
    id_municipio = "15083";
})

document.getElementById('path184').addEventListener('click', function() {
    tarjeta_out("Temascalapa", 'path184');
    id_municipio = "15084";
})

document.getElementById('path186').addEventListener('click', function() {
    tarjeta_out("Temascalcingo", 'path186');
    id_municipio = "15085";
})

document.getElementById('path188').addEventListener('click', function() {
    tarjeta_out("Temascaltepec", 'path188');
    id_municipio = "15086";
})

document.getElementById('path190').addEventListener('click', function() {
    tarjeta_out("Temoaya", 'path190');
    id_municipio = "15087";
})

document.getElementById('path192').addEventListener('click', function() {
    tarjeta_out("Tenancingo", 'path192');
    id_municipio = "15088";
})

document.getElementById('path194').addEventListener('click', function() {
    tarjeta_out("Tenancingo del Aire", 'path194');
    id_municipio = "15089";
})

document.getElementById('path196').addEventListener('click', function() {
    tarjeta_out("Tenango del Valle", 'path196');
    id_municipio = "15090";
})

document.getElementById('path198').addEventListener('click', function() {
    tarjeta_out("Teoloyucan", 'path198');
    id_municipio = "15091";
})

document.getElementById('path200').addEventListener('click', function() {
    tarjeta_out("Teotihuacán", 'path200');
    id_municipio = "15092";
})

document.getElementById('path202').addEventListener('click', function() {
    tarjeta_out("Tepetlaoxtoc", 'path202');
    id_municipio = "15093";
})

document.getElementById('path204').addEventListener('click', function() {
    tarjeta_out("Tepetlixpa", 'path204');
    id_municipio = "15094";
})

document.getElementById('path206').addEventListener('click', function() {
    tarjeta_out("Tepotzotlán", 'path206');
    id_municipio = "15095";
})

document.getElementById('path208').addEventListener('click', function() {
    tarjeta_out("Tequixquiac", 'path208');
    id_municipio = "15096";
})

document.getElementById('path210').addEventListener('click', function() {
    tarjeta_out("Texcaltitlán", 'path210');
    id_municipio = "15097";
})

document.getElementById('path212').addEventListener('click', function() {
    tarjeta_out("Texcalyacac", 'path212');
    id_municipio = "15098";
})

document.getElementById('path214').addEventListener('click', function() {
    tarjeta_out("Texcoco", 'path214');
    id_municipio = "15099";
})

document.getElementById('path216').addEventListener('click', function() {
    tarjeta_out("Tezoyuca", 'path216');
    id_municipio = "15100";
})

document.getElementById('path218').addEventListener('click', function() {
    tarjeta_out("Tianguistenco", 'path218');
    id_municipio = "15101";
})

document.getElementById('path220').addEventListener('click', function() {
    tarjeta_out("Timilpan", 'path220');
    id_municipio = "15102";
})

document.getElementById('path222').addEventListener('click', function() {
    tarjeta_out("Tlalmanalco", 'path222');
    id_municipio = "15103";
})

document.getElementById('path224').addEventListener('click', function() {
    tarjeta_out("Tlalnepantla de Baz", 'path224');
    id_municipio = "15104";
})

document.getElementById('path228').addEventListener('click', function() {
    tarjeta_out("Tlatlaya", 'path228');
    id_municipio = "15105";
})

document.getElementById('path230').addEventListener('click', function() {
    tarjeta_out("Toluca", 'path230');
    id_municipio = "15106";
})

document.getElementById('path232').addEventListener('click', function() {
    tarjeta_out("Tonatico", 'path232');
    id_municipio = "15107";
})

document.getElementById('path234').addEventListener('click', function() {
    tarjeta_out("Tultepec", 'path234');
    id_municipio = "15108";
})

document.getElementById('path236').addEventListener('click', function() {
    tarjeta_out("Tultitlán", 'path236');
    id_municipio = "15109";
})

document.getElementById('path238').addEventListener('click', function() {
    tarjeta_out("Tultitlán", 'path238');
    id_municipio = "15109";
})

document.getElementById('path240').addEventListener('click', function() {
    tarjeta_out("Valle de Bravo", 'path240');
    id_municipio = "15110";
})

document.getElementById('path242').addEventListener('click', function() {
    tarjeta_out("Valle de Chalco Solidaridad", 'path242');
    id_municipio = "15122";
})

document.getElementById('path244').addEventListener('click', function() {
    tarjeta_out("Villa de Allende", 'path244');
    id_municipio = "15111";
})

document.getElementById('path246').addEventListener('click', function() {
    tarjeta_out("Villa del Carbón", 'path246');
    id_municipio = "15112";
})

document.getElementById('path248').addEventListener('click', function() {
    tarjeta_out("Villa Guerrero", 'path248');
    id_municipio = "15113";
})

document.getElementById('path250').addEventListener('click', function() {
    tarjeta_out("Villa Victoria", 'path250');
    id_municipio = "15114";
})

document.getElementById('path252').addEventListener('click', function() {
    tarjeta_out("Xalatlaco", 'path252');
    id_municipio = "15043";
})

document.getElementById('path254').addEventListener('click', function() {
    tarjeta_out("Xonacatlán", 'path254');
    id_municipio = "15115";
})

document.getElementById('path256').addEventListener('click', function() {
    tarjeta_out("Zacanzonapán", 'path256');
    id_municipio = "15116";
})

document.getElementById('path258').addEventListener('click', function() {
    tarjeta_out("Zacualpan", 'path258');
    id_municipio = "15117";
})

document.getElementById('path260').addEventListener('click', function() {
    tarjeta_out("Zinacantepec", 'path260');
    id_municipio = "15118";
})

document.getElementById('path262').addEventListener('click', function() {
    tarjeta_out("Zumpahuacán", 'path262');
    id_municipio = "15119";
})

document.getElementById('path264').addEventListener('click', function() {
    tarjeta_out("Zumpango", 'path264');
    id_municipio = "15120";
})

document.getElementById('path266').addEventListener('click', function() {
    tarjeta_out("San Josè del Rincòn", 'path266');
    id_municipio = "15124";
})

document.getElementById('path268').addEventListener('click', function() {
    tarjeta_out("Luvianos", 'path268');
    id_municipio = "15123";
})