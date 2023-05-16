from flask import Flask, render_template, request, redirect, jsonify, send_file, send_from_directory, url_for
import threading, multiprocessing, time, signal, sys
from flask_sslify import SSLify
from random import sample
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

#Para subir archivo tipo foto al servidor
from werkzeug.utils import secure_filename 
import os

#Declarando nombre de la aplicación e inicializando
app = Flask(__name__)

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

@app.route('/',methods=["GET", "POST"])
def login():
    if request.method == 'POST':
        # Obtener los datos enviados por el formulario
        usern = request.form['username']
        passw = request.form['password']

        # Realizar la validación de las credenciales
        conn = CONEXION(configuracion["database1"]["host"],
                    configuracion["database1"]["port"],
                    configuracion["database1"]["user"],
                    configuracion["database1"]["passwd"],
                    configuracion["database1"]["db"])
        
        consulta = configuracion.get("consulta_usuarios","usuario").format(username=usern, password=passw)
        user = conn.consultar_db(consulta)

        if user:
            # Inicio de sesión exitoso, redirigir a una página de inicio
            return redirect(url_for('menu'))
        else:
            # Credenciales incorrectas, mostrar un mensaje de error
            error_message = 'Credenciales incorrectas. Inténtalo de nuevo.'
            return render_template('login.html', error_message=error_message)
    else:
        # Método GET, mostrar el formulario de inicio de sesión
        return render_template("login.html")

@app.route('/Borrador')
def borrador():
    return render_template('Borrador.html')

@app.route('/DatosMunicipio')
def data():
    return render_template('DatosMunicipio.html')

@app.route('/Paleta1')
def paleta1():
    return render_template('paleta1v3.html')

@app.route('/Paleta2')
def paleta2():
    return render_template('paleta2v3.html')

@app.route("/Menu",methods=["GET", "POST"])
def menu():
    return render_template("menu.html")

@app.route("/menuOpc",methods=["POST"])
def menuOpc():
    json = request.get_json()
    modo = json["modo"] 
    if(modo=="graficas"):
        data_mapa = {'resp': "/Graficas"}
    elif(modo=="mapa"):
        data_mapa = {'resp': "/Mapa"}
    return data_mapa

@app.route("/Mapa",methods=["GET", "POST"])
def mapa():
    return render_template("mapa.html")
     
#Creando un Decorador
@app.route('/Graficas', methods=['GET', 'POST'])
def home():
    return render_template('index.html')

@app.route("/consultas-buscador", methods=['POST'])
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
def impresiones():
    json = request.get_json()
    conn = CONEXION(configuracion["database1"]["host"],
                    configuracion["database1"]["port"],
                    configuracion["database1"]["user"],
                    configuracion["database1"]["passwd"],
                    configuracion["database1"]["db"])
    tipo = json["tipo_c"]
    global ruta_pdf
    if(tipo=="apoyo"):
        respuesta = conn.consultar_db(f"select NombreA, NoApoyos from Apoyos where YearA={json['year']} and ClaveMunicipal={json['id']};")
        if(json["modo"] == "impresion"):
            ruta_pdf = Apoyos.GenerarApoyos(int(json["year"]), int(json["id"]))
    elif(tipo=="deli"):
        respuesta = conn.consultar_db(f"select DelitosAI, Homicidios, Feminicidios, Secuestros, DespT, Robo, RoboT from Delincuencia where YearD={json['year']} and ClaveMunicipal={json['id']};")
        if(json["modo"] == "impresion"):
            ruta_pdf = Delincuencia.GenerarDelincuencia(int(json["year"]), int(json["id"]))
    elif(tipo=="padron"):
        respuesta = conn.consultar_db(f"select  PHombres, PMujeres, PTotal, LNHombres, LNMujeres, LNTotal from PadronElectoral where YearE={json['year']} and ClaveMunicipal={json['id']};")
        if(json["modo"] == "impresion"):
            ruta_pdf = Padron.GenerarPadron(int(json["year"]), int(json["id"]))
    elif(tipo=="pobreza"):
        respuesta = conn.consultar_db(f"select Pobreza, PobExt, PobMod, RezagoEd, CarSS, CarCalidadViv, CarAlim, PIB, UET from TPobreza where YearP={json['year']} and ClaveMunicipal={json['id']};")
        if(json["modo"] == "impresion"):
            ruta_pdf = Pobreza.GenerarPobreza(int(json["year"]), int(json["id"]))
    else:
        respuesta = " "
        if(json["modo"] == "impresion"):
          ruta_pdf = General.GenerarG(int(json["year"]), int(json["id"]))
    data_mapa = {'consulta': respuesta}
    return jsonify(data_mapa)

@app.route("/pdf")
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


if __name__ == '__main__':
    signal.signal(signal.SIGINT, interrupcion)
    app.run(debug=True, port=8000)
