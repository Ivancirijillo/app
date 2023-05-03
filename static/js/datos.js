/* SELECCION DEL MUNICIPIO DE LA BARRA SUPERIOR */
var click_btn_selec = true;

function ocultar_superior(){
    document.querySelector(".selec_municipios").style = 'height: 22px; background: rgba(255, 255, 255, 0.94)';
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

document.getElementById('btn_repor_mun').addEventListener('click', function(){
    tipo ='general';
    anio_selec = 2022
    enviar_json("impresion", " ");
    window.open("/pdf","_blank")
})

/* FUNCIONES PARA LOS MUNICIPIOS */
var elemento_path = ' ';
var nom_munic = ' ';
function tarjeta_out (nom_municipio, path_n){
    ocultar_superior();

    const cont_g = document.querySelectorAll('path');
    cont_g.forEach((elemento) => {
        if(elemento && elemento.id === path_n){
            if(elemento_path != ' ') elemento_path.style.fill = '#7eb057';
            elemento.style.fill = '#137547';
            elemento_path = elemento;
        }
    })

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
    document.querySelector(".info").style.height = '85%';
    document.querySelector(".filtro_categoria").style.display = 'flex';
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
    tarjeta_out(nom_munic, ' ');
})

/* Optimización */

var datos_mun;
const e_path = {
    'path42': datos_mun = new Array ('Atlacomulco', '15014'),
    'path16': datos_mun = new Array ('Acambay', '15001'),
    'path18': datos_mun = new Array ('Acolman', '15002'),
    'path20': datos_mun = new Array ('Aculco', '15003'),
    'path22': datos_mun = new Array ('Almoloya de Alquisiras', '15004'),
    'path24': datos_mun = new Array ('Almoloya de Juárez', '15005'),
    'path26': datos_mun = new Array ('Almoloya del Río', '15006'),
    'path28': datos_mun = new Array ('Amanalco', '15007'),
    'path30': datos_mun = new Array ('Amatepec', '15008'),
    'path32': datos_mun = new Array ('Amecameca', '15009'),
    'path34': datos_mun = new Array ('Apaxco', '15010'),
    'path36': datos_mun = new Array ('Atenco', '15011'),
    'path38': datos_mun = new Array ('Atizapán', '15012'),
    'path40': datos_mun = new Array ('Atizapán de Zaragoza', '15013'),
    'path44': datos_mun = new Array ('Atlautla', '15014'),
    'path46': datos_mun = new Array ('Axapusco', '15016'),
    'path48': datos_mun = new Array ('Ayapango', '15017'),
    'path50': datos_mun = new Array ('Calimaya', '15018'),
    'path52': datos_mun = new Array ('Capulhuac', '15019'),
    'path54': datos_mun = new Array ('Chalco', '15025'),
    'path56': datos_mun = new Array ('Chapa de Mota', '15026'),
    'path58': datos_mun = new Array ('Chapultepec', '15027'),
    'path60': datos_mun = new Array ('Chiautla', '15028'),
    'path62': datos_mun = new Array ('Chicoloapan', '15029'),
    'path64': datos_mun = new Array ('Chiconcuac', '15030'),
    'path66': datos_mun = new Array ('Chimalhuacán', '15031'),
    'path68': datos_mun = new Array ('Coacalco de Berriozábal', '15020'),
    'path70': datos_mun = new Array ('Coatepec Harinas', '15021'),
    'path72': datos_mun = new Array ('Cocotitlán', '15022'),
    'path74': datos_mun = new Array ('Coyotepec', '15023'),
    'path76': datos_mun = new Array ('Cuautitlán', '15024'),
    'path78': datos_mun = new Array ('Cuautitlán Izcalli', '15121'),
    'path80': datos_mun = new Array ('Donato Guerra', '15032'),
    'path82': datos_mun = new Array ('Ecatepec de Morelos', '15033'),
    'path84': datos_mun = new Array ('Ecatzingo', '15034'),
    'path86': datos_mun = new Array ('Huehuetoca', '15035'),
    'path88': datos_mun = new Array ('Hueypoxtla', '15036'),
    'path90': datos_mun = new Array ('Huixquilucan', '15037'),
    'path92': datos_mun = new Array ('Isidro Fabela', '15038'),
    'path94': datos_mun = new Array ('Ixtapaluca', '15039'),
    'path96': datos_mun = new Array ('Ixtapan de la Sal', '15040'),
    'path98': datos_mun = new Array ('Ixtapan del Oro', '15041'),
    'path100': datos_mun = new Array ('Ixtlahuaca', '15042'),
    'path102': datos_mun = new Array ('Jaltenco', '15044'),
    'path104': datos_mun = new Array ('Tonanitla', '15125'),
    'path106': datos_mun = new Array ('Jilotepec', '15045'),
    'path108': datos_mun = new Array ('Jilotzingo', '15046'),
    'path110': datos_mun = new Array ('Jiquipilco', '15047'),
    'path112': datos_mun = new Array ('Jocotitlán', '15048'),
    'path114': datos_mun = new Array ('Joquicingo', '15049'),
    'path116': datos_mun = new Array ('Juchitepec', '15050'),
    'path118': datos_mun = new Array ('Lerma', '15051'),
    'path120': datos_mun = new Array ('Malinalco', '15052'),
    'path122': datos_mun = new Array ('Melchor Ocampo', '15053'),
    'path124': datos_mun = new Array ('Metepec', '15054'),
    'path126': datos_mun = new Array ('Mexicaltzingo', '15055'),
    'path128': datos_mun = new Array ('Morelos', '15056'),
    'path130': datos_mun = new Array ('Naucalpan de Juárez', '15057'),
    'path132': datos_mun = new Array ('Nextlalpan', '15059'),
    'path134': datos_mun = new Array ('Nezahualcoyotl', '15058'),
    'path136': datos_mun = new Array ('Nicolas Romero', '15060'),
    'path138': datos_mun = new Array ('Nopaltepec', '15061'),
    'path140': datos_mun = new Array ('Ocoyoacac', '15062'),
    'path142': datos_mun = new Array ('Ocuilan', '15063'),
    'path144': datos_mun = new Array ('El Oro', '15064'),
    'path146': datos_mun = new Array ('Otumba', '15065'),
    'path148': datos_mun = new Array ('Otzoloapan', '15066'),
    'path150': datos_mun = new Array ('Otzolotepec', '15067'),
    'path152': datos_mun = new Array ('Ozumba', '15068'),
    'path154': datos_mun = new Array ('Papalotla', '15069'),
    'path156': datos_mun = new Array ('La Paz', '15070'),
    'path158': datos_mun = new Array ('Polotitlán', '15071'),
    'path160': datos_mun = new Array ('Rayón', '15072'),
    'path162': datos_mun = new Array ('San Antonio la Isla', '15073'),
    'path164': datos_mun = new Array ('San Felipe del Progreso', '15074'),
    'path166': datos_mun = new Array ('San Martín de las Pirámides', '15075'),
    'path168': datos_mun = new Array ('San Mateo Atenco', '15076'),
    'path170': datos_mun = new Array ('San Simón de Guerrero', '15077'),
    'path172': datos_mun = new Array ('Santo Tomás', '15078'),
    'path174': datos_mun = new Array ('Soyaniquilpan de Juárez', '15079'),
    'path176': datos_mun = new Array ('Sultepec', '15080'),
    'path178': datos_mun = new Array ('Tecámac', '15081'),
    'path180': datos_mun = new Array ('Tejupilco', '15082'),
    'path182': datos_mun = new Array ('Temamatla', '15083'),
    'path184': datos_mun = new Array ('Temascalapa', '15084'),
    'path186': datos_mun = new Array ('Temascalcingo', '15085'),
    'path188': datos_mun = new Array ('Temascaltepec', '15086'),
    'path190': datos_mun = new Array ('Temoaya', '15087'),
    'path192': datos_mun = new Array ('Tenancingo', '15088'),
    'path194': datos_mun = new Array ('Tenancingo del Aire', '15089'),
    'path196': datos_mun = new Array ('Tenango del Valle', '15090'),
    'path198': datos_mun = new Array ('Teoloyucan', '15091'),
    'path200': datos_mun = new Array ('Teotihuacán', '15092'),
    'path202': datos_mun = new Array ('Tepetlaoxtoc', '15093'),
    'path204': datos_mun = new Array ('Tepetlixpa', '15094'),
    'path206': datos_mun = new Array ('Tepotzotlán', '15095'),
    'path208': datos_mun = new Array ('Tequixquiac', '15096'),
    'path210': datos_mun = new Array ('Texcaltitlán', '15097"'),
    'path212': datos_mun = new Array ('Texcalyacac', '15098'),
    'path214': datos_mun = new Array ('Texcoco', '15099'),
    'path216': datos_mun = new Array ('Tezoyuca', '15100'),
    'path218': datos_mun = new Array ('Tianguistenco', '15101'),
    'path220': datos_mun = new Array ('Timilpan', '15102'),
    'path222': datos_mun = new Array ('Tlalmanalco', '15103'),
    'path224': datos_mun = new Array ('Tlalnepantla de Baz', '15104'),
    'path228': datos_mun = new Array ('Tlatlaya', '15105'),
    'path230': datos_mun = new Array ('Toluca', '15106'),
    'path232': datos_mun = new Array ('Tonatico', '15107'),
    'path234': datos_mun = new Array ('Tultepec', '15108'),
    'path236': datos_mun = new Array ('Tultitlán', '15109'),
    'path238': datos_mun = new Array ('Tultitlán', '15109'),
    'path240': datos_mun = new Array ('Valle de Bravo', '15110'),
    'path242': datos_mun = new Array ('Valle de Chalco Solidaridad', '15122'),
    'path244': datos_mun = new Array ('Villa de Allende', '15111'),
    'path246': datos_mun = new Array ('Villa del Carbón', '15112'),
    'path248': datos_mun = new Array ('Villa Guerrero', '15113'),
    'path250': datos_mun = new Array ('Villa Victoria', '15114'),
    'path252': datos_mun = new Array ('Xalatlaco', '15043'),
    'path254': datos_mun = new Array ('Xonacatlán', '15115'),
    'path256': datos_mun = new Array ('Zacanzonapán', '15116'),
    'path258': datos_mun = new Array ('Zacualpan', '15117'),
    'path260': datos_mun = new Array ('Zinacantepec', '15118'),
    'path262': datos_mun = new Array ('Zumpahuacán', '15119'),
    'path264': datos_mun = new Array ('Zumpango', '15120'),
    'path266': datos_mun = new Array ('San José del Rincón', '15124'),
    'path268': datos_mun = new Array ('Luvianos', '15123')
}

var dbl_click = false, path_anterior = ' '
const btn_mun = document.getElementById('elem_g');
btn_mun.addEventListener('click', (e) => {
    if(e.target && e.target.tagName === 'path'){

        if(dbl_click == true && path_anterior == e.target.id){
            document.getElementById('titulo_mun').textContent = arr_mun[0];
            document.getElementById('imagen_mun').src = '/static/img_mun/'+arr_mun[1]+'.png';
            aumento = 2;
            document.getElementById('Map').style = 'transform: scale('+aumento+'); opacity: 0;';
            setTimeout(() => {
                //funcion de espera
                document.querySelector('.cont_secc').style = 'display: block; top: 0;';
                document.querySelector('.cont_paths').style = 'display: none;';
            }, 350);
            setTimeout(() => {
                //funcion de espera
                document.querySelector('.frag').style = 'transform: scale(1); opacity: 1;';
            }, 450);
        }else{
            arr_mun = e_path[e.target.id]
            tarjeta_out(arr_mun[0], e.target.id);
            id_municipio = arr_mun[1]
        }

        path_anterior = e.target.id
        dbl_click = true
    }
})

const btn_opc = document.getElementById('elem_p');
btn_opc.addEventListener('click', (e) => {
    console.log(e.target.tagName)
    if(e.target && e.target.tagName === 'BUTTON'){
        arr_mun = e_path[e.target.id]
        tarjeta_out(arr_mun[0], e.target.id);
        id_municipio = arr_mun[1]
        path_anterior = e.target.id
        dbl_click = true
        volver_mapa();
    }
})

function volver_mapa (){
    aumento = 1;
    document.querySelector('.frag').style = 'transform: scale(0.2); opacity: 0;';
    setTimeout(() => {
        //funcion de espera
        document.querySelector('.cont_secc').style = 'display: none;';
        document.querySelector('.cont_paths').style = ' ';
    }, 300);
    setTimeout(() => {
        //funcion de espera
    document.getElementById('Map').style = 'transform: scale('+aumento+'); opacity: 1;';
    }, 450);
    dbl_click = false
}

document.getElementById('btn_volver').addEventListener('click', function() {
    volver_mapa();
})

document.getElementById('btn_secc').addEventListener('click', function() {
    document.querySelector('.cont_btn_secc').style = 'display: flex;';
})

const cont_btn_secc = document.getElementById('cont_btn_secc');
cont_btn_secc.addEventListener('click', (e) => {
    if(e.target && e.target.tagName === 'BUTTON'){
        document.querySelector('.cont_btn_secc').style = ' ';
    }
})
