import matplotlib.pyplot as plt
#from mpldatacursor import datacursor
import pandas as pd
import os 
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


diccionario = {}
diccionario["hola"] = {}
# diccionario["hola"]["valor"] = 1

for i in range(0, 10):
    diccionario["hola"][f"valor{i}"] = i

print(diccionario)
