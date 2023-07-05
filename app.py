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
        user = conn.consultar_db(consulta)
        
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
    return render_template('Borrador.html')

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
    secciones= ["rezago", "apoyos", "economia", "poblacion", "tpobreza", "empleo", "deli", "padron", "nombre", "unidades", "pib"]
    # Realizar la validación de las credenciales
    conn = CONEXION(configuracion["database1"]["host"],
                configuracion["database1"]["port"],
                configuracion["database1"]["user"],
                configuracion["database1"]["passwd"],
                configuracion["database1"]["db"])
    
    #REZAGO SOCIAL
    consulta = configuracion.get("consulta_pagina",secciones[0]).format(clave=clavemun)
    resultados = conn.consultar_db(consulta)
    lista= tratamiento(resultados, diccionario, secciones[0])

    #APOYOS
    consulta = configuracion.get("consulta_pagina",secciones[1]).format(clave=clavemun)
    resultados = conn.consultar_db(consulta)
    lista= tratamiento(resultados, diccionario, secciones[1])

    #Economia
    consulta = configuracion.get("consulta_pagina",secciones[2]).format(clave=clavemun)
    resultados = conn.consultar_db(consulta)
    lista= tratamiento(resultados, diccionario, secciones[2])

    #Poblacion
    consulta = configuracion.get("consulta_pagina",secciones[3]).format(clave=clavemun)
    resultados = conn.consultar_db(consulta)
    lista= tratamiento(resultados, diccionario, secciones[3])

    #Pobreza
    consulta = configuracion.get("consulta_pagina",secciones[4]).format(clave=clavemun)
    resultados = conn.consultar_db(consulta)
    lista= tratamiento(resultados, diccionario, secciones[4])

    #Empleo
    consulta = configuracion.get("consulta_pagina",secciones[5]).format(clave=clavemun)
    resultados = conn.consultar_db(consulta)
    lista= tratamiento(resultados, diccionario, secciones[5])

    #Delincuencia
    consulta = configuracion.get("consulta_pagina",secciones[6]).format(clave=clavemun)
    resultados = conn.consultar_db(consulta)
    lista= tratamiento(resultados, diccionario, secciones[6])

    #Padron
    consulta = configuracion.get("consulta_pagina",secciones[7]).format(clave=clavemun)
    resultados = conn.consultar_db(consulta)
    lista= tratamiento(resultados, diccionario, secciones[7])

    #Nombre
    consulta = configuracion.get("consulta_pagina",secciones[8]).format(clave=clavemun)
    resultados = conn.consultar_db(consulta)
    lista= tratamiento(resultados, diccionario, secciones[8])

    #Unidades Economicas
    consulta = configuracion.get("consulta_pagina",secciones[9]).format(clave=clavemun)
    resultados = conn.consultar_db(consulta)
    lista= tratamiento(resultados, diccionario, secciones[9])

    #PIB
    consulta = configuracion.get("consulta_pagina",secciones[10]).format(clave=clavemun)
    resultados = conn.consultar_db(consulta)
    lista= tratamiento(resultados, diccionario, secciones[10])

    return jsonify(lista)

@app.route("/consultas-buscador", methods=['POST'])
@csrf.exempt
def consultas_buscador():
    js = request.get_json()
    lista = []
    arreglo = []
    contador = 1
    diccionario = {}
    conn = CONEXION(configuracion["database1"]["host"],
                    configuracion["database1"]["port"],
                    configuracion["database1"]["user"],
                    configuracion["database1"]["passwd"],
                    configuracion["database1"]["db"])
    
    if(js["tipo"] ==  "varios"):
        print(js["datos"])
        if(js["datos"][0].isdigit()):
            for id_m in js["datos"]:
                for year in js["years"]:
                    diccionario[year] = []
                    consulta = configuracion.get("consultas_buscador", "busca_por_yearv").format(id=id_m, year=year) if(15000 < int(js["datos"][0]) < 15126) else configuracion.get("consultas_buscador", "toma_tu_consulta").format(seccion=id_m, year=year)
                    respuesta = conn.consultar_db(consulta)
                    lista.append(eliminar_decimal(respuesta))
        
        diccionario = crear_diccionario(lista,diccionario)
        
    elif(js["tipo"] ==  "rango"):
        inicio =int(js["datos"][0])
        if(15000 < inicio < 15126):
            fin = int(js["datos"][1])
            fin  = 15125 if(fin == 15125) else fin
            for id_m in range(inicio, fin+1):
                for year in (js["years"]):
                    diccionario[year] = []
                    consulta = configuracion.get("consultas_buscador","busca_por_yearv").format(id=id_m, year=year)
                    respuesta = conn.consultar_db(consulta)
                    lista.append(eliminar_decimal(respuesta))
            print(len(lista))
            #print(encontrar_municipio(lista))
        else:
            inicio =int(js["datos"][0])
            fin = int(js["datos"][1])
            for id_m in range(inicio, fin+1):
                for year in (js["years"]):
                    diccionario[year] = []
                    consulta = configuracion.get("consultas_buscador","toma_tu_consulta").format(seccion=id_m, year=year)
                    respuesta = conn.consultar_db(consulta)
                    #print(respuesta)
                    lista.append(eliminar_decimal(respuesta))
            print(len(lista))
        diccionario = crear_diccionario(lista,diccionario)
        #print(diccionario)
       
    elif(js["tipo"] == "nombre"):
        
        if(js["datos"].isdigit()):
            municipio = int(js["datos"])
            for year in js["years"]:
                diccionario[year] = []
                consulta = configuracion.get("consultas_buscador","busca_por_yearv").format(id=js["datos"], year=year) if(15000< municipio <15126) else configuracion.get("consultas_buscador","varios_seccion").format(seccion=js["datos"], year=year)
                respuesta = conn.consultar_db(consulta)
                #print(respuesta)
                lista.append(eliminar_decimal(respuesta))
            #print(consulta+consulta1)
            #respuesta = conn.consultar_db(consulta+consulta1)
            #print(respuesta)
            #lista.append(eliminar_decimal(respuesta))
        else:
            for year in js["years"]:
                diccionario[year] = []
                consulta = configuracion.get("consultas_buscador","nombreM").format(municipio=js["datos"], year=year)
                respuesta = conn.consultar_db(consulta)
                lista.append(eliminar_decimal(respuesta))   
            #print(lista)

        diccionario = crear_diccionario(lista,diccionario)
        #print(diccionario)
    
    data = {'datos': diccionario}
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
    elif(tipo=="Padrón Electora"):
        respuesta = conn.consultar_db(f"select  PHombres, PMujeres, PTotal, LNHombres, LNMujeres, LNTotal from PadronElectoral where YearE={json['year']} and ClaveMunicipal={json['id']};")
        if(json["modo"] == "impresion"):
            ruta_pdf = Padron.GenerarPadron(int(json["year"]), int(json["id"]))
    elif(tipo=="Pobreza"):
        respuesta = conn.consultar_db(f"select Pobreza, PobExt, PobMod, RezagoEd, CarSS, CarCalidadViv, CarAlim, PIB, UET from TPobreza where YearP={json['year']} and ClaveMunicipal={json['id']};")
        if(json["modo"] == "impresion"):
            ruta_pdf = Pobreza.GenerarPobreza(int(json["year"]), int(json["id"]))
    elif(tipo=="Votos"):
        respuesta = conn.consultar_db(f"select yearV, V_VALIDOS, V_NULOS, TOTAL_V, LISTA_N from votos where yearV={json['year']} and SECCION={json['id']};")
        print(respuesta)
    else:
        respuesta = " "
        if(json["modo"] == "impresion"):
          ruta_pdf = General.GenerarG(int(json["year"]), int(json["id"]))
    data_mapa = {'consulta': respuesta}
    return jsonify(data_mapa)

@app.route("/pdf")
@login_required
def abrir_pdf():
    global ruta_pdf
    print(ruta_pdf)
    return send_file(ruta_pdf)

def interrupcion(sig, frame):
    print("Se ha interrumpido el programa con Ctrl+C")
    sys.exit(0)

def encontrar_municipio(respuesta):
    municipio_actual = respuesta[0][0]
    municipios = []
    secciones = []
    contador = 0
    municipios.append(municipio_actual)
    for i in range(len(respuesta)):
        if(municipio_actual == respuesta[i][0]):
            contador += 1
        else:
            secciones.append(contador)
            municipio_actual = respuesta[i][0]
            municipios.append(municipio_actual)
            contador = 1
    secciones.append(contador) # Agregar la última sección
    return municipios, secciones

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

def eliminar_decimal(respuesta):
    cadena = ','.join(str(elem) for elem in respuesta)
    lista = cadena.split(',')
    for i in range(len(lista)):
        lista[i] = lista[i].replace("(", "").strip()
        lista[i] = lista[i].replace("Decimal", "").strip()
        lista[i] = lista[i].replace(")", "").strip()
        lista[i] = lista[i].replace("'", "").strip()
    return lista

def crear_consulta(js):
    consulta1 = "("
    for i in (js["years"]):
        consulta1 += f" yearV={i} or"
    return consulta1[:-2] + ") order by v.ClaveMunicipal"

def tratamiento(tupla,diccionario,atributo):
    cadena = ','.join(str(elem) for elem in tupla)
    lista = cadena.split(',')
    for i in range(len(lista)):
        lista[i] = lista[i].replace("(", "").strip()
        lista[i] = lista[i].replace(")", "").strip()
        lista[i] = lista[i].replace("'", "").strip()
        lista[i] = lista[i].replace("None", "0").strip()
    
    diccionario [atributo]= lista

    return diccionario

def crear_diccionario(lista, diccionario):
    municipios, secciones = encontrar_municipio(lista)
    aux = 0
    #print(secciones)
    for year in diccionario.keys():
        diccionario[year] = []
        for i in range(len(municipios)):
            diccionario[year].append({municipios[i]:{}})
    # if(len(municipios)>1):
    #print("calla fede ",diccionario)
    for i in range(len(municipios)):
        for year in diccionario.keys():
            for j in range(1,len(PARTIDOS)+1):
                diccionario[year][i][municipios[i]][PARTIDOS[j-1]] = lista[aux][j]
                #print(aux)
            aux+=1
    # else:
    #     for year in diccionario.keys():
    #         for i in range(len(municipios)):
    #             for j in range(1,17):
    #                 diccionario[year][i][municipios[i]][PARTIDOS[j-1]] = lista[aux][j] 
    #             aux+=1
    #print("dic")
    #print("pepe ",diccionario)
    #print(diccionario)
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
            menssaje = "Archivo cargado con exíto"
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
