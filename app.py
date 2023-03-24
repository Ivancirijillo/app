from flask import Flask, render_template, request, redirect, jsonify
import threading, multiprocessing, time
from random import sample
import pandas as pd
import json
import matplotlib.pyplot as plt
from conexion import CONEXION
import configparser
import pymysql
#constantes 
COLUMNAS_A_ELIMINAR = ["CIRCUNSCRIPCION", "ID_ESTADO","NOMBRE_ESTADO", "ID_DISTRITO", "CABECERA_DISTRITAL","ID_MUNICIPIO", "CASILLAS"]
PARTIDOS = ["PRI", "PAN", "MORENA", "PRD", "IND"]
#configuracion de archivo ini
configuracion = configparser.ConfigParser()
configuracion.read("configuracion.ini")
configuracion.sections()

#variables globales 
columnas = []

#Para subir archivo tipo foto al servidor
from werkzeug.utils import secure_filename 
import os


#Declarando nombre de la aplicación e inicializando
app = Flask(__name__)

#Redireccionando cuando la página no existe
@app.errorhandler(404)
def not_found(error):
    return 'Ruta no encontrada'

@app.route("/mapa",methods=["GET", "POST"])
def mapa():
    return render_template("mapa.html")

@app.route('/municipios', methods=['GET', 'POST'])
def municipio():
    return render_template("filtro.html")
     
#Creando un Decorador
@app.route('/', methods=['GET', 'POST'])
def home():
    return render_template('index.html')

@app.route('/registrar-archivo', methods=['GET', 'POST'])
def registarArchivo():
        if request.method == 'POST':

            #Script para archivo
            file     = request.files['archivo']
            basepath = os.path.dirname (__file__) #La ruta donde se encuentra el archivo actual
            filename = secure_filename(file.filename) #Nombre original del archivo
            
            #capturando extensión del archivo ejemplo: (.png, .jpg, .pdf ...etc)
            extension           = os.path.splitext(filename)[1]
            nombre              = os.path.splitext(filename)[0]
            nuevoNombreFile     = nombre + extension

            upload_path = os.path.join (basepath, 'static/archivos', nuevoNombreFile) 
            #guardamos el documento actual
  
            file.save(upload_path)
            #crear hilo para la creacion del nuevo archivo
            nuevo_hilo1 = threading.Thread(target=crear_nuevo_archivo, args=(upload_path, ))
            nuevo_hilo1.start()
            nuevo_hilo1.join()
            #crear hilo para analizar el archivo
            nuevo_hilo2 = threading.Thread(target=analizar, args=(upload_path, nombre))
            nuevo_hilo2.start()
            nuevo_hilo2.join()
            
            return render_template('filtro.html')
        return render_template('index.html')

@app.route('/filtro',methods=['GET', 'POST'])
def filtrar():
    return render_template('filtro.html')

@app.route('/test',methods=['POST', 'GET'])
def test():
    #variables datos
    basepath = os.path.dirname (__file__)
    recibido = request.get_json()
    jeison = json.loads(recibido)
    ruta_temp = basepath+f"/static/archivos/{jeison[0]}"
    #variable global
    global columnas 
    columnas = jeison[1::]
    #abrir archivo
    archivo = pd.read_excel(ruta_temp)
    captura = archivo[jeison[1::]].head(15)
    ruta_archivo = basepath+f"/templates/tables/{os.path.splitext(jeison[0])[0]}"+".html"
    captura.to_html(ruta_archivo)
    #leer archivo
    doc1 = open(ruta_archivo,"r")
    doc2 = ""
    for linea in doc1:
         doc2 += linea

    print(archivo[jeison[1::]].head(15))

    print(jeison[0])
    filtroMunicipio(ruta_archivo, jeison[0])
    return render_template("/tables/Res_Definitivos_Gobernador_2017_por_seccion.html",tabla=doc2)
    
def analizar(archivo, nombre):
    basepath = os.path.dirname (__file__)
    ruta_temp = basepath+f"/static/temp/{nombre}.log"
    ruta = basepath+"/static/temp/cabecera.txt"
    contador = 0
    checkbox = "<div class='contenedor'>\n  <h1>Seleccione las columnas deseadas</h1>\n <label class='archivo' id='"
    checkbox += nombre+".xlsx"+"'></label>\n</div>\n"
    checkbox += "<div class='boton'>\n  <button type='button' class='enviar'>Enviar</button>\n</div>\n<div class='filtro'>\n"
    documento = open(ruta_temp,"w")

    #documento de excel
    res = pd.read_excel(archivo)
    valores_columnas = res.columns.values
    numero_columnas = str(len(res.columns.values))

    #crear cojunto de checkbox
    for valor in valores_columnas:
        contador += 1
        checkbox += "<label class='chbox'><input type='checkbox' class='cbox' id='cbox"
        checkbox += str(contador)+"'"
        checkbox += "value='"
        checkbox += str(valor)+"'> "
        checkbox += str(valor)+"</label>\n"
    
    #creacion de html
    checkbox += "</div>\n" 
    nuevo =''
    doc1 = open(ruta,"r")

    for linea in doc1:
        nuevo += linea
    
    nuevo += checkbox

    doc2 = open(basepath+"/templates/filtro.html","w")
    doctxt = open(basepath+"/templates/filtro.txt","w")
    ######
    #creamos tablas

    captura = res.iloc[0:20, 0:10] #filas, columnas
    captura.to_html(basepath+f'/templates/tables/{nombre}.html', index=False)
    #agregamos tablas al documento filtro
    doc3 = open(basepath+f'/templates/tables/{nombre}.html')
    nuevo += "\n\n<div class='tabla'>\n"
    nuevo2 = ''
    for linea2 in doc3:
        nuevo2 += linea2

    nuevo += nuevo2
    nuevo += "\n<div class='aux'>{{ tabla }}</div>\n"
    nuevo += "\n</div><div class='contenedor2'>\n</div>\n\n</div>\n"
    nuevo += "<script src=\"{{ url_for('static', filename ='js/filtro.js') }}\"></script>"
    nuevo += "</body>\n</html>\n"

    doc2.write(nuevo)
    doctxt.write(nuevo)

    documento.write("nombre:"+nombre+"\n")
    documento.write("columnas:"+str(valores_columnas)+"\n")
    documento.write("numero de columnas:"+numero_columnas+"\n")
    
    print(captura)

def filtroMunicipio(tabla, nombre):
    basepath = os.path.dirname (__file__)
    cabecera = basepath+"/templates/filtro.txt"
    muni = basepath+"/static/temp/municipios.txt"
    rutaArchivo = basepath+"/static/archivos/"+nombre

    municipios = open(muni,"r")
    doc1 = open(cabecera,"r")
    dochtml = open(basepath+"/templates/filtro.html", "w")

    final = ""
    for linea in doc1:
        final += linea
        if 'contenedor2' in linea:
            print("coincidencia")
            break
            
    #creamos div contenedor
    final += "\n<h1>Seleccione el municipio deseado</h1>\n</div>\n"  
    final += "\n<div class='boton2'>\n  <button type='button' class='filtrar'>Enviar</button>\n</div>\n"  
    final += f"\n<label class='archivo2' id='{rutaArchivo}'></label>\n<div class='filtro2'>\n"

    #creamos botones radio
    botones = ""
    for linea in municipios:
        aux = linea.replace("\n", "")
        botones += f"<i><input type='radio' id='{aux}' name='group1' value='{aux}'><label class='rad' for='radio'>{aux}</label></i>\n"
    #agregamos botones a contenedor
    final += botones
    final += "</div>\n"
    #leemos el archivo tabla
    tabl = open(tabla, "r")
    filas = ""
    for linea in tabl:
        filas += linea

    #creamos div tabla
    final += "<div class='tabla2'>\n"
    #agregamos la tabla
    final += filas
    #cerramos div tabla
    final += "\n</div>\n"
    #agregamos acciones con js
    final += "\n<script src=\"{{ url_for('static', filename ='js/municipios.js') }}\"></script>\n<script src=\"{{ url_for('static', filename ='js/filtro.js') }}\"></script>"
    #cerramos el cuerpo y el html
    final += "</body>\n</html>\n"
    #creamos el documento final
    dochtml.write(final)

@app.route("/resultado", methods=['POST', 'GET'])
def filtrofila():
    #datos globales
    global columnas
    #creacion de json
    datos = request.get_json()
    data = json.loads(datos)
    #data desglosada
    archivo = data[0]
    municipio = data[1]
    #creacion de documento
    documento = pd.read_excel(archivo)
    documentofiltrado = documento[documento[columnas[0]].str.contains(str(municipio).upper())]
    #creacion de un hilo
    hilo1 = multiprocessing.Process(target=crear_grafica, args=(columnas, documentofiltrado, municipio ))
    hilo1.start()
    hilo1.join()#unimos el hilo principal con hilo1

    # print(documentofiltrado[columnas])
    return render_template("filtro.html")

def crear_grafica(columnas, documentofiltrado, municipio):
    for partido in columnas[1:]:
        plt.bar(partido, int(documentofiltrado[partido].sum()))#creacion de cada barra de los partidos
   
    #creacion de etiquetas
    plt.title("Votos por partido de "+ municipio)
    plt.ylabel("N° Votos")
    plt.xlabel("Partido")
    #mostramos la grafica
    plt.show()

#funcion para crea nuevo archivo sin cabecera
def crear_nuevo_archivo(documento):
    #variables de analizis
    incompleto = True
    fila = 1 # primer celda del documento
    filas_a_eliminar = 0 # filas por eliminar
    eliminar = False # determina si hay que eliminar la fila por defecto del documento
    archivo = pd.read_excel(documento, header=None) # leemos el archivo sin encabezado
    candid = []
    indep = []
    aux=1

    while(incompleto):
        if(str(archivo.iloc[fila,0]) == "nan"):#analizamos celda por celda
            incompleto = True # si encuentra una celda vacia sigue en el bucle
            fila += 1 # filas recorridas
            filas_a_eliminar += 1 # filas a eliminar
            eliminar = True # eliminar la fila por defecto
        else :
            incompleto = False # salimos del bucle
            print(filas_a_eliminar)

    if(eliminar):
        #aumentamos una fila mas a eliminar, se hace para eliminar la fila que trae el documento por defecto
        filas_a_eliminar += 1
        #guardamos el archivo sin encabezados
        archivo.iloc[filas_a_eliminar:,:].to_excel(documento, index=False, header=False) #cambios temporales
        #creamos el archivo sin encabezado
        archivo_sin_encabezados = pd.read_excel(documento)
        ######INCIO INDEPENDIETES######
        #Comparacion de columnas con candidatos independientes
        for colu in archivo_sin_encabezados:
            indep='CAND_IND' + str(aux)
            if colu==indep:
                aux+=1
                #agregando a columnas por eliminar
                candid.append(indep)
            #hay uno que empiexa en el dos
            elif colu=='CAND_IND2':
                aux+=2
                #agregando a columnas por eliminar
                candid.append('CAND_IND2')
            #print(indep)
        print ('lista:',candid)
        print (len(candid))
        #Sin el if crea la columna independientes con valores random
        #Si solo hay un candidato aun asi se crea la nueva columna, se puede cambiar a >1 para que no se crea una nueva columna
        #En caso de no haber candidatos no se crea la columna
        if len(candid) > 1:
            #creando nueva columna con los valores de independientes sumados    
            archivo_sin_encabezados['CANDIDATOS_INDEPENDIENTES'] = archivo_sin_encabezados[candid].sum(axis=1)
            #leemos el valor de las columnas
            columnas = archivo_sin_encabezados.columns
            #filtramos las columnas a eliminar candidatos indep
            indices_eliminar = [i for i, col in enumerate(columnas) if any(texto in str(col) for texto in candid)]
            #eliminamos la columnas encontradas candidatos indep
            nuevo_archivo = archivo_sin_encabezados.drop(archivo_sin_encabezados.columns[indices_eliminar], axis=1)
            #exportamos el nuevo archivo
            nuevo_archivo.to_excel(documento, index=False)          
            archivo_sin_encabezados = pd.read_excel(documento)  
        ######FIN INDEPENDIETES######    
        #leemos el valor de las columnas
        columnas = archivo_sin_encabezados.columns  
        #filtramos las columnas a eliminar
        indices_eliminar = [i for i, col in enumerate(columnas) if any(texto in str(col) for texto in COLUMNAS_A_ELIMINAR)]
        #eliminamos la columnas encontradas
        nuevo_archivo = archivo_sin_encabezados.drop(archivo_sin_encabezados.columns[indices_eliminar], axis=1)
        #exportamos el nuevo archivo
        nuevo_archivo.to_excel(documento, index=False)
        
    else:
        #guardamos el archivo sin encabezados
        archivo.iloc[filas_a_eliminar:,:].to_excel(documento,index=False, header=False)
        #creamos el archivo sin encabezado
        archivo_sin_encabezados = pd.read_excel(documento)
        ######INCIO INDEPENDIETES######
        #Comparacion de columnas con candidatos independientes
        for colu in archivo_sin_encabezados:
            indep='CAND_IND' + str(aux)
            if colu==indep:
                aux+=1
                #agregando a columnas por eliminar
                candid.append(indep)
            #hay uno que empiexa en el dos
            elif colu=='CAND_IND2':
                aux+=2
                #agregando a columnas por eliminar
                candid.append('CAND_IND2')
            #print(indep)
        print ('lista:',candid)
        print (len(candid))
        #Sin el if crea la columna independientes con valores random
        #Si solo hay un candidato aun asi se crea la nueva columna, se puede cambiar a >1 para que no se crea una nueva columna
        #En caso de no haber candidatos no se crea la columna
        if len(candid) > 1:
            #creando nueva columna con los valores de independientes sumados    
            archivo_sin_encabezados['CANDIDATOS_INDEPENDIENTES'] = archivo_sin_encabezados[candid].sum(axis=1)
            #leemos el valor de las columnas
            columnas = archivo_sin_encabezados.columns
            #filtramos las columnas a eliminar candidatos indep
            indices_eliminar = [i for i, col in enumerate(columnas) if any(texto in str(col) for texto in candid)]
            #eliminamos la columnas encontradas candidatos indep
            nuevo_archivo = archivo_sin_encabezados.drop(archivo_sin_encabezados.columns[indices_eliminar], axis=1)
            #exportamos el nuevo archivo
            nuevo_archivo.to_excel(documento, index=False)          
            archivo_sin_encabezados = pd.read_excel(documento)  
        ######FIN INDEPENDIETES######                
        #leemos el valor de las columnas
        columnas = archivo_sin_encabezados.columns
        #filtramos las columnas a eliminar
        indices_eliminar = [i for i, col in enumerate(columnas) if any(texto in str(col) for texto in COLUMNAS_A_ELIMINAR)]
        #eliminamos la columnas encontradas
        nuevo_archivo = archivo_sin_encabezados.drop(archivo_sin_encabezados.columns[indices_eliminar], axis=1)
        #exportamos el nuevo archivo
        nuevo_archivo.to_excel(documento, index=False)
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

    consulta_1 = conn.consultar_db(f"select m.NombreM, p.SECCION, p.PRI, p.PAN, p.MORENA, p.PRD, p.IND, p.TOTAL_VOTOS, p.LISTA_NOMINAL  from prueba as p inner join Municipio as m  on p.ClaveMunicipal = m.ClaveMunicipal where m.ClaveMunicipal = {seccion} order by p.ClaveMunicipal")
    consulta_2 = conn.consultar_db(f"select  sum(p.PRI), sum(p.PAN), sum(p.MORENA), sum(p.PRD), sum(p.IND)  from prueba as p inner join Municipio as m  on p.ClaveMunicipal = m.ClaveMunicipal where m.ClaveMunicipal = {seccion} order by p.ClaveMunicipal")
    grafico = multiprocessing.Process(target=crear_grafico, args=(consulta_1, consulta_2))
    grafico.start()
    grafico.join()

    
    respuesta = {
        'valor':'hola'
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

if __name__ == '__main__':
    app.run(debug=True, port=8000)