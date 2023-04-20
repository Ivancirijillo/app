import matplotlib.pyplot as plt
#from mpldatacursor import datacursor
import pandas as pd
import os, configparser
from conexion import CONEXION

configuracion = configparser.ConfigParser()
configuracion.read("configuracion.ini")
configuracion.sections()

# nombre_archivo = ""

# try:
#     rarchivo = "/Users/elias/Documents/app/static/archivos/Res_Definitivos_Gobernador_2017_por_seccion.xlsx"
#     nombre_archivo = os.path.splitext(rarchivo)[1]
#     print(nombre_archivo)
#     archivo = pd.read_excel(rarchivo)
# except Exception as e:
#     pass


# municipios = archivo[archivo["MUNICIPIO"].str.contains("ACAMBAY")]


# valores = ["234","323","625"]
# partidos = ["PAN","PRI","PRD", "PT", "PVEM", "NVA_ALIANZA", "MORENA", "ES"]

# print(municipios[partidos])

# for x in partidos:
#     plt.bar(x, municipios[x])

# plt.title("Votos por partido de "+ "acambay")
# plt.ylabel("N° Votos")
# plt.xlabel("Partido")
# #datacursor(hover=True, formatter='Par:{x}<br>bot:{y}'.format)
# plt.savefig("figura.png", dpi=700)

#eliminacion de imagenes

#archivo.dropna(axis=1, how="all", inplace=True)
# print(str(archivo.iloc[0, 0]))
# fila = 0
# archivo.iloc[5:10,:].to_excel("creado.xlsx", index=False, header=False)
# ruta = "/Users/elias/Documents/app/creado.xlsx"
# doc2 = pd.read_excel(ruta)
#print(doc2.columns.values)

##metodo para la eliminacion de imagenes

# incompleto = True
# fila = 1
# filas_a_eliminar = 0
# eliminar = False
# while(incompleto):
#     if(str(archivo.iloc[fila,0]) == "nan"):
#         incompleto = True
#         fila += 1 
#         filas_a_eliminar += 1
#         eliminar = True
#     else :
#         incompleto = False
#         print(filas_a_eliminar)

# if(eliminar):
#     filas_a_eliminar += 1
#     archivo.iloc[filas_a_eliminar:,:].to_excel("creado.xlsx", index=False, header=False)
#     ruta = "/Users/elias/Documents/app/creado.xlsx"
#     doc2 = pd.read_excel(ruta)
#     print(doc2.columns.values)
# else:
#     archivo.iloc[filas_a_eliminar:,:].to_excel("creado.xlsx", index=False, header=False)
#     ruta = "/Users/elias/Documents/app/creado.xlsx"
#     doc2 = pd.read_excel(ruta)
#     print(doc2)

## suma de columnas

# nuevo = archivo[archivo["MUNICIPIO"].str.contains("ACAMBAY")]
# for partido in partidos:
#     plt.bar(partido, int(nuevo[partido].sum()))
#     print(f"partido:{partido} votos:{nuevo[partido].sum()}")
# plt.title("Votos por partido de "+ "acambay")
# plt.ylabel("N° Votos")
# plt.xlabel("Partido")
# plt.show()


# diccionario = {}
# diccionario["hola"] = {}
# # diccionario["hola"]["valor"] = 1

# for i in range(0, 10):
#     diccionario["hola"][f"valor{i}"] = i

# print(diccionario)

"""
prueba de consultas mejoradas
"""
import configparser
from conexion import CONEXION

PARTIDOS = ["PAN","PRI", "PRD", "PT", "PVEM", "MC", "NA", "MORENA", "ES", "VR", "PH", "PES", "PFD", "RSP", "FXM", "NAEM", "INDEP"]

configuracion = configparser.ConfigParser()
configuracion.read("configuracion.ini")
configuracion.sections()

diccionario = {}

inicio =15001
fin = 15005+1

#determinar el rango
n_saltos = (fin-inicio)

#objeto de conexion
conn = CONEXION(configuracion["database1"]["host"],
                    configuracion["database1"]["port"],
                    configuracion["database1"]["user"],
                    configuracion["database1"]["passwd"],
                    configuracion["database1"]["db"])

consulta1 = "("
for i in (["2015"]):
    consulta1 += f" yearV={i} or"
consulta1 = consulta1[:-2] + ") order by v.ClaveMunicipal"

consulta = configuracion.get("consultas_buscador", "rango_id").format(inicio="15001", fin="15003")
#print(consulta+consulta1)
respuesta = conn.consultar_db(consulta+consulta1)
#print(respuesta[31][2])

def encontrar(respuesta):
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

print(respuesta[0][1])

def sep(respuesta):
    municipios, secciones = encontrar(respuesta)
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

def separa(respuesta):
    municipios = encontrar(respuesta)
    diccionario_m = {}
    contador = 0
    for municipio in municipios["municipios"]:
        diccionario_m[municipio] = {}
        for partido in PARTIDOS:
            diccionario_m[municipio][partido] = []
            for j in range(1, len(PARTIDOS) + 1):  # Corregido para incluir el último partido
                for k in range(0,int(municipios["secciones"][contador])):
                    if(respuesta[k][j] == None):
                        diccionario_m[municipio][partido].append(0)
                    else:
                        diccionario_m[municipio][partido].append(respuesta[k][j])
        contador += 1  # Movido al final del bucle interno
    return diccionario_m

def encontrar_municipios(respuesta):
    """
    encontrar saltos
    """
    municipio_actual = respuesta[0][0]
    saltos = {}
    contador = 0
    salto = 0
    for i in range(len(respuesta)):
        aux = len(respuesta)-1 if(i+1>=len(respuesta)) else (i+1)
        print(f"i:{aux}")
        if(municipio_actual == respuesta[i][0]):
            contador += 1
            print(respuesta[i][0])
        else:
            contador += 1
            saltos = []
            saltos = {
                "municipio": municipio_actual,
                "secciones":contador
            }
            contador = 0
            municipio_actual = respuesta[i][0]
            salto += 1
    return saltos

print(encontrar(respuesta))

print(sep(respuesta)["ACAMBAY DE RUÍZ CASTAÑEDA"]["MORENA"])
# lista = encontrar(respuesta)
# for i in lista:
#     for j in range(len(respuesta)):
#         print(respuesta[j][0].count(i))
#print(separa(respuesta)["ACAMBAY DE RUÍZ CASTAÑEDA"]["PAN"])
#print(encontrar_municipios(respuesta))
# cadena = ','.join(str(elem) for elem in respuesta)
# lista = cadena.split(',')
# for i in range(len(lista)):
#     lista[i] = lista[i].replace("(", "").strip()
#     lista[i] = lista[i].replace("Decimal", "").strip()
#     lista[i] = lista[i].replace(")", "").strip()
#     lista[i] = lista[i].replace("'", "").strip()
# print(lista[0])

# diccionario["m_0"]={}
# diccionario["m_0"][lista[0]]={}
# for i in range(1,18):
#     print(i)
#     diccionario["m_0"][lista[0]][PARTIDOS[i-1]]=lista[i]

# print(diccionario)

"""
encontrar saltos
"""
# municipio_actual = respuesta[0][0]
# saltos = {}
# contador = 0
# salto = 0
# for i in range(len(respuesta)):
#     aux = len(respuesta)-1 if(i+1>=len(respuesta)) else (i+1)
#     if(municipio_actual == respuesta[aux][0]):
#         contador += 1
#     else:
#         contador += 1
#         saltos[f"m_{salto}"] = []
#         saltos[f"m_{salto}"] = {
#             "municipio": municipio_actual,
#             "secciones":contador
#         }
#         contador = 0
#         municipio_actual = respuesta[aux][0]
#         salto += 1

# print(saltos)

# """
# llenado de diccionario con separacion por municipios y partidos
# """
# lista = {}
# salto = 0
# contador = 1
# municipio_actual = respuesta[0][0] # nos colocamos en la primer posicion de la consulta y en su primer valor , municipio
# for i in range(len(respuesta)):
#     aux = len(respuesta)-1 if((i+1) >= len(respuesta)) else (i+1) # determinamos el valor maximo que puede tener aux
#     salto = (n_saltos-1) if(salto >= n_saltos) else salto # si el salto supera el rango de saltos dado, entonces le asignara el numero de saltos - 1
#     if(municipio_actual == respuesta[aux][0]):
#         lista[f"m_{salto}"]={
#             respuesta[aux][0] : {}
#         }
#         while(contador <= 11):
#             lista[f"m_{salto}"][respuesta[aux][0]][PARTIDOS[contador-1]] = []
#             for j in range(int(saltos[f"m_{salto}"]["secciones"])):
#                 lista[f"m_{salto}"][respuesta[aux][0]][PARTIDOS[contador-1]].append(respuesta[j][contador])
#             contador += 1
#         contador = 1
#     else:
#         municipio_actual = respuesta[aux][0]
#         salto += 1

# print(lista["m_0"])

# municipio_actual = respuesta[0][0]
# lista = {}
# lista["m_0"]={
#     respuesta[0][0] : {}
# }
# cambios = 0
# contador = 1
# print(len(respuesta))
# for i in range(len(respuesta)):
#     aux = len(respuesta)-1 if(i+1>=len(respuesta)) else (i+1)
#     if(municipio_actual == respuesta[aux][0]):
#         lista[f"m_{cambios}"]={
#             respuesta[aux][0] : {}
#         }
#         while(contador<=11):
#             lista[f"m_{cambios}"][respuesta[aux][0]][PARTIDOS[contador-1]] = []
#             for j in range(32):
#                 lista[f"m_{cambios}"][respuesta[aux][0]][PARTIDOS[contador-1]].append(respuesta[j][contador])
#             contador+=1
#         contador=1
        
#         #print(f"{i}: {respuesta[i]}")
#     else:
#         print(f"{i}: {respuesta[i]}")
#         municipio_actual = respuesta[aux][0]
#         print("cambio")
#         cambios+=1

# print(lista["m_0"]["ACAMBAY DE RUÍZ CASTAÑEDA"])