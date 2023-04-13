import configparser
from conexion import CONEXION

PARTIDOS = ["PAN","PRI", "PRD", "PT", "PVEM", "MC", "NA", "MORENA", "ES", "VR", "IND"]

configuracion = configparser.ConfigParser()
configuracion.read("configuracion.ini")
configuracion.sections()

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

consulta = configuracion.get("consultas_buscador", "varios").format(inicio=inicio, fin=fin)
respuesta = conn.consultar_db(consulta)

print(n_saltos)

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

print(saltos)

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

print(lista["m_0"])

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