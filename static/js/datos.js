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

function enviar_json (in_consulta){
    let data = {
        consulta: in_consulta
    }
    fetch('/consultas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            let tablas = data["consulta"];
            var template = '';
            for(var i = 0; i < tablas.length ; i++){
                template += '<tr>';
                for (let j = 0; j < tablas[i].length; j++) {
                    template += '<td>'+tablas[i][j]+'</td>';
                }
                template += '</tr>';
            }
            document.querySelector(".tableDatos").innerHTML = template;
        });
}

/* VALIDACION DE LOS INPUT-BOTON CONTINUAR */
var in_filtro_anio = true;
var id_municipio = "";
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
                let in_consulta = ""
                if(item.value == 'apoyo'){
                    in_consulta = "select NombreA, NoApoyos from Apoyos where YearA='2022' and ClaveMunicipal='"+id_municipio+"'"
                }
                if(item.value == 'deli'){
                    in_consulta = "select d.ClaveMunicipal, m.NombreM, d.YearD, d.DelitosAI, d.Homicidios, d.Feminicidios, " 
                    + "d.Secuestros, d.DespT, (d.Robo + d.RoboT) as robtt from Delincuencia as d inner join Municipio as m on " 
                    + "d.ClaveMunicipal = m.ClaveMunicipal where d.YearD='2022' and d.ClaveMunicipal='"+id_municipio+"'"
                }
                if(item.value == 'padron'){
                    
                }
                if(item.value == 'pobreza'){
                    
                }
                enviar_json (in_consulta);
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
var path_anterior = ' ';
function tarjeta_out (nom_municipio, path_n){
    document.querySelector(".selec_municipios").style = 'height: 22px; rgba(255, 255, 255, 0.55)';
    document.querySelector(".barra_des").style.transform = 'rotate(90deg)';
    document.querySelector(".opc_municipios").style.display = 'none';
    click_btn_selec = true;

    if(path_anterior != ' ') document.getElementById(path_anterior).style = '/*fill: green;*/';
    document.getElementById(path_n).style.fill = 'green';

    document.getElementById('municipio').textContent = "Seleccion - " + nom_municipio
    des_tarjeta();
    path_anterior = path_n;
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

/* PATH´S INDIVIDUALES DE SELECCION AL MUNICIPIO */ //opc_atlaco

document.getElementById('path42').addEventListener('click', function() {
    tarjeta_out("Atlacomulco", 'path42');
    id_municipio = "15014";
})

document.getElementById('path16').addEventListener('click', function() {
    tarjeta_out("Acambay", 'path16');
    id_municipio = "15001";
})

document.getElementById('opc_Acol' || 'path18').addEventListener('click', function() {
    tarjeta_out("Acolman", 'path18');
    des_tarjeta();
})

document.getElementById('opc_Acul' || 'path20').addEventListener('click', function() {
    tarjeta_out("Aculco", 'path20');
    des_tarjeta();
})

document.getElementById('opc_AlmodA' || 'path22').addEventListener('click', function() {
    tarjeta_out("Almoloya de Alquisiras", 'path22');
    des_tarjeta();
})

document.getElementById('opc_AlmodJ' || 'path24').addEventListener('click', function() {
    tarjeta_out("Almoloya de Juárez", 'path24');
    des_tarjeta();
   })

document.getElementById('opc_AlmodR' || 'path26').addEventListener('click', function() {
    tarjeta_out("Almoloya del Río", 'path26');
    des_tarjeta();
   })

document.getElementById('opc_Amana' || 'path28').addEventListener('click', function() {
    tarjeta_out("Amanalco", 'path28');
    des_tarjeta();
  })

document.getElementById('opc_Amate' || 'path30').addEventListener('click', function() {
    tarjeta_out("Amatepec", 'path30');
    des_tarjeta();
   })

document.getElementById('opc_Amecame' || 'path32').addEventListener('click', function() {
    tarjeta_out("Amecameca", 'path32');
    des_tarjeta();
    })

document.getElementById('opc_Apaxco' || 'path34').addEventListener('click', function() {
    tarjeta_out("Apaxco", 'path34');
    des_tarjeta();
    })

document.getElementById('opc_Atenco' || 'path36').addEventListener('click', function() {
    tarjeta_out("Atenco", 'path36');
    des_tarjeta();
  })

document.getElementById( 'opc_Atiza' || 'path38').addEventListener('click', function() {
    tarjeta_out("Atizapán", 'path38');
    des_tarjeta();
 })

document.getElementById('opc_AtizadZ' || 'path40').addEventListener('click', function() {
    tarjeta_out("Atizapán de Zaragoza", 'path40');
    des_tarjeta();
  })

document.getElementById('opc_Atlau' || 'path44').addEventListener('click', function() {
    tarjeta_out("Atlautla", 'path44');
    des_tarjeta();
 })

document.getElementById('opc_Axapus' || 'path46').addEventListener('click', function() {
    tarjeta_out("Axapusco", 'path46');
    des_tarjeta();
 })

document.getElementById('opc_Ayapan' || 'path48').addEventListener('click', function() {
    tarjeta_out("Ayapango", 'path48');
    des_tarjeta();
 })

document.getElementById('opc_Calima' || 'path50').addEventListener('click', function() {
    tarjeta_out("Calimaya", 'path50');
    des_tarjeta();
 })

document.getElementById('opc_Capulhu' || 'path52').addEventListener('click', function() {
    tarjeta_out("Capulhuac", 'path52');
    des_tarjeta();
 })

document.getElementById('opc_Chalco' || 'path54').addEventListener('click', function() {
    tarjeta_out("Chalco", 'path54');
    des_tarjeta();
  })

document.getElementById('opc_Chap' || 'path56').addEventListener('click', function() {
    tarjeta_out("Chapa de Mota", 'path56');
    des_tarjeta();
  })

document.getElementById('opc_Chapul' || 'path58').addEventListener('click', function() {
    tarjeta_out("Chapultepec", 'path58');
    des_tarjeta();
 })

document.getElementById('opc_Chia' || 'path60').addEventListener('click', function() {
    tarjeta_out("Chiautla", 'path60');
    des_tarjeta();
 })

document.getElementById('opc_Chico' || 'path62').addEventListener('click', function() {
    tarjeta_out("Chicoloapan", 'path62');
    des_tarjeta();
})

document.getElementById('opc_Chin' || 'path64').addEventListener('click', function() {
    tarjeta_out("Chiconcuac", 'path64');
    des_tarjeta();
 })

document.getElementById('opc_Chima' || 'path66').addEventListener('click', function() {
    tarjeta_out("Chimalguacán", 'path66');
    des_tarjeta();
})

document.getElementById('opc_Coacal' ||'path68').addEventListener('click', function() {
    tarjeta_out("Coacalco de Berriozábal", 'path68');
    des_tarjeta();
 })

document.getElementById('opc_Coate' || 'path70').addEventListener('click', function() {
    tarjeta_out("Coatepec Harinas", 'path70');
    des_tarjeta();
 })

document.getElementById('opc_Coco' || 'path72').addEventListener('click', function() {
    tarjeta_out("Cocotitlán", 'path72');
    des_tarjeta();
 })

document.getElementById('opc_Coyo' || 'path74').addEventListener('click', function() {
    tarjeta_out("Coyotepec", 'path74');
    des_tarjeta();
})

document.getElementById('opc_Cuau' || 'path76').addEventListener('click', function() {
    tarjeta_out("Cuautitlán", 'path76');
    des_tarjeta();
})

document.getElementById('opc_Cuauti' || 'path78').addEventListener('click', function() {
    tarjeta_out("Cuautitlán Izcalli", 'path78');
    des_tarjeta();
 })

document.getElementById('opc_DondG' || 'path80').addEventListener('click', function() {
    tarjeta_out("Donato Guerra", 'path80');
    des_tarjeta();
})

document.getElementById('opc_Ecat' || 'path82').addEventListener('click', function() {
    tarjeta_out("Ecatepec de Morelos", 'path82');
    des_tarjeta();
})

document.getElementById('opc_Ecatz' || 'path84').addEventListener('click', function() {
    tarjeta_out("Ecatzingo", 'path84');
    des_tarjeta();
 })

document.getElementById('opc_Huehue' || 'path86').addEventListener('click', function() {
    tarjeta_out("Huehuetoca", 'path86');
    des_tarjeta();
})

document.getElementById('opc_Huey' || 'path88').addEventListener('click', function() {
    tarjeta_out("Hueypoxtla", 'path88');
    des_tarjeta();
})

document.getElementById('opc_Huix' || 'path90').addEventListener('click', function() {
    tarjeta_out("Huixquilucan", 'path90');
    des_tarjeta();
})

document.getElementById('opc_Isid' || 'path92').addEventListener('click', function() {
    tarjeta_out("Isidro Fabela", 'path92');
    des_tarjeta();
})

document.getElementById('opc_Ixta' || 'path94').addEventListener('click', function() {
    tarjeta_out("Ixtapaluca", 'path94');
    des_tarjeta();
})

document.getElementById('opc_IxtapanS' || 'path96').addEventListener('click', function() {
    tarjeta_out("Ixtapan de la Sal", 'path96');
    des_tarjeta();
})

document.getElementById('opc_IxtapanO' || 'path98').addEventListener('click', function() {
    tarjeta_out("Ixtapan del Oro", 'path98');
    des_tarjeta();
 })

document.getElementById('opc_ixtla' || 'path100').addEventListener('click', function() {
    tarjeta_out("Ixtlahuaca", 'path100');
    des_tarjeta();
})

document.getElementById('opc_Jalt' || 'path102').addEventListener('click', function() {
    tarjeta_out("Jaltenco", 'path102');
    des_tarjeta();
 })

document.getElementById('opc_Tonan' || 'path104').addEventListener('click', function() {
    tarjeta_out("Tonanitla", 'path104');
    des_tarjeta();
})

document.getElementById('opc_Jilo' || 'path106').addEventListener('click', function() {
    tarjeta_out("Jilotepec", 'path106');
    des_tarjeta();
 })

document.getElementById('opc_Jilot' || 'path108').addEventListener('click', function() {
    tarjeta_out("Jilotzingo", 'path108');
    des_tarjeta();
})

document.getElementById('opc_Jiqui' || 'path110').addEventListener('click', function() {
    tarjeta_out("Jiquipilco", 'path110');
    des_tarjeta();
})

document.getElementById('opc_Joco' || 'path112').addEventListener('click', function() {
    tarjeta_out("Jocotitlán", 'path112');
    des_tarjeta();
})

document.getElementById('opc_Joqui' || 'path114').addEventListener('click', function() {
    tarjeta_out("Joquicingo", 'path114');
    des_tarjeta();
})

document.getElementById('opc_Juchi' || 'path116').addEventListener('click', function() {
    tarjeta_out("Juchitepec", 'path116');
    des_tarjeta();
 })

document.getElementById('opc_Lerma' || 'path118').addEventListener('click', function() {
    tarjeta_out("Lerma", 'path118');
    des_tarjeta();
})

document.getElementById('opc_Mali' || 'path120').addEventListener('click', function() {
    tarjeta_out("Malinalco", 'path120');
    des_tarjeta();
})

document.getElementById('opc_MelchO' || 'path122').addEventListener('click', function() {
    tarjeta_out("Melchor Ocampo", 'path122');
    des_tarjeta();
})

document.getElementById('opc_Metep' || 'path124').addEventListener('click', function() {
    tarjeta_out("Metepec", 'path124');
    des_tarjeta();
})

document.getElementById('opc_Mexi' || 'path126').addEventListener('click', function() {
    tarjeta_out("Mexicaltzingo", 'path126');
    des_tarjeta();
})

document.getElementById('opc_Mor' || 'path128').addEventListener('click', function() {
    tarjeta_out("Morelos", 'path128');
    des_tarjeta();
})

document.getElementById('opc_NauJ' || 'path130').addEventListener('click', function() {
    tarjeta_out("Naucalpan de Juárez", 'path130');
    des_tarjeta();
})

document.getElementById('opc_Next' || 'path132').addEventListener('click', function() {
    tarjeta_out("Nextlalpan", 'path132');
    des_tarjeta();
})

document.getElementById('opc_Neza' || 'path134').addEventListener('click', function() {
    tarjeta_out("Nezahualcoyotl", 'path134');
    des_tarjeta();
 })

document.getElementById('opc_NicoR' || 'path136').addEventListener('click', function() {
    tarjeta_out("Nicolas Romero", 'path136');
    des_tarjeta();
})

document.getElementById('opc_Nopal' || 'path138').addEventListener('click', function() {
    tarjeta_out("Nopaltepec", 'path138');
    des_tarjeta();
 })

document.getElementById('opc_Ocoyoa' || 'path140').addEventListener('click', function() {
    tarjeta_out("Ocoyoacac", 'path140');
    des_tarjeta();
})

document.getElementById('opc_Ocuilan' || 'path142').addEventListener('click', function() {
    tarjeta_out("Ocuilan", 'path142');
    des_tarjeta();
})

document.getElementById('opc_ElO' || 'path144').addEventListener('click', function() {
    tarjeta_out("El Oro", 'path144');
    des_tarjeta();
})

document.getElementById('opc_Otumba' || 'path146').addEventListener('click', function() {
    tarjeta_out("Otumba", 'path146');
    des_tarjeta();
})

document.getElementById('opc_Otzo' || 'path148').addEventListener('click', function() {
    tarjeta_out("Otzoloapan", 'path148');
    des_tarjeta();
 })

document.getElementById('opc_Otzol' || 'path150').addEventListener('click', function() {
    tarjeta_out("Otzolotepec", 'path150');
    des_tarjeta();
})

document.getElementById('opc_Ozumba' || 'path152').addEventListener('click', function() {
    tarjeta_out("Ozumba", 'path152');
    des_tarjeta();
 })

document.getElementById('opc_Papal' || 'path154').addEventListener('click', function() {
    tarjeta_out("Papalotla", 'path154');
    des_tarjeta();
})

document.getElementById('opc_LaPaz' || 'path156').addEventListener('click', function() {
    tarjeta_out("La Paz", 'path156');
    des_tarjeta();
})

document.getElementById('opc_Polo' || 'path158').addEventListener('click', function() {
    tarjeta_out("Polotitlán", 'path158');
    des_tarjeta();
})

document.getElementById('opc_Rayon' || 'path160').addEventListener('click', function() {
    tarjeta_out("Rayón", 'path160');
    des_tarjeta();
})

document.getElementById('opc_SanAn' || 'path162').addEventListener('click', function() {
    tarjeta_out("San Antonio la Isla", 'path162');
    des_tarjeta();
})

document.getElementById('opc_SanFe' || 'path164').addEventListener('click', function() {
    tarjeta_out("San Felipe del Progreso", 'path164');
    des_tarjeta();
})

document.getElementById('opc_SanMar' || 'path166').addEventListener('click', function() {
    tarjeta_out("San Martín de las Pirámides", 'path166');
    des_tarjeta();
})

document.getElementById('opc_SanMateo' || 'path168').addEventListener('click', function() {
    tarjeta_out("San Mateo Atenco", 'path168');
    des_tarjeta();
})

document.getElementById('opc_SanSim' || 'path170').addEventListener('click', function() {
    tarjeta_out("San Simón de Guerrero", 'path170');
    des_tarjeta();
})

document.getElementById('opc_SantoTom' || 'path172').addEventListener('click', function() {
    tarjeta_out("Santo Tomás", 'path172');
    des_tarjeta();
})

document.getElementById('opc_Soya' || 'path174').addEventListener('click', function() {
    tarjeta_out("Soyaniquilpan de Juárez", 'path174');
    des_tarjeta();
 })

document.getElementById('opc_Sulte' || 'path176').addEventListener('click', function() {
    tarjeta_out("Sultepec", 'path176');
    des_tarjeta();
})

document.getElementById('opc_Teca' || 'path178').addEventListener('click', function() {
    tarjeta_out("Tecámac", 'path178');
    des_tarjeta();
})

document.getElementById('opc_Teju' || 'path180').addEventListener('click', function() {
    tarjeta_out("Tejupilco", 'path180');
    des_tarjeta();
})

document.getElementById('opc_Temama' || 'path182').addEventListener('click', function() {
    tarjeta_out("Temamatla", 'path182');
    des_tarjeta();
})

document.getElementById('opc_Temas' || 'path184').addEventListener('click', function() {
    tarjeta_out("Temascalapa", 'path184');
    des_tarjeta();
})

document.getElementById('opc_TemasC' || 'path186').addEventListener('click', function() {
    tarjeta_out("Temascalcingo", 'path186');
    des_tarjeta();
 })

document.getElementById('opc_TemasCal' || 'path188').addEventListener('click', function() {
    tarjeta_out("Temascaltepec", 'path188');
    des_tarjeta();
 })

document.getElementById('opc_Temoaya' || 'path190').addEventListener('click', function() {
    tarjeta_out("Temoaya", 'path190');
    des_tarjeta();
})

document.getElementById('opc_Tenan' || 'path192').addEventListener('click', function() {
    tarjeta_out("Tenancingo", 'path192');
    des_tarjeta();
})

document.getElementById('opc_TenanA' || 'path194').addEventListener('click', function() {
    tarjeta_out("Tenancingo del Aire", 'path194');
    des_tarjeta();
})

document.getElementById('opc_TenanV' || 'path196').addEventListener('click', function() {
    tarjeta_out("Tenango del Valle", 'path196');
    des_tarjeta();
})

document.getElementById('opc_Teol' || 'path198').addEventListener('click', function() {
    tarjeta_out("Teoloyucan", 'path198');
    des_tarjeta();
})

document.getElementById('opc_Teoti' || 'path200').addEventListener('click', function() {
    tarjeta_out("Teotihuacán", 'path200');
    des_tarjeta();
})

document.getElementById('opc_Tepetla' || 'path202').addEventListener('click', function() {
    tarjeta_out("Tepetlaoxtoc", 'path202');
    des_tarjeta();
 })

document.getElementById('opc_Tepet' || 'path204').addEventListener('click', function() {
    tarjeta_out("Tepetlixpa", 'path204');
    des_tarjeta();
})

document.getElementById('opc_Tepoz' || 'path206').addEventListener('click', function() {
    tarjeta_out("Tepotzotlán", 'path206');
    des_tarjeta();
})

document.getElementById('opc_Tequix' || 'path208').addEventListener('click', function() {
    tarjeta_out("Tequixquiac", 'path208');
    des_tarjeta();
})

document.getElementById('opc_Texcal' || 'path210').addEventListener('click', function() {
    tarjeta_out("Texcaltitlán", 'path210');
    des_tarjeta();
})

document.getElementById('opc_Texcalya' || 'path212').addEventListener('click', function() {
    tarjeta_out("Texcalyacac", 'path212');
    des_tarjeta();
})

document.getElementById('opc_Texcoco' || 'path214').addEventListener('click', function() {
    tarjeta_out("Texcoco", 'path214');
    des_tarjeta();
})

document.getElementById('opc_Tezoy' || 'path216').addEventListener('click', function() {
    tarjeta_out("Tezoyuca", 'path216');
    des_tarjeta();
})

document.getElementById('opc_Tianguis' || 'path218').addEventListener('click', function() {
    tarjeta_out("Tianguistenco", 'path218');
    des_tarjeta();
})

document.getElementById('opc_Timilpan' || 'path220').addEventListener('click', function() {
    tarjeta_out("Timilpan", 'path220');
    des_tarjeta();
})

document.getElementById('opc_Tlalma' || 'path222').addEventListener('click', function() {
    tarjeta_out("Tlalmanalco", 'path222');
    des_tarjeta();
})

document.getElementById('opc_Tlalne' || 'path224').addEventListener('click', function() {
    tarjeta_out("Tlalnepantla de Baz", 'path224');
    des_tarjeta();
})

document.getElementById('opc_Tlalne' || 'path226').addEventListener('click', function() {
    tarjeta_out("Tlalnepantla de Baz", 'path226');
    des_tarjeta();
 })

document.getElementById('opc_Tlatla' || 'path228').addEventListener('click', function() {
    tarjeta_out("Tlatlaya", 'path228');
    des_tarjeta();
 })

document.getElementById('opc_Toluca' || 'path230').addEventListener('click', function() {
    tarjeta_out("Toluca", 'path230');
    des_tarjeta();
})

document.getElementById('opc_Tonatico' || 'path232').addEventListener('click', function() {
    tarjeta_out("Tonatico", 'path232');
    des_tarjeta();
})

document.getElementById('opc_Tultepec' || 'path234').addEventListener('click', function() {
    tarjeta_out("Tultepec", 'path234');
    des_tarjeta();
})

document.getElementById('opc_Tulti' || 'path236').addEventListener('click', function() {
    tarjeta_out("Tultitlán", 'path236');
    des_tarjeta();
})

document.getElementById('opc_Tulti' || 'path238').addEventListener('click', function() {
    tarjeta_out("Tultitlán", 'path238');
    des_tarjeta();
})

document.getElementById('opc_ValleB' || 'path240').addEventListener('click', function() {
    tarjeta_out("Valle de Bravo", 'path240');
    des_tarjeta();
})

document.getElementById('opc_ValleS' || 'path242').addEventListener('click', function() {
    tarjeta_out("Valle de Chalco Solidaridad", 'path242');
    des_tarjeta();
})

document.getElementById('opc_VillaA' || 'path244').addEventListener('click', function() {
    tarjeta_out("Villa de Allende", 'path244');
    des_tarjeta();
})

document.getElementById('opc_VillaC' || 'path246').addEventListener('click', function() {
    tarjeta_out("Villa del Carbón", 'path246');
    des_tarjeta();
 })

document.getElementById('opc_VillaG' || 'path248').addEventListener('click', function() {
    tarjeta_out("Villa Guerrero", 'path248');
    des_tarjeta();
})

document.getElementById('opc_VillaV' || 'path250').addEventListener('click', function() {
    tarjeta_out("Villa Victoria", 'path250');
    des_tarjeta();
})

document.getElementById('opc_Xala' || 'path252').addEventListener('click', function() {
    tarjeta_out("Xalatlaco", 'path252');
    des_tarjeta();
})

document.getElementById('opc_Xona' || 'path254').addEventListener('click', function() {
    tarjeta_out("Xonacatlán", 'path254');
    des_tarjeta();
})

document.getElementById('opc_Zacanzo' || 'path254').addEventListener('click', function() {
    tarjeta_out("Zacanzonapán", 'path256');
    des_tarjeta();
})

document.getElementById('opc_Zacua' || 'path258').addEventListener('click', function() {
    tarjeta_out("Zacualpan", 'path258');
    des_tarjeta();
})

document.getElementById('opc_Zinacan' || 'path260').addEventListener('click', function() {
    tarjeta_out("Zinacantepec", 'path260');
    des_tarjeta();
})

document.getElementById('opc_Zumpa' || 'path262').addEventListener('click', function() {
    tarjeta_out("Zumpahuacán", 'path262');
    des_tarjeta();
})

document.getElementById('opc_Zumpan' || 'path264').addEventListener('click', function() {
    tarjeta_out("Zumpango", 'path264');
    des_tarjeta();
})