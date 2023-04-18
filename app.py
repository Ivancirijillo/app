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
    return 'Ruta no encontrada'

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
        fin = int(js["datos"][1])+1
        n_saltos = fin-inicio 
        consulta = configuracion.get("consultas_buscador","rango_id").format(inicio=inicio, fin=fin) if(15000 < inicio < 15126) else configuracion.get("consultas_buscador","rango_seccion").format(inicio=inicio, fin=fin)
        respuesta = conn.consultar_db(consulta)
        filtro_1 = encontrar_municipio(respuesta)
        diccionario = separar_por_partidos(respuesta, filtro_1, n_saltos)

    elif(js["tipo"] == "nombre"):
        municipio = int(js["datos"])
        consulta1 = "("
        for i in (js["years"]):
            consulta1 += f" yearV={i} or"
        consulta1 = consulta1[:-2] + ") order by v.ClaveMunicipal"
        
        if(js["datos"].isdigit()):
            consulta = configuracion.get("consultas_buscador","busca_por_yearv").format(id=js["datos"], year=i) if(1500< municipio <15126) else configuracion.get("consultas_buscador","varios_seccion").format(seccion=js["datos"])
            respuesta = conn.consultar_db(consulta+consulta1)
            lista.append(eliminar_decimal(respuesta))
        else:
            consulta = configuracion.get("consultas_buscador","busca_por_yearv").format(id=js["datos"], year=2015)
        #respuesta = conn.consultar_db(consulta)
        
        print(lista[0][0])
        # lista.append(lista1[0])

        # arreglo.append(len(lista[0]))
        # diccionario["m_0"] = {
        #     lista[0][0][0]:{}
        # }        

        diccionario["m_0"]={}
        diccionario["m_0"][lista[0][0]]={}
        for i in range(1,17):
            diccionario["m_0"][lista[0][0]][PARTIDOS[i-1]] = lista[0][i]
        # while(contador <= 17):
        #     diccionario["m_0"][lista1[0]][PARTIDOS[contador-1]] = []
        #     diccionario["m_0"][lista1[0]][PARTIDOS[contador-1]].append(lista1[contador])
        #     contador +=1
            
        
        # while(contador <= 17):
        #     diccionario["m_0"][lista1[0][0][0]][PARTIDOS[contador-1]] = []
        #     for j in range(0,len(lista1)):
        #         diccionario["m_0"][lista1[0][0][0]][PARTIDOS[contador-1]].append(lista1[0][j][contador])
        #     contador += 1
        # contador = 1

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
    """
    encontrar saltos
    """
    municipio_actual = respuesta[0][0]
    saltos = {}
    contador = 0
    salto = 0
    for i in range(len(respuesta)):
        aux = len(respuesta)-1 if(i+1>=len(respuesta)) else (i+1)
        if(municipio_actual == respuesta[aux][0]):
            contador += 1
        else:
            contador += 1
            saltos[f"m_{salto}"] = []
            saltos[f"m_{salto}"] = {
                "municipio": municipio_actual,
                "secciones":contador
            }
            contador = 0
            municipio_actual = respuesta[aux][0]
            salto += 1
    return saltos

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

def separar_por_partidos(respuesta, saltos, n_saltos):
    """
    llenado de diccionario con separacion por municipios y partidos
    """
    lista = {}
    salto = 0
    contador = 1
    municipio_actual = respuesta[0][0] # nos colocamos en la primer posicion de la consulta y en su primer valor , municipio
    for i in range(len(respuesta)):
        aux = len(respuesta)-1 if((i+1) >= len(respuesta)) else (i+1) # determinamos el valor maximo que puede tener aux
        salto = (n_saltos-1) if(salto >= n_saltos) else salto # si el salto supera el rango de saltos dado, entonces le asignara el numero de saltos - 1
        if(municipio_actual == respuesta[aux][0]):
            lista[f"m_{salto}"]={
                respuesta[aux][0] : {}
            }
            while(contador <= 11):
                lista[f"m_{salto}"][respuesta[aux][0]][PARTIDOS[contador-1]] = []
                for j in range(int(saltos[f"m_{salto}"]["secciones"])):
                    lista[f"m_{salto}"][respuesta[aux][0]][PARTIDOS[contador-1]].append(respuesta[j][contador])
                contador += 1
            contador = 1
        else:
            municipio_actual = respuesta[aux][0]
            salto += 1
    return lista

def eliminar_decimal(respuesta):
    cadena = ','.join(str(elem) for elem in respuesta)
    lista = cadena.split(',')
    for i in range(len(lista)):
        lista[i] = lista[i].replace("(", "").strip()
        lista[i] = lista[i].replace("Decimal", "").strip()
        lista[i] = lista[i].replace(")", "").strip()
        lista[i] = lista[i].replace("'", "").strip()
    return lista

if __name__ == '__main__':
    signal.signal(signal.SIGINT, interrupcion)
    app.run(debug=True, port=8000)
