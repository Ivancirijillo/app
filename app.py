from flask import Flask, render_template, request, redirect, jsonify, send_file, send_from_directory
import threading, multiprocessing, time, signal, sys
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
    valio=random.randrange(0, 2, 1)
    #(0, 1000, 1)
    if valio==0:
        pagina="Pazul.html"
        pantallaC=True
    else: 
        pagina="404.html"
    return render_template(pagina)

@app.route('/Paleta1')
def paleta1():
    return render_template('paleta1v3.html')

@app.route('/Paleta2')
def paleta2():
    return render_template('paleta2v3.html')

@app.route("/",methods=["GET", "POST"])
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
    
def crear_grafica(columnas, documentofiltrado, municipio):
    for partido in columnas[1:]:
        plt.bar(partido, int(documentofiltrado[partido].sum()))#creacion de cada barra de los partidos
   
    #creacion de etiquetas
    plt.title("Votos por partido de "+ municipio)
    plt.ylabel("N° Votos")
    plt.xlabel("Partido")
    #mostramos la grafica
    plt.show()

@app.route("/consulta-municipio", methods=['POST', 'GET'])
def consultar_tablas():
    js = request.get_json()
    
    conn = CONEXION(configuracion["database1"]["host"],
                    configuracion["database1"]["port"],
                    configuracion["database1"]["user"],
                    configuracion["database1"]["passwd"],
                    configuracion["database1"]["db"])
    
    print(int(js["municipio"][0]))
    seccion = int(js["municipio"][0])

    consulta_1 = conn.consultar_db(configuracion.get("consultas_graficaspy", "partidos").format(seccion=seccion))
    consulta_2 = conn.consultar_db(configuracion.get("consultas_graficaspy", "sumaPartidos").format(seccion=seccion))
    nombre_figura = f"{consulta_1[0][0]}.png"
    
    grafico = multiprocessing.Process(target=crear_grafico, args=(consulta_1, consulta_2))
    grafico.start()
    grafico.join()

    
    respuesta = {
        'nombre_grafica': nombre_figura,
        'consulta1':consulta_1
    }
    
    return jsonify(respuesta)
    
def crear_grafico(consulta_1, consulta_2):
    direccion_figura = os.path.dirname(__file__) + f"/static/imgs/{consulta_1[0][0]}.png"
    aux = 0
    for partido in PARTIDOS:
        plt.bar(partido, consulta_2[0][aux])
        altura = 0 if(consulta_2[0][aux] == 0)  else consulta_2[0][aux]/2
        plt.text(aux, altura, str(consulta_2[0][aux]), ha='center', va='bottom')
        aux += 1
    
    plt.title(f"Votos por partido de {consulta_1[0][0]}")
    plt.xlabel("Partidos")
    plt.ylabel("Nº votos")
    plt.savefig(direccion_figura)
    #plt.show()

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
        for dato in js["datos"]:
            if(dato.isdigit()):
                consulta = configuracion.get("consultas_buscador","varios_id").format(id=dato) if(15000 < int(dato) < 15126) else configuracion.get("consultas_buscador","varios_seccion").format(seccion=dato)
            else:
                consulta = configuracion.get("consultas_buscador", "nombreM").format(dato=dato)
            
            respuesta = conn.consultar_db(consulta)
            lista.append(respuesta)

        for i in range(len(lista)):
            arreglo.append(len(lista[i]))

        for i in range(0,len(lista)):
            diccionario[f"m_{i}"] = {
                lista[i][0][0]:{}
            }
            while(contador <= 11):
                diccionario[f"m_{i}"][lista[i][0][0]][PARTIDOS[contador-1]] = []
                for j in range(0,arreglo[i]):
                    diccionario[f"m_{i}"][lista[i][0][0]][PARTIDOS[contador-1]].append(lista[i][j][contador])
                    
                contador += 1
            contador = 1

    elif(js["tipo"] ==  "rango"):
        inicio =int(js["datos"][0])
        fin = int(js["datos"][1])
        consulta1 = crear_consulta(js)

        consulta = configuracion.get("consultas_buscador","rango_id").format(inicio=inicio, fin=fin) if(15000 < inicio < 15126) else configuracion.get("consultas_buscador","rango_seccion").format(inicio=inicio, fin=fin)
        print(consulta)
        respuesta = conn.consultar_db(consulta)
        diccionario = separar_por_partido(respuesta)
        # lista.append(eliminar_decimal(respuesta))
        # diccionario = crear_diccionario(lista,diccionario)
       

    elif(js["tipo"] == "nombre"):
        
        consulta1 = crear_consulta(js)
        
        if(js["datos"].isdigit()):
            municipio = int(js["datos"])
            consulta = configuracion.get("consultas_buscador","busca_por_yearv").format(id=js["datos"]) if(15000< municipio <15126) else configuracion.get("consultas_buscador","varios_seccion").format(seccion=js["datos"])
            print(consulta+consulta1)
            respuesta = conn.consultar_db(consulta+consulta1)
            print(respuesta)
            lista.append(eliminar_decimal(respuesta))
        else:
            consulta = configuracion.get("consultas_buscador","nombreM").format(municipio=js["datos"])
            
            respuesta = conn.consultar_db(consulta+consulta1)
            
            lista.append(eliminar_decimal(respuesta))   

        diccionario = crear_diccionario(lista,diccionario)
    
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

def encontrar_seccion(respuesta):
    """
    encontrar saltos
    """
    seccion_actual = respuesta[0][0]
    saltos = {}
    contador = 0
    salto = 0
    for i in range(len(respuesta)):
        aux = len(respuesta)-1 if(i+1>=len(respuesta)) else (i+1)
        if(seccion_actual == respuesta[aux][0]):
            contador += 1
        else:
            contador += 1
            saltos[f"m_{salto}"] = []
            saltos[f"m_{salto}"] = {
                "municipio": seccion_actual,
                "secciones":contador
            }
            contador = 0
            seccion_actual = respuesta[aux][0]
            salto += 1
    return saltos

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
    diccionario[lista[0][0]]={}
    for i in range(1,17):
        diccionario[lista[0][0]][PARTIDOS[i-1]] = lista[0][i]
    return diccionario

if __name__ == '__main__':
    signal.signal(signal.SIGINT, interrupcion)
    app.run(debug=True, port=8000)
