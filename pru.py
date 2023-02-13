import matplotlib.pyplot as plt
from mpldatacursor import datacursor
import pandas as pd

rarchivo = "C:/Users/ivanc/OneDrive/Documentos/Interfaz/local/1.xlsx"
archivo = pd.read_excel(rarchivo)

municipios = archivo[archivo["MUNICIPIO"].str.contains("ACAMBAY")]


valores = ["234","323","625"]
partidos = ["PAN","PRI","PRD", "PT", "PVEM", "NVA_ALIANZA", "MORENA", "ES"]

print(municipios[partidos])

for x in partidos:
    plt.bar(x, municipios[x])

plt.title("Votos por partido de "+ "acambay")
plt.ylabel("N° Votos")
plt.xlabel("Partido")
#datacursor(hover=True, formatter='Par:{x}<br>bot:{y}'.format)
plt.savefig("figura.png", dpi=700)