from datetime import timedelta
from flask import Flask, abort, after_this_request, render_template, request, redirect, jsonify, send_file, send_from_directory, session, url_for
import threading, multiprocessing, time, signal, sys
from flask_login import LoginManager, current_user, login_required, login_user, logout_user
from flask_sslify import SSLify
from flask_wtf.csrf import CSRFProtect
from UserSession import LoginForm, User, TypeUser
import pandas as pd
import json, time
import matplotlib.pyplot as plt
from conexion import CONEXION
import configparser
import pymysql
from static.pdf.plantillas.Apoyos import Apoyos
from static.pdf.plantillas.Delincuencia import Delincuencia
from static.pdf.plantillas.General import General
from static.pdf.plantillas.PadronE import Padron
from static.pdf.plantillas.Pobreza import Pobreza
import random

#constantes 
COLUMNAS_A_ELIMINAR = ["CIRCUNSCRIPCION", "ID_ESTADO","NOMBRE_ESTADO", "ID_DISTRITO",
                        "CABECERA_DISTRITAL","ID_MUNICIPIO", "CASILLAS"]
PARTIDOS = ["PAN","PRI", "PRD", "PT", "PVEM", "MC", "NA", "MORENA", "ES", "VR", "PH", "PES", "PFD", "RSP", "FXM", "NAEM", "INDEP"]
#configuracion de archivo ini
configuracion = configparser.ConfigParser()
configuracion.read("configuracion.ini")
configuracion.sections()

#variables globales 
columnas = []
ruta_pdf = ""
usuarioA = ""

#Para subir archivo tipo foto al servidor
from werkzeug.utils import secure_filename 
import os

#Declarando nombre de la aplicación e inicializando
app = Flask(__name__)
#Declarando la clave secreta
app.secret_key = configuracion.get("api","id")
csrf = CSRFProtect(app)
# Crear una instancia de LoginManager y asociarla con la aplicación Flask
login_manager = LoginManager()
login_manager.init_app(app)

# Configurar la vista de inicio de sesión
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return TypeUser.load_user(user_id)
#csrf = CSRFProtect(app)

#Redireccionando cuando la página no existe
@app.errorhandler(404)
def not_found(error):
    valio=random.randrange(0, 100000, 1)
    #(0, 1000, 1)
    if valio==0:
        pagina="Pazul.html"
        pantallaC=True
    else: 
        pagina="404.html"
    return render_template(pagina)

@app.route('/', methods=['GET', 'POST'])
#@csrf.exempt
def login():
    global usuarioA
    form = LoginForm()
    if form.validate_on_submit():
        # Obtener los datos enviados por el formulario
        usern = form.username.data
        passw = form.password.data

        # Realizar la validación de las credenciales
        conn = CONEXION(configuracion["database1"]["host"],
                    configuracion["database1"]["port"],
                    configuracion["database1"]["user"],
                    configuracion["database1"]["passwd"],
                    configuracion["database1"]["db"])
        consulta = configuracion.get("consulta_usuarios","usuario").format(username=usern, password=passw)
        print(consulta)
        user = conn.consultar_db(consulta)
        print(user)
        if user:
            # Inicio de sesión exitoso, establecer la sesión del usuario, redirigir a una página de inicio
            role = user[0][3] #Obtener el rol del usuario
            login_user(User(usern, role))
            if role == 'admin':
                TypeUser.set_usuarioA(True)
                return redirect(url_for('carga'))  # Redirigir a la página de carga para el rol de administrador
            elif role == 'normal':
                TypeUser.set_usuarioA(False)
                return redirect(url_for('menu'))  # Redirigir a la página de menú para el rol normal
        else:
            # Credenciales incorrectas, mostrar un mensaje de error
            error_message = 'Credenciales incorrectas. Inténtalo de nuevo.'
            return render_template('login.html',form=form, error_message=error_message)
    
    # Método GET, mostrar el formulario de inicio de sesión
    return render_template("login.html", form=form)

# @app.route('/Borrador')
# def borrador():
#     return render_template('Borrador.html')

@app.route('/DatosMunicipio')
@login_required
def data():
    # Redirigir a la página de Datos de los Municipios
    return render_template('DataMunicipal.html')

@app.route("/Menu",methods=["GET", "POST"])
@login_required
def menu():
    # Redirigir a la página del Menú
    return render_template("menu.html")


@app.route("/Mapa",methods=["GET", "POST"])
@login_required
def mapa():
    # Redirigir a la página del Mapa
    return render_template("mapaOptimizado.html")

@app.route("/pdfModel",methods=["GET", "POST"])
@login_required
def model():
    # Redirigir a la página del Auxi
    return render_template("auxi.html")

@app.route("/pdfModel",methods=["GET", "POST"])
@login_required
def model():
    # Redirigir a la página del Auxi
    return render_template("auxi.html")
     
#Creando un Decorador
@app.route('/Graficas', methods=['GET', 'POST'])
@login_required
def home():
    # Redirigir a la página de las Graficas
    return render_template('index.html')

@app.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    # Cerrar / Limpiar session
    logout_user()
    return redirect(url_for('login'))

@app.route("/consultas-pagina", methods=['GET', 'POST'])
@csrf.exempt
def consultas_pagina():
    data = request.get_json()
    clavemun = data.get('dato')
    #print(dato_recibido)

    diccionario = {}
    secciones= ["nombre", "poblacion", "rezago", "economia", "tpobreza", "empleo", "deli", "padron", "datoPob", "datoPobre", "datoEco", "datoEmp", "datoRe", "datoPa", "apoyos", "apoYears"]
    encabezados= ["edad", "lengua", "disc", "vivienda", "educacion", "deuda", "pib", "sexo", "loc", "afil", "alim"]
    # Realizar la validación de las credenciales
    conn = CONEXION(configuracion["database1"]["host"],
                configuracion["database1"]["port"],
                configuracion["database1"]["user"],
                configuracion["database1"]["passwd"],
                configuracion["database1"]["db"])

    #Nombre
    consulta = configuracion.get("consulta_pagina",secciones[0]).format(clave=clavemun)
    resultados = conn.consultar_db(consulta)
    tratamiento(resultados, diccionario, secciones[0])
    
    #Poblacion
    consulta = configuracion.get("consulta_pagina",secciones[1]).format(clave=clavemun)
    resultados = conn.consultar_db(consulta)
        #Edad
    tratamientoGraficas(resultados, diccionario, encabezados[0], 44, 5, 10)
        #Lengua Indigena
    tratamientoGraficas(resultados, diccionario, encabezados[1], 44, 15, 5)
        #Discapacidad
    tratamientoGraficas(resultados, diccionario, encabezados[2], 44, 20, 5)
        #Sexo
    tratamientoGraficas(resultados, diccionario, encabezados[7], 44, 3, 2)
        #Localidad
    tratamientoGraficas(resultados, diccionario, encabezados[8], 44, 35, 4)
        #Afiliados
    tratamientoGraficas(resultados, diccionario, encabezados[9], 44, 26, 9)
        #Alimentacion
    tratamientoGraficas(resultados, diccionario, encabezados[10], 44, 42, 2)
        #Datos más receintes
    consulta = configuracion.get("consulta_pagina",secciones[8]).format(clave=clavemun)
    resultados = conn.consultar_db(consulta)
    tratamiento(resultados, diccionario, secciones[8])
    
    #Rezago Social
    consulta = configuracion.get("consulta_pagina",secciones[2]).format(clave=clavemun)
    resultados = conn.consultar_db(consulta)
        #Vivienda
    tratamientoGraficas(resultados, diccionario, encabezados[3], 18, 8, 7)
        #Educacion
    tratamientoGraficas(resultados, diccionario, encabezados[4], 18, 4, 3)
        #Datos más receintes
    consulta = configuracion.get("consulta_pagina",secciones[12]).format(clave=clavemun)
    resultados = conn.consultar_db(consulta)
    tratamiento(resultados, diccionario, secciones[12])

    #Economia
    consulta = configuracion.get("consulta_pagina",secciones[3]).format(clave=clavemun)
    resultados = conn.consultar_db(consulta)
        #Deuda
    tratamientoGraficas(resultados, diccionario, encabezados[5], 8, 5, 3)
        #PIB
    tratamientoGraficas(resultados, diccionario, encabezados[6], 8, 2, 1)
        #Datos más receintes
    consulta = configuracion.get("consulta_pagina",secciones[10]).format(clave=clavemun)
    resultados = conn.consultar_db(consulta)
    tratamiento(resultados, diccionario, secciones[10])
    
    #Pobreza
    consulta = configuracion.get("consulta_pagina",secciones[4]).format(clave=clavemun)
    resultados = conn.consultar_db(consulta)
        #Porcentajes
    tratamientoGraficas(resultados, diccionario, secciones[4], 16, 2, 14)
        #Datos más receintes
    consulta = configuracion.get("consulta_pagina",secciones[9]).format(clave=clavemun)
    resultados = conn.consultar_db(consulta)
    tratamiento(resultados, diccionario, secciones[9])
   
    #Empleo
    consulta = configuracion.get("consulta_pagina",secciones[5]).format(clave=clavemun)
    resultados = conn.consultar_db(consulta)
        #No
    tratamientoGraficas(resultados, diccionario, secciones[5], 14, 2, 10)
        #Datos más receintes
    consulta = configuracion.get("consulta_pagina",secciones[11]).format(clave=clavemun)
    resultados = conn.consultar_db(consulta)
    tratamiento(resultados, diccionario, secciones[11])
   
    #DELINCUENCIA
    consulta = configuracion.get("consulta_pagina",secciones[6]).format(clave=clavemun)
    resultados = conn.consultar_db(consulta)
        #No
    tratamientoGraficas(resultados, diccionario, secciones[6], 14, 2, 4)
    tratamientoGraficas2(resultados, diccionario, secciones[6], 14, 8, 5)

    #PADRON ELECTORAL
    consulta = configuracion.get("consulta_pagina",secciones[7]).format(clave=clavemun)
    resultados = conn.consultar_db(consulta)
    tratamientoGraficas(resultados, diccionario, secciones[7], 8, 2, 2)
    tratamientoGraficas2(resultados, diccionario, secciones[7], 8, 5, 2)
        #Datos más receintes
    consulta = configuracion.get("consulta_pagina",secciones[13]).format(clave=clavemun)
    resultados = conn.consultar_db(consulta)
    tratamiento(resultados, diccionario, secciones[13])

    #APOYOS
    consulta = configuracion.get("consulta_pagina",secciones[14]).format(clave=clavemun)
    resultados = conn.consultar_db(consulta)
    tratamiento(resultados, diccionario, secciones[14])

    consulta = configuracion.get("consulta_pagina",secciones[15]).format(clave=clavemun)
    resultados = conn.consultar_db(consulta)
    tratamiento(resultados, diccionario, secciones[15])

    return jsonify(diccionario)

@app.route("/consultas-tabla", methods=['GET', 'POST'])
@csrf.exempt
def consultas_tabla():
    recibido = request.json['dato']
    conn = CONEXION(configuracion["database1"]["host"],
                configuracion["database1"]["port"],
                configuracion["database1"]["user"],
                configuracion["database1"]["passwd"],
                configuracion["database1"]["db"])
    diccionario = {}
    consulta = configuracion.get("consulta_pagina","apoSelec").format(clave=recibido[0], year=recibido[1])
    resultados = conn.consultar_db(consulta)
    tratamiento(resultados, diccionario, "apoSelec")
    
    return jsonify({'resultado': diccionario})

@app.route("/consultas-buscador", methods=['POST'])
@csrf.exempt
#Motor de busqueda para graficas
    #Clasificacion de busquedas
    # tipos
    # -varios: Busquedas separadas por ,
    # -rango: Busquedas separadas por -
    # -nombre: Busquedas por nombres de municipios
def consultas_buscador():
    #json con los datos solicitados de las graficas
    js = request.get_json()
    lista = []
    diccionario = {}
    #Objeto de conexion a DB
    conn = CONEXION(configuracion["database1"]["host"],
                    configuracion["database1"]["port"],
                    configuracion["database1"]["user"],
                    configuracion["database1"]["passwd"],
                    configuracion["database1"]["db"])

    if(js["tipo"] ==  "varios"):
        #Reconoce si es un digito el primer dato ingresado
        if(js["datos"][0].isdigit()):
            #Recorre los datos, para encontrar los id o las secciones a buscar
            for id_m in js["datos"]:
                #Recorre los años a buscar
                for year in js["years"]:
                    #Agrega un arrelo a la clave del año actual 
                    diccionario[year] = []
                    #La consulta es determinada si se desea consultar un id o una seccion
                    consulta = configuracion.get("consultas_buscador", "busca_por_yearv").format(id=id_m, year=year) if(15000 < int(js["datos"][0]) < 15126) else configuracion.get("consultas_buscador", "toma_tu_consulta").format(seccion=id_m, year=year)
                    #guarda la respuesta de la solicitud
                    respuesta = conn.consultar_db(consulta)
                    #Agrega al arreglo de lista la respuesta 
                    lista.append(eliminar_decimal(respuesta))
        #Crea un nuevo diccionario limpiando los datos
        diccionario = crear_diccionario(lista,diccionario)

    elif(js["tipo"] ==  "rango"):
        #Convierte el inicio del rango a entero
        inicio = int(js["datos"][0])
        #Determina si es un id
        if(15000 < inicio < 15126):
            #Convierte el fin del rango en entero
            fin = int(js["datos"][1])
            #Determina si el fin del rango es el ultimo id de la base de datos
            fin  = 15125 if(fin == 15125) else fin
            #Recorre el rango de ids solicitados
            for id_m in range(inicio, fin+1):
                #Recorre los años solicitados
                for year in (js["years"]):
                    #Agrega un arrelo a la clave del año actual 
                    diccionario[year] = []
                    consulta = configuracion.get("consultas_buscador","busca_por_yearv").format(id=id_m, year=year)
                    respuesta = conn.consultar_db(consulta)
                    lista.append(eliminar_decimal(respuesta))
        #De lo contrario es una seccion
        else:
            #Convierte el inicio y fin del rango en entero
            inicio =int(js["datos"][0])
            fin = int(js["datos"][1])
            #Recorre el rango solicitado
            for id_m in range(inicio, fin+1):
                #Recorre los años solicitados
                for year in (js["years"]):
                    #Agrega un arrelo a la clave del año actual 
                    diccionario[year] = []
                    #Consulta las secciones
                    consulta = configuracion.get("consultas_buscador","toma_tu_consulta").format(seccion=id_m, year=year)
                    respuesta = conn.consultar_db(consulta)
                    lista.append(eliminar_decimal(respuesta))
        #Crea un nuevo diccionario limpiando los datos
        diccionario = crear_diccionario(lista,diccionario)

    elif(js["tipo"] == "nombre"):
        #La razon de este bloque de codigo es para buscar de manera individual un id,seccion
        if(js["datos"].isdigit()):
            municipio = int(js["datos"])
            for year in js["years"]:
                #Crea un nuevo diccionario limpiando los datos
                diccionario[year] = []
                consulta = configuracion.get("consultas_buscador","busca_por_yearv").format(id=js["datos"], year=year) if(15000< municipio <15126) else configuracion.get("consultas_buscador","varios_seccion").format(seccion=js["datos"], year=year)
                respuesta = conn.consultar_db(consulta)
                lista.append(eliminar_decimal(respuesta))
        #Buscar por nombres
        else:
            for year in js["years"]:
                #Crea un nuevo diccionario limpiando los datos
                diccionario[year] = []
                #Consulta los nombres 
                consulta = configuracion.get("consultas_buscador","nombreM").format(municipio=js["datos"], year=year)
                respuesta = conn.consultar_db(consulta)
                lista.append(eliminar_decimal(respuesta))   
        #Crea un nuevo diccionario limpiando los datos
        diccionario = crear_diccionario(lista,diccionario)
    #Crea un json para responder a la pagina web
    data = {'datos': diccionario}
    #Envia el json
    return jsonify(data)

@app.route("/impresiones", methods=['POST'])
@csrf.exempt
def impresiones():
    json = request.get_json()
    conn = CONEXION(configuracion["database1"]["host"],
                    configuracion["database1"]["port"],
                    configuracion["database1"]["user"],
                    configuracion["database1"]["passwd"],
                    configuracion["database1"]["db"])
    tipo = json["tipo_c"]
    global ruta_pdf
    if(tipo=="Apoyos"):
        respuesta = conn.consultar_db(f"select NombreA, NoApoyos from Apoyos where YearA={json['year']} and ClaveMunicipal={json['id']};")
        if(json["modo"] == "impresion"):
            ruta_pdf = Apoyos.GenerarApoyos(int(json["year"]), int(json["id"]))
    elif(tipo=="Delincuencia"):
        respuesta = conn.consultar_db(f"select DelitosAI, Homicidios, Feminicidios, Secuestros, DespT, Robo, RoboT from Delincuencia where YearD={json['year']} and ClaveMunicipal={json['id']};")
        if(json["modo"] == "impresion"):
            ruta_pdf = Delincuencia.GenerarDelincuencia(int(json["year"]), int(json["id"]))
    elif(tipo=="Padrón Electoral"):
        respuesta = conn.consultar_db(f"select  PHombres, PMujeres, PTotal, LNHombres, LNMujeres, LNTotal from PadronElectoral where YearE={json['year']} and ClaveMunicipal={json['id']};")
        if(json["modo"] == "impresion"):
            ruta_pdf = Padron.GenerarPadron(int(json["year"]), int(json["id"]))
    elif(tipo=="Pobreza"):
        respuesta = conn.consultar_db(f"select Pobreza, PobExt, PobMod, RezagoEd, CarSS, CarCalidadViv, CarAlim from TPobreza where YearP={json['year']} and ClaveMunicipal={json['id']};")
        if(json["modo"] == "impresion"):
            ruta_pdf = Pobreza.GenerarPobreza(int(json["year"]), int(json["id"]))
    elif(tipo=="Votos"):
        respuesta = conn.consultar_db(f"select yearV, V_VALIDOS, V_NULOS, TOTAL_V, LISTA_N from votos where yearV={json['year']} and SECCION={json['id']};")
        print(respuesta)
    elif(tipo=="Economía"):
        respuesta = conn.consultar_db(f"select pib, pib_per_cap, uet from economia where yearEco={json['year']} and ClaveMunicipal={json['id']};")
    elif(tipo=="Empleo"):
        respuesta = conn.consultar_db(f"select total, salario_promedio from empleo where yearEmp={json['year']} and ClaveMunicipal={json['id']};")
    elif(tipo=="Población"):
        respuesta = conn.consultar_db(f"select poblacion_tot, edad_mediana, pob_habla_ind, t_pob_disc, total_afil, no_afil, hogar, p_h_lim_alim, p_h_sn_l_alim from poblacion where yearPob={json['year']} and ClaveMunicipal={json['id']};")
    elif(tipo=="Rezago Social"):
        respuesta = conn.consultar_db(f"select gini, ind_rezago, grado_rezago, posicion_n from rezago_s where yearR={json['year']} and ClaveMunicipal={json['id']};")
    else:
        respuesta = " "
        if(json["modo"] == "impresion"):
            ruta_pdf = General.GenerarG(int(json["year"]), int(json["id"]))
    data_mapa = {'consulta': respuesta}
    return jsonify(data_mapa)

@app.route("/pdf")
@csrf.exempt
@csrf.exempt
def abrir_pdf():
    global ruta_pdf
    print("xd ",ruta_pdf)
    print("xd ",ruta_pdf)
    return send_file(ruta_pdf)
#Detecta si se interrunpe el programa
def interrupcion(sig, frame):
    print("Se ha interrumpido el programa con Ctrl+C")
    sys.exit(0)

#Encuentra los municipios que existen dentro de la respuesta de la consulta
def encontrar_municipio(respuesta):
    #Nos posicionamos en la posicion de la respuesta que tiene el primer municipio
    municipio_actual = respuesta[0][0]
    #variable que guarda los municipios encontrados
    municipios = []
    #Guarda las secciones del municipio
    secciones = []
    #Variable que cuenta las secciones del municipio
    contador = 0
    #Agrega el municipio actual al arreglo municipios
    municipios.append(municipio_actual)
    for i in range(len(respuesta)):
        #Si el municipio actual aparece en la siguiente fila, es una nueva seccion del mismo municipio
        if(municipio_actual == respuesta[i][0]):
            contador += 1
        else:
            #Agrega el numero de secciones encontradas al arreglo de secciones
            secciones.append(contador)
            #Actualizamos el municipio actual al nuevo encontrado
            municipio_actual = respuesta[i][0]
            #Agrega el nuevo municipio al arreglo de municipios
            municipios.append(municipio_actual)
            #Inicializamos el contadoe en 1
            contador = 1
    secciones.append(contador) # Agregar la última sección
    return municipios, secciones #Regresa los municipios encontrados ademas de sus secciones

#Viejo metodo de crear diccionario
def separar_por_partido(respuesta):
    municipios, secciones = encontrar_municipio(respuesta)
    contador = 0
    diccionario = {}
    aux = 1
    for municipio in municipios:
        diccionario[municipio] = {}
        while(aux <= len(PARTIDOS)):
            diccionario[municipio][PARTIDOS[aux-1]] = []
            for seccion in range(1,secciones[contador]+1):
                if(respuesta[seccion-1][aux] == None):
                    diccionario[municipio][PARTIDOS[aux-1]].append(0)
                else:
                    diccionario[municipio][PARTIDOS[aux-1]].append(respuesta[seccion-1][aux])
            aux+=1
        aux=0
        contador += 1

    return diccionario

#Elimina la palabra Decimal los () y ' de la respuesta de la consulta
def eliminar_decimal(respuesta):
    #Une los elementos de la respuesta convertidos en una cadena separada por ,
    cadena = ','.join(str(elem) for elem in respuesta)
    #Separa la cadena por las , 
    lista = cadena.split(',')
    for i in range(len(lista)):
        #Reemplaza los (), Decimal y ' por nada
        lista[i] = lista[i].replace("(", "").strip()
        lista[i] = lista[i].replace("Decimal", "").strip()
        lista[i] = lista[i].replace(")", "").strip()
        lista[i] = lista[i].replace("'", "").strip()
    return lista
#Metodo viejo antes de las consultas estaticas
def crear_consulta(js):
    consulta1 = "("
    for i in (js["years"]):
        consulta1 += f" yearV={i} or"
    return consulta1[:-2] + ") order by v.ClaveMunicipal"
#   tratamiento() : Inserta la información consultada de la base de datos en el diccionario para mandar al archivo DataMunicipal.js.
#   - tupla : Datos obtenidos de una consulta.
#   - diccionario : Diccionario que se manda al archivo datamunicipal.js
#   - atributo : Identificador asignado a la información dentro del diccionario.
#   Ejemplo : tratamiento(resultados, diccionario, secciones[0]) 
def tratamiento(tupla, diccionario, atributo):
    #conversion a cadena
    cadena = ','.join(str(elem) for elem in tupla)
    #conversion a lista
    lista = cadena.split(',')
    #Limpieza de la lista
    for i in range(len(lista)):
        lista[i] = lista[i].replace("(", "").strip()
        lista[i] = lista[i].replace(")", "").strip()
        lista[i] = lista[i].replace("'", "").strip()
        lista[i] = lista[i].replace("None", "0").strip()
    
    if atributo=="apoYears":
        #Elimina elementos vacios
        lista=[elemento for elemento in lista if elemento != '']

    diccionario [atributo]= lista

    return 0

#   tratamientoGraficas2() : Permite añadir información adicional a información poreviamente trabajada en  tratamientoGraficas().
#   - tupla : Datos obtenidos de una consulta.
#   - diccionario : Diccionario que se manda al archivo datamunicipal.js
#   - atributo : Identificador asignado a la información dentro del diccionario.
#   - salto : Número de atributos de la tabla de la base de datos de la que se trae la información en la consulta
#   - inicio : A partir de cuál atributo se comienza a guardar información
#   - longitud : Ultimo atributo se comienza a guardar información
#   Ejemplo : tratamientoGraficas2(resultados, diccionario, secciones[6], 14, 8, 5)

def tratamientoGraficas2(tupla, diccionario, atributo, salto, inicio, longitud):
    #conversion a cadena
    cadena = ','.join(str(elem) for elem in tupla)
    #conversion a lista
    lista = cadena.split(',')
    #Limpieza de la lista
    for i in range(len(lista)):
        lista[i] = lista[i].replace("(", "").strip()
        lista[i] = lista[i].replace(")", "").strip()
        lista[i] = lista[i].replace("'", "").strip()
        lista[i] = lista[i].replace("None", "0").strip()
    for i in range(0, len(lista), salto):
        datos=[]
        for j in range (i, (longitud+i), 1):
            datos.append(lista[j+inicio])
        year=lista[i+1]
        if atributo not in diccionario:
            diccionario[atributo] = {}  # Crear un diccionario anidado
        diccionario [atributo][year].extend(datos)
    return 0

#   tratamientoGraficas() : Inserta infromación estrucutrada en el diccionario,la información se estructura por tema y por año.
#   - tupla : Datos obtenidos de una consulta.
#   - diccionario : Diccionario que se manda al archivo datamunicipal.js
#   - atributo : Identificador asignado a la información dentro del diccionario.
#   - salto : Número de atributos de la tabla de la base de datos de la que se trae la información en la consulta
#   - inicio : A partir de cuál atributo se comienza a guardar información
#   - longitud : Ultimo atributo se comienza a guardar información
#   Ejemplo : tratamientoGraficas(resultados, diccionario, encabezados[0], 44, 5, 10)
def tratamientoGraficas(tupla, diccionario, atributo, salto, inicio, longitud):
    #conversion a cadena
    cadena = ','.join(str(elem) for elem in tupla)
    #conversion a lista
    lista = cadena.split(',')
    #Limpieza de la lista
    for i in range(len(lista)):
        lista[i] = lista[i].replace("(", "").strip()
        lista[i] = lista[i].replace(")", "").strip()
        lista[i] = lista[i].replace("'", "").strip()
        lista[i] = lista[i].replace("None", "0").strip()
    #years=[]
    for i in range(0, len(lista), salto):
        datos=[]
        for j in range (i, (longitud+i), 1):
            datos.append(lista[j+inicio])
        year=lista[i+1]
        #years.append(year)
        if atributo not in diccionario:
            diccionario[atributo] = {}  # Crear un diccionario anidado
        diccionario [atributo][year]= datos
    #diccionario [atributo]["Years"]= years
    return 0

def tratamiento(tupla, diccionario, atributo):
    cadena = ','.join(str(elem) for elem in tupla)
    lista = cadena.split(',')
    for i in range(len(lista)):
        lista[i] = lista[i].replace("(", "").strip()
        lista[i] = lista[i].replace(")", "").strip()
        lista[i] = lista[i].replace("'", "").strip()
        lista[i] = lista[i].replace("None", "0").strip()
    
    if atributo=="apoYears":
        #Elimina elementos vacios
        lista=[elemento for elemento in lista if elemento != '']

    diccionario [atributo]= lista

    return 0

def tratamientoGraficas2(tupla, diccionario, atributo, salto, inicio, longitud):
    cadena = ','.join(str(elem) for elem in tupla)
    lista = cadena.split(',')
    for i in range(len(lista)):
        lista[i] = lista[i].replace("(", "").strip()
        lista[i] = lista[i].replace(")", "").strip()
        lista[i] = lista[i].replace("'", "").strip()
        lista[i] = lista[i].replace("None", "0").strip()
    for i in range(0, len(lista), salto):
        datos=[]
        for j in range (i, (longitud+i), 1):
            datos.append(lista[j+inicio])
        year=lista[i+1]
        if atributo not in diccionario:
            diccionario[atributo] = {}  # Crear un diccionario anidado
        diccionario [atributo][year].extend(datos)
    return 0

def tratamientoGraficas(tupla, diccionario, atributo, salto, inicio, longitud):
    cadena = ','.join(str(elem) for elem in tupla)
    lista = cadena.split(',')
    for i in range(len(lista)):
        lista[i] = lista[i].replace("(", "").strip()
        lista[i] = lista[i].replace(")", "").strip()
        lista[i] = lista[i].replace("'", "").strip()
        lista[i] = lista[i].replace("None", "0").strip()
    #years=[]
    for i in range(0, len(lista), salto):
        datos=[]
        for j in range (i, (longitud+i), 1):
            datos.append(lista[j+inicio])
        year=lista[i+1]
        #years.append(year)
        if atributo not in diccionario:
            diccionario[atributo] = {}  # Crear un diccionario anidado
        diccionario [atributo][year]= datos
    #diccionario [atributo]["Years"]= years
    return 0

#Crea un diccionario con los municipios
def crear_diccionario(lista, diccionario):
    #Encuentra cuales son los municipios solicitados
    municipios, secciones = encontrar_municipio(lista)
    aux = 0
    #Crea un apartado con cada año del diccionario
    for year in diccionario.keys():
        #Crea una clave con el año encontrado, su valor es un arreglo vacio
        diccionario[year] = []
        #Agrega un diccionario del municipio como clave al año en cuestion
        for i in range(len(municipios)):
            diccionario[year].append({municipios[i]:{}})
    #Recorre el diccionario para agregar los votos al municipio correspondiente
    for i in range(len(municipios)):
        for year in diccionario.keys():
            # j representa el partido
            for j in range(1,len(PARTIDOS)+1):
                #Accedemos al año, i representan la posicion del municipio, municipio y el partido
                diccionario[year][i][municipios[i]][PARTIDOS[j-1]] = lista[aux][j]
            #Filas de la lista
            aux+=1
    return diccionario

# SUBIR DATOS

@app.route('/CargaArchivo')
@login_required
def carga():
    if current_user.role == 'admin':
        return render_template('cargaArchivo.html')
    else:
        return redirect(url_for('menu'))


@app.route('/cargar', methods=['POST'])
@csrf.exempt
def cargar_archivo():
    try:
        archivo = request.files['archivo']
        tablas = []
        if archivo:
            # Establecer la conexión con la base de datos
            
            conn = CONEXION(configuracion["database1"]["host"],
                                configuracion["database1"]["port"],
                                configuracion["database1"]["user"],
                                configuracion["database1"]["passwd"],
                                configuracion["database1"]["db"])
            #cursor = conn.consultar_db2

            # Lee el archivo Excelconn = CONEXION(configuracion["database1"]["host"],
            datos = pd.read_excel(archivo, sheet_name=None)
            menssaje=""
            aux=False
            # Recorre todas las hojas y guarda los datos en la base de datos
            for hoja, datos_hoja in datos.items():
                # Convierte los datos de la hoja a una lista de tuplas
                filas = [tuple(x) for x in datos_hoja.values]

                # Genera el SQL para insertar los datos en la tabla correspondiente
                tabla = hoja  # Nombre de la tabla en la base de datos
                campos = ','.join(datos_hoja.columns)  # Nombres de las columnas
                marcadores = ','.join(['%s'] * len(datos_hoja.columns))  # Marcadores de posición para los valores
                
                if (tabla=="municipio"):
                    # Construye la consulta SQL
                    insert = f"INSERT INTO {tabla} ({campos}) VALUES ({marcadores})"
                    # texto de abajo es ejemplo apra mostrar una tabla
                    #tablas.append(tabla)
                    # Inserta los datos en la base de datos
                    conn.consultar_db2(insert, filas)
                    tablas.append(tabla)
                    aux=True
                if (tabla=="usuarios"):
                    menssaje="No se pueden crear ni modificar usuarios."
                    tablas.append(menssaje)
                else:
                    columnas2 = datos_hoja.columns[2:]
                    cadena_SQL=""
                    for i in columnas2:
                        cadena_SQL += i + " = VALUES(" + i + "),"
                    cadena_SQL=cadena_SQL[:-1] 
                    # Construye la consulta SQL
                    #ON Conflict para postgre
                    insert = f"INSERT INTO {tabla} ({campos}) VALUES ({marcadores}) ON DUPLICATE KEY UPDATE {cadena_SQL}"
                    
                    # texto de abajo es ejemplo apra mostrar una tabla
                    #tablas.append(tabla)
                    # Inserta los datos en la base de datos
                    conn.consultar_db2(insert, filas)
                    tablas.append(tabla)
            if menssaje=="":
                menssaje = "Archivos cargados con exíto."
            elif menssaje!="" and aux:
                menssaje += "Los otros archivos fueron cargados con exíto."
            #agregar se ha subido exitosamente
            return render_template('cargaArchivo.html', mensaje = menssaje)
        return render_template('cargaArchivo.html')
    
    except (pymysql.IntegrityError, pymysql.ProgrammingError) as error:
        if isinstance(error, pymysql.IntegrityError):
            return render_template('integrity_error.html', error=error, carga=tablas), 500
        elif isinstance(error, pymysql.ProgrammingError):
            return render_template('programming_error.html', error=error), 500

# error 
@app.errorhandler(Exception)
def handle_error(error):
    return render_template('programming_error.html', error=error), 500

# error para AttributeError
@app.errorhandler(AttributeError)
def handle_attribute_error(error):
    return render_template('attribute_error.html', error=error), 500

@app.route('/archivoPDF')
@csrf.exempt
def descargar_archivo():
    archivo = 'Documentos\Diccionario_de_datos.pdf'

    return send_file(archivo, as_attachment=True)

@app.route('/archivoExcel')
@csrf.exempt
def descargar_archivo2():
    archivo = 'Documentos\Plantilla.xlsx'

    return send_file(archivo, as_attachment=True)
# SUBIR DATOS

@app.route('/CargaArchivo')
@login_required
def carga():
    if current_user.role == 'admin':
        return render_template('cargaArchivo.html')
    else:
        return redirect(url_for('menu'))


@app.route('/cargar', methods=['POST'])
@csrf.exempt
def cargar_archivo():
    try:
        archivo = request.files['archivo']
        tablas = []
        if archivo:
            # Establecer la conexión con la base de datos
            
            conn = CONEXION(configuracion["database1"]["host"],
                                configuracion["database1"]["port"],
                                configuracion["database1"]["user"],
                                configuracion["database1"]["passwd"],
                                configuracion["database1"]["db"])
            #cursor = conn.consultar_db2

            # Lee el archivo Excelconn = CONEXION(configuracion["database1"]["host"],
            datos = pd.read_excel(archivo, sheet_name=None)
            menssaje=""
            aux=False
            # Recorre todas las hojas y guarda los datos en la base de datos
            for hoja, datos_hoja in datos.items():
                # Convierte los datos de la hoja a una lista de tuplas
                filas = [tuple(x) for x in datos_hoja.values]

                # Genera el SQL para insertar los datos en la tabla correspondiente
                tabla = hoja  # Nombre de la tabla en la base de datos
                campos = ','.join(datos_hoja.columns)  # Nombres de las columnas
                marcadores = ','.join(['%s'] * len(datos_hoja.columns))  # Marcadores de posición para los valores
                
                if (tabla=="municipio"):
                    # Construye la consulta SQL
                    insert = f"INSERT INTO {tabla} ({campos}) VALUES ({marcadores})"
                    # texto de abajo es ejemplo apra mostrar una tabla
                    #tablas.append(tabla)
                    # Inserta los datos en la base de datos
                    conn.consultar_db2(insert, filas)
                    tablas.append(tabla)
                    aux=True
                if (tabla=="usuarios"):
                    menssaje="No se pueden crear ni modificar usuarios."
                    tablas.append(menssaje)
                else:
                    columnas2 = datos_hoja.columns[2:]
                    cadena_SQL=""
                    for i in columnas2:
                        cadena_SQL += i + " = VALUES(" + i + "),"
                    cadena_SQL=cadena_SQL[:-1] 
                    # Construye la consulta SQL
                    #ON Conflict para postgre
                    insert = f"INSERT INTO {tabla} ({campos}) VALUES ({marcadores}) ON DUPLICATE KEY UPDATE {cadena_SQL}"
                    
                    # texto de abajo es ejemplo apra mostrar una tabla
                    #tablas.append(tabla)
                    # Inserta los datos en la base de datos
                    conn.consultar_db2(insert, filas)
                    tablas.append(tabla)
            if menssaje=="":
                menssaje = "Archivos cargados con exíto."
            elif menssaje!="" and aux:
                menssaje += "Los otros archivos fueron cargados con exíto."
            #agregar se ha subido exitosamente
            return render_template('cargaArchivo.html', mensaje = menssaje)
        return render_template('cargaArchivo.html')
    
    except (pymysql.IntegrityError, pymysql.ProgrammingError) as error:
        if isinstance(error, pymysql.IntegrityError):
            return render_template('integrity_error.html', error=error, carga=tablas), 500
        elif isinstance(error, pymysql.ProgrammingError):
            return render_template('programming_error.html', error=error), 500

# error 
@app.errorhandler(Exception)
def handle_error(error):
    return render_template('programming_error.html', error=error), 500

# error para AttributeError
@app.errorhandler(AttributeError)
def handle_attribute_error(error):
    return render_template('attribute_error.html', error=error), 500

@app.route('/archivoPDF')
@csrf.exempt
def descargar_archivo():
    archivo = 'Documentos\Diccionario_de_datos.pdf'

    return send_file(archivo, as_attachment=True)

@app.route('/archivoExcel')
@csrf.exempt
def descargar_archivo2():
    archivo = 'Documentos\Plantilla.xlsx'

    return send_file(archivo, as_attachment=True)

if __name__ == '__main__':
    signal.signal(signal.SIGINT, interrupcion)
    app.run(debug=True, port=8000)
