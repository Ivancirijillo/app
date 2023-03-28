import webbrowser
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, PageBreak, Table
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4
from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.graphics.shapes import Drawing, Rect, String, Group, Line
from reportlab.graphics.widgets.markers import makeMarker
import pymysql
from conexion import CONEXION
import configparser
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.barcharts import HorizontalBarChart
from reportlab.graphics.charts.piecharts import Pie
from reportlab.platypus.doctemplate import NextPageTemplate
from reportlab.lib.pagesizes import letter, landscape

#configuracion de archivo ini
configuracion = configparser.ConfigParser()
configuracion.read("configuracion.ini")
configuracion.sections()
#conexion
conn = CONEXION(configuracion["database1"]["host"],
                    configuracion["database1"]["port"],
                    configuracion["database1"]["user"],
                    configuracion["database1"]["passwd"],
                    configuracion["database1"]["db"])

#Documento generado
doc = SimpleDocTemplate('static\pdf\generado\General.pdf', pagesize=A4)
story = []
estilo = getSampleStyleSheet()

#consultas
padronE = conn.consultar_db("select m.NombreM, p.YearE, p.PHombres, p.PMujeres, p.PTotal, p.LNHombres, p.LNMujeres, p.LNTotal from PadronElectoral as p inner join Municipio as m on p.ClaveMunicipal = m.ClaveMunicipal  where p.YearE='2022' and p.ClaveMunicipal='15001';")
datosEstado = conn.consultar_db("select  SUM(PTotal), SUM(LNTotal) from PadronElectoral where YearE='2022';")
#pasar a cadena
cadena = ','.join(str(elem) for elem in padronE)
cadena2 = ','.join(str(elem) for elem in datosEstado)
#pasar a lista
lista = cadena.split(',')
lista[0] = lista[0].replace("(", "").strip()
lista[0] = lista[0].replace("'", "").strip()
lista[7] = lista[7].replace(")", "").strip()
#0: nombre  1: año  2: PHombres    3: PMujeres   4: PTotal 5: LNHombres   6: LNMujeres    7: LNTotal

lista2 = cadena2.split(',')
lista2[0] = lista2[0].replace("(", "").strip()
lista2[0] = lista2[0].replace("Decimal", "").strip()
lista2[0] = lista2[0].replace("'", "").strip()
lista2[0] = lista2[0].replace(")", "").strip()
lista2[1] = lista2[1].replace("(", "").strip()
lista2[1] = lista2[1].replace(")", "").strip()
lista2[1] = lista2[1].replace("Decimal", "").strip()
lista2[1] = lista2[1].replace("'", "").strip()
#0: padron  1: Liista nominal

#Nombre del municipio
estiloT = getSampleStyleSheet()
estiloTitulo = estiloT['title']
estiloTitulo.alignment = 1
titulo = Paragraph(lista[0], estiloTitulo)
story.append(titulo)
#PADRON
estiloT = getSampleStyleSheet()
estiloTitulo = estiloT['Heading2']
estiloTitulo.alignment = 1
titulo = Paragraph('Padron Electoral: ' + lista[1], estiloTitulo)
story.append(titulo)

estiloT = getSampleStyleSheet()
estiloTitulo = estiloT['Heading2']
estiloTitulo.alignment = 1
estiloTitulo.spaceBefore = 0
estiloTitulo.spaceAfter = 10
estiloTitulo.fontSize=10
titulo = Paragraph('Padron total: ' + lista[4] , estiloTitulo)
story.append(titulo)

#Gráfico pastel
dibujar = Drawing(300, 200)
graficoPastel = Pie()
graficoPastel.x = 125
graficoPastel.y = 30
graficoPastel.width = 170
graficoPastel.height = 170
listaDesp= (int(lista[2]), int(lista[3]))
graficoPastel.data = listaDesp
pPadH = (listaDesp[0]*100)/int(lista[4])
pPadM = 100-pPadH
graficoPastel.labels = [lista[2] + ' ('+str(pPadH)+'%)',lista[3] + ' ('+str(pPadM)+'%)']
graficoPastel.slices.strokeWidth=0.5
#remaracar barra
graficoPastel.slices[0].popout = 10
graficoPastel.slices[0].labelRadius = 1.75
graficoPastel.sideLabels = 1  # Con 0 no se muestran líneas hacia las etiquetas

#leyenda
from reportlab.graphics.charts.legends import Legend
leyenda = Legend() 
leyenda.x               = 350 
leyenda.y               = 0 
leyenda.dx              = 8  
leyenda.dy              = 8  
leyenda.fontName        = 'Helvetica'  
leyenda.fontSize        = 10  
leyenda.boxAnchor       = 'n'  
leyenda.columnMaximum   = 10  
leyenda.strokeWidth     = 1  
leyenda.strokeColor     = colors.black  
leyenda.deltax          = 75  
leyenda.deltay          = 10  
leyenda.autoXPadding    = 5  
leyenda.yGap            = 0  
leyenda.dxTextSpace     = 5  
leyenda.alignment       = 'right'  
leyenda.dividerLines    = 1|2|4  
leyenda.dividerOffsY    = 5.5 
leyenda.subCols.rpad    = 30  
leyenda.colorNamePairs = [(colors.blue, "Padron hombres"), 
                         (colors.green, "Padron mujeres")]

#Insertemos nuestros  colores
colores  = [colors.blue, colors.green]
for i, color in enumerate(colores): 
    graficoPastel.slices[i].fillColor = color

#legend.fillColor = [colors.blue, colors.green]  
dibujar.add(graficoPastel) 
dibujar.add(leyenda)
story.append(dibujar)

#INFO ESTADO
estiloT = getSampleStyleSheet()
estiloTitulo = estiloT['Heading2']
estiloTitulo.alignment = 1
estiloTitulo.spaceBefore = 50
estiloTitulo.spaceAfter = 10
estiloTitulo.fontSize=10
titulo = Paragraph('Padron estado: ' + lista2[0] , estiloTitulo)
story.append(titulo)

#Gráfico pastel
dibujar = Drawing(300, 200)
graficoPastel = Pie()
graficoPastel.x = 125
graficoPastel.y = 30
graficoPastel.width = 170
graficoPastel.height = 170
estadoP = int(lista2[0]) - int(lista[4])
listaPadron= (int(lista[4]), estadoP)
graficoPastel.data = listaPadron
padronMun = (listaPadron[0]*100)/int(lista2[0])
padronEst = 100-padronMun
graficoPastel.labels = [lista[4] + ' ('+str(padronMun)+'%)',str(estadoP) + ' ('+str(padronEst)+'%)']
graficoPastel.slices.strokeWidth=0.5
#remaracar barra
graficoPastel.slices[0].popout = 10
graficoPastel.slices[0].labelRadius = 1.75
graficoPastel.sideLabels = 1  # Con 0 no se muestran líneas hacia las etiquetas

#leyenda
from reportlab.graphics.charts.legends import Legend
leyenda = Legend() 
leyenda.x               = 350 
leyenda.y               = 0 
leyenda.dx              = 8  
leyenda.dy              = 8  
leyenda.fontName        = 'Helvetica'  
leyenda.fontSize        = 10  
leyenda.boxAnchor       = 'n'  
leyenda.columnMaximum   = 10  
leyenda.strokeWidth     = 1  
leyenda.strokeColor     = colors.black  
leyenda.deltax          = 75  
leyenda.deltay          = 10  
leyenda.autoXPadding    = 5  
leyenda.yGap            = 0  
leyenda.dxTextSpace     = 5  
leyenda.alignment       = 'right'  
leyenda.dividerLines    = 1|2|4  
leyenda.dividerOffsY    = 5.5 
leyenda.subCols.rpad    = 30  
leyenda.colorNamePairs = [(colors.crimson, "Padron " + lista[0]), 
                         (colors.cornflower, "Padron Estado")]

#Insertemos nuestros  colores
colores  = [colors.crimson, colors.cornflower]
for i, color in enumerate(colores): 
    graficoPastel.slices[i].fillColor = color

#legend.fillColor = [colors.blue, colors.green]  
dibujar.add(graficoPastel) 
dibujar.add(leyenda)
story.append(dibujar)

#Listanominal
estiloT = getSampleStyleSheet()
estiloTitulo = estiloT['Heading2']
estiloTitulo.alignment = 1
estiloTitulo.spaceBefore = 110
titulo = Paragraph('Lista nominal' + lista[1], estiloTitulo)
story.append(titulo)

estiloT = getSampleStyleSheet()
estiloTitulo = estiloT['Heading2']
estiloTitulo.alignment = 1
estiloTitulo.spaceBefore = 0
estiloTitulo.spaceAfter = 10
estiloTitulo.fontSize=10
titulo = Paragraph('Lista nominal total: ' + lista[7] , estiloTitulo)
story.append(titulo)

#Gráfico pastel
dibujar = Drawing(300, 200)
graficoPastel = Pie()
graficoPastel.x = 125
graficoPastel.y = 30
graficoPastel.width = 170
graficoPastel.height = 170
listaNo= (int(lista[5]), int(lista[6]))
graficoPastel.data = listaNo
LNh = (listaNo[0]*100)/int(lista[7])
LNm = 100-LNh
graficoPastel.labels = [lista[5] + ' ('+str(LNh)+'%)',lista[6] + ' ('+str(LNm)+'%)']
graficoPastel.slices.strokeWidth=0.5
#remaracar barra
graficoPastel.slices[0].popout = 10
graficoPastel.slices[0].labelRadius = 1.75
graficoPastel.sideLabels = 1  # Con 0 no se muestran líneas hacia las etiquetas

#leyenda
from reportlab.graphics.charts.legends import Legend
leyenda = Legend() 
leyenda.x               = 350 
leyenda.y               = 0 
leyenda.dx              = 8  
leyenda.dy              = 8  
leyenda.fontName        = 'Helvetica'  
leyenda.fontSize        = 10  
leyenda.boxAnchor       = 'n'  
leyenda.columnMaximum   = 10  
leyenda.strokeWidth     = 1  
leyenda.strokeColor     = colors.black  
leyenda.deltax          = 75  
leyenda.deltay          = 10  
leyenda.autoXPadding    = 5  
leyenda.yGap            = 0  
leyenda.dxTextSpace     = 5  
leyenda.alignment       = 'right'  
leyenda.dividerLines    = 1|2|4  
leyenda.dividerOffsY    = 5.5 
leyenda.subCols.rpad    = 30  
leyenda.colorNamePairs = [(colors.blue, "Lista nominal hombres"), 
                         (colors.green, "Lista nominal mujeres")]

#Insertemos nuestros  colores
colores  = [colors.blue, colors.green]
for i, color in enumerate(colores): 
    graficoPastel.slices[i].fillColor = color

#legend.fillColor = [colors.blue, colors.green]  
dibujar.add(graficoPastel) 
dibujar.add(leyenda)
story.append(dibujar)

#INFO ESTADO
estiloT = getSampleStyleSheet()
estiloTitulo = estiloT['Heading2']
estiloTitulo.alignment = 1
estiloTitulo.spaceBefore = 50
estiloTitulo.spaceAfter = 10
estiloTitulo.fontSize=10
titulo = Paragraph('Lista nominal del estado: ' + lista2[1] , estiloTitulo)
story.append(titulo)

#Gráfico pastel
dibujar = Drawing(300, 200)
graficoPastel = Pie()
graficoPastel.x = 125
graficoPastel.y = 30
graficoPastel.width = 170
graficoPastel.height = 170
estadoLN = int(lista2[1]) - int(lista[7])
listaLN= (int(lista[7]), estadoLN)
graficoPastel.data = listaLN
LNm = (listaLN[0]*100)/int(lista2[1])
LNe = 100-LNm
graficoPastel.labels = [lista[7] + ' ('+str(LNm)+'%)',str(estadoLN) + ' ('+str(LNe)+'%)']
graficoPastel.slices.strokeWidth=0.5
#remaracar barra
graficoPastel.slices[0].popout = 10
graficoPastel.slices[0].labelRadius = 1.75
graficoPastel.sideLabels = 1  # Con 0 no se muestran líneas hacia las etiquetas

#leyenda
from reportlab.graphics.charts.legends import Legend
leyenda = Legend() 
leyenda.x               = 350 
leyenda.y               = 0 
leyenda.dx              = 8  
leyenda.dy              = 8  
leyenda.fontName        = 'Helvetica'  
leyenda.fontSize        = 10  
leyenda.boxAnchor       = 'n'  
leyenda.columnMaximum   = 10  
leyenda.strokeWidth     = 1  
leyenda.strokeColor     = colors.black  
leyenda.deltax          = 75  
leyenda.deltay          = 10  
leyenda.autoXPadding    = 5  
leyenda.yGap            = 0  
leyenda.dxTextSpace     = 5  
leyenda.alignment       = 'right'  
leyenda.dividerLines    = 1|2|4  
leyenda.dividerOffsY    = 5.5 
leyenda.subCols.rpad    = 30  
leyenda.colorNamePairs = [(colors.crimson, "Lista nominal " + lista[0]), 
                         (colors.cornflower, "Lista nominal Estado")]

#Insertemos nuestros  colores
colores  = [colors.crimson, colors.cornflower]
for i, color in enumerate(colores): 
    graficoPastel.slices[i].fillColor = color

#legend.fillColor = [colors.blue, colors.green]  
dibujar.add(graficoPastel) 
dibujar.add(leyenda)
story.append(dibujar)
#eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
#consultas
delincuencia = conn.consultar_db("SELECT m.NombreM, d.YearD, d.DelitosAI, d.Homicidios,d.Feminicidios, d.Secuestros, d.DespH, d.DespM, d.DespT, d.Robo, d.RoboT from Delincuencia as d inner join Municipio as m on d.ClaveMunicipal = m.ClaveMunicipal where d.YearD='2022' and d.ClaveMunicipal='15001'")
#pasar a cadena
cadena = ','.join(str(elem) for elem in delincuencia)
#pasar a lista
lista = cadena.split(',')
lista[0] = lista[0].replace("(", "").strip()
lista[0] = lista[0].replace("'", "").strip()
lista[10] = lista[10].replace(")", "").strip()
#0: nombre  1: año  2: DelitosAI    3: Homicidios   4: Feminicidios 5: Secuestros   6: DespH    7: DespM    8: DespT    9: Robo 10:  roboT

#tabla
estiloT = getSampleStyleSheet()
estiloTitulo = estiloT['Heading2']
estiloTitulo.spaceBefore = 180
estiloTitulo.alignment = 1
titulo = Paragraph('Delincuencia', estiloTitulo)
story.append(titulo)

# Gráfico de Barras
dibujar = Drawing(400, 200)
datos = [(int(lista[2]), int(lista[3]), int(lista[4]), int(lista[5]), int(lista[9]), int(lista[10]))]
#graficoBarras = VerticalBarChart()
graficoBarras = HorizontalBarChart()
#graficoBarras = HorizontalLineChart()
graficoBarras.x = 100  #posicion
graficoBarras.y = 50
graficoBarras.height = 125
graficoBarras.width = 300
graficoBarras.data = datos
graficoBarras.strokeColor = colors.black
graficoBarras.valueAxis.valueMin = 0
graficoBarras.barWidth = 20    #ancho barra
listanum= (int(lista[2]), int(lista[3]), int(lista[4]), int(lista[5]), int(lista[9]), int(lista[10]))
graficoBarras.valueAxis.valueMax = (max(listanum))+50
graficoBarras.valueAxis.valueStep = 100  #paso de distancia entre punto y punto
graficoBarras.categoryAxis.labels.boxAnchor = 'ne'
graficoBarras.categoryAxis.labels.dx = -2
graficoBarras.categoryAxis.labels.dy = 8
graficoBarras.categoryAxis.labels.angle = 0
graficoBarras.categoryAxis.categoryNames = ['Delitos de alto impacto: '+lista[2], 'Homicidios: '+lista[3], 'Feminicidios: '+lista[4],
       'Secuestros: '+lista[5], 'Robos: '+lista[9], 'Robos transporte: '+lista[10]]     #Etiquetas de barras
graficoBarras.groupSpacing = 10
graficoBarras.barSpacing = 2
#colores de barras, solo toma el azul porque cada atributo tiene un dato
coloree  = [colors.blue, colors.green, colors.aqua, colors.black, colors.brown, colors.chartreuse]
for i, color in enumerate(coloree): 
    graficoBarras.bars[i].fillColor = color

dibujar.add(graficoBarras)
story.append(dibujar)
if int(lista[8]) != 0:
    estiloT = getSampleStyleSheet()
    estiloTitulo = estiloT['Heading2']
    estiloTitulo.alignment = 1
    estiloTitulo.spaceBefore = 0
    estiloTitulo.spaceAfter = 10
    titulo = Paragraph('Desapariciones', estiloTitulo)
    story.append(titulo)
    estiloT = getSampleStyleSheet()
    estiloTitulo = estiloT['Heading2']
    estiloTitulo.alignment = 1
    estiloTitulo.spaceBefore = 0
    estiloTitulo.spaceAfter = 10
    estiloTitulo.fontSize=10
    titulo = Paragraph('Desapariciones totales: ' + lista[8] , estiloTitulo)
    story.append(titulo)

    #Gráfico pastel
    dibujar = Drawing(300, 200)
    graficoPastel = Pie()
    graficoPastel.x = 125
    graficoPastel.y = 30
    graficoPastel.width = 170
    graficoPastel.height = 170
    listaDesp= (int(lista[6]), int(lista[7]))
    graficoPastel.data = listaDesp
    pDespH = (listaDesp[0]*100)/int(lista[8])
    pDespM = 100-pDespH
    graficoPastel.labels = [lista[6] + ' ('+str(pDespH)+'%)',lista[7] + ' ('+str(pDespM)+'%)']
    graficoPastel.slices.strokeWidth=0.5
    #remaracar barra
    graficoPastel.slices[0].popout = 10
    #graficoPastel.slices[0].strokeWidth = 2
    #graficoPastel.slices[0].strokeDashArray = [2,2]
    graficoPastel.slices[0].labelRadius = 1.75
    #graficoPastel.slices[0].fontColor = colors.crimson
    graficoPastel.sideLabels = 1  # Con 0 no se muestran líneas hacia las etiquetas
    # graficoPastel.slices.labelRadius = 0.65  # Para mostrar el texto dentro de las tajadas

    #leyenda
    from reportlab.graphics.charts.legends import Legend
    leyenda = Legend() 
    leyenda.x               = 350 
    leyenda.y               = 0 
    leyenda.dx              = 8  
    leyenda.dy              = 8  
    leyenda.fontName        = 'Helvetica'  
    leyenda.fontSize        = 10  
    leyenda.boxAnchor       = 'n'  
    leyenda.columnMaximum   = 10  
    leyenda.strokeWidth     = 1  
    leyenda.strokeColor     = colors.black  
    leyenda.deltax          = 75  
    leyenda.deltay          = 10  
    leyenda.autoXPadding    = 5  
    leyenda.yGap            = 0  
    leyenda.dxTextSpace     = 5  
    leyenda.alignment       = 'right'  
    leyenda.dividerLines    = 1|2|4  
    leyenda.dividerOffsY    = 5.5 
    leyenda.subCols.rpad    = 30  
    leyenda.colorNamePairs = [(colors.blue, "Desapariciones hombres"), 
                            (colors.green, "Desapariciones mujeres")]

    #Insertemos nuestros propios colores
    colores  = [colors.blue, colors.green]
    for i, color in enumerate(colores): 
        graficoPastel.slices[i].fillColor = color

    #legend.fillColor = [colors.blue, colors.green]  
    dibujar.add(graficoPastel) 
    dibujar.add(leyenda)
    story.append(dibujar)
    espacio = 300
    espacio2 = 10
else:
    espacio= 10
    espacio2 = 200
#consultas
pobreza = conn.consultar_db("select m.NombreM, p.YearP, p.Poblacion, p.Pobreza, p.PobExt, p.PobExtCar, p.PobMod, p.NpobNvul, p.RezagoEd, p.CarSalud, p.CarSaludPor, p.CarSS, p.CarCalidadViv, p.CarServViv, p.CarAlim, p.IngresoInf, p.IngresoInfE, p.PIB, p.UET from TPobreza as p inner join Municipio as m on p.ClaveMunicipal = m.ClaveMunicipal where p.YearP='2020' and p.ClaveMunicipal='15001';")
poblacion = conn.consultar_db("select  SUM(Poblacion) from TPobreza where YearP='2020';")
#pasar a cadena
cadena = ','.join(str(elem) for elem in pobreza)
cadena2 = ','.join(str(elem) for elem in poblacion)
#pasar a lista
lista = cadena.split(',')
lista[0] = lista[0].replace("(", "").strip()
lista[0] = lista[0].replace("'", "").strip()
lista[18] = lista[18].replace(")", "").strip()
#0: nombre  1: año  2: poblacioon    3: pobreza   4: pobext 5: pobextcar   6: pobmod    7: noponvul    8: rezed    9: carsal 
# 10:  carsalpob    11: carss   12: carcalidadviv   13: carserviv   14: caralim     15: ingreso     16: iingresoinfe    17: pib     18: uet

lista2 = cadena2.split(',')
lista2[0] = lista2[0].replace("(", "").strip()
lista2[0] = lista2[0].replace("Decimal", "").strip()
lista2[0] = lista2[0].replace("'", "").strip()
lista2[0] = lista2[0].replace(")", "").strip()
#0: poblacion estado

#poblacion
estiloT = getSampleStyleSheet()
estiloTitulo = estiloT['Heading2']
estiloTitulo.alignment = 1
estiloTitulo.spaceBefore = espacio
titulo = Paragraph('Población: ' + lista[1], estiloTitulo)
story.append(titulo)

estiloT = getSampleStyleSheet()
estiloTitulo = estiloT['Heading2']
estiloTitulo.alignment = 0
estiloTitulo.spaceBefore = 0
estiloTitulo.spaceAfter = 10
estiloTitulo.fontSize=10
titulo = Paragraph('PIB: ' + lista[17] , estiloTitulo)
story.append(titulo)

estiloT = getSampleStyleSheet()
estiloTitulo = estiloT['Heading2']
estiloTitulo.alignment = 0
estiloTitulo.spaceBefore = 0
estiloTitulo.spaceAfter = 5
estiloTitulo.fontSize=10
titulo = Paragraph('Unidades Economicas: ' + lista[18] , estiloTitulo)
story.append(titulo)

#Gráfico pastel
dibujar = Drawing(300, 200)
graficoPastel = Pie()
graficoPastel.x = 135
graficoPastel.y = 60
graficoPastel.width = 140
graficoPastel.height = 140
listapob= (int(lista[2]), int(lista2[0]))
pobe = int(lista2[0]) - int(lista[2])
graficoPastel.data = listapob
pobM = (listapob[0]*100)/int(lista2[0])
pob_E = 100-pobM
graficoPastel.labels = [lista[2] + ' ('+str(pobM)+'%)', str(pobe)+ ' ('+str(pob_E)+'%)']
graficoPastel.slices.strokeWidth=0.5
#remaracar barra
graficoPastel.slices[0].popout = 10
graficoPastel.slices[0].labelRadius = 1.75
graficoPastel.sideLabels = 1  # Con 0 no se muestran líneas hacia las etiquetas

#leyenda
from reportlab.graphics.charts.legends import Legend
leyenda = Legend() 
leyenda.x               = 350 
leyenda.y               = 40
leyenda.dx              = 8  
leyenda.dy              = 8  
leyenda.fontName        = 'Helvetica'  
leyenda.fontSize        = 10  
leyenda.boxAnchor       = 'n'  
leyenda.columnMaximum   = 10  
leyenda.strokeWidth     = 1  
leyenda.strokeColor     = colors.black  
leyenda.deltax          = 75  
leyenda.deltay          = 10  
leyenda.autoXPadding    = 5  
leyenda.yGap            = 0  
leyenda.dxTextSpace     = 5  
leyenda.alignment       = 'right'  
leyenda.dividerLines    = 1|2|4  
leyenda.dividerOffsY    = 5.5 
leyenda.subCols.rpad    = 30  
leyenda.colorNamePairs = [(colors.blue, "Población " + lista[0]), 
                         (colors.green, "Población estado")]

#Insertemos nuestros propios colores
colores  = [colors.blue, colors.green]
for i, color in enumerate(colores): 
    graficoPastel.slices[i].fillColor = color

#legend.fillColor = [colors.blue, colors.green]  
dibujar.add(graficoPastel) 
dibujar.add(leyenda)
story.append(dibujar)

estiloT = getSampleStyleSheet()
estiloTitulo = estiloT['Heading2']
estiloTitulo.alignment = 1
estiloTitulo.spaceBefore = espacio2
estiloTitulo.spaceAfter = 10
titulo = Paragraph('Carencias Sociales', estiloTitulo)
story.append(titulo)

# Gráfico de Barras 2
dibujar = Drawing(400, 200)
datos = [(float(lista[8]), float(lista[9]), float(lista[10]), float(lista[11]), float(lista[12]), float(lista[13]), float(lista[14]), float(lista[15]), float(lista[16]))]
graficoBarras = HorizontalBarChart()
graficoBarras.x = 190  #posicion
graficoBarras.y = -20
graficoBarras.height = 200
graficoBarras.width = 250
graficoBarras.data = datos
graficoBarras.strokeColor = colors.black
graficoBarras.valueAxis.valueMin = 0
graficoBarras.barWidth = 20    #ancho barra
graficoBarras.valueAxis.valueMax = 100
graficoBarras.valueAxis.valueStep = 20  #paso de distancia entre punto y punto
graficoBarras.categoryAxis.labels.boxAnchor = 'ne'
graficoBarras.categoryAxis.labels.dx = -2
graficoBarras.categoryAxis.labels.dy = 8
graficoBarras.categoryAxis.labels.angle = 0
p="%"
graficoBarras.categoryAxis.categoryNames = [p+' rezago educativo: '+lista[8], 'Promedio de carencia de salud: '+lista[9],
        'Carencia Salud Carencias promedio : '+lista[10], 
        p+' carencia Seguro Social: '+lista[11], p+' carencia de calidad de vivienda: '+lista[12],
        p+' carencia de servicios de vivienda: '+lista[13], p+' carencia de alimentación: '+lista[14],
        p+' ingreso inferior pobreza.: '+lista[15], p+' ingreso inferior pobreza extrema: '+lista[16]]     #Etiquetas de barras
graficoBarras.groupSpacing = 10
graficoBarras.barSpacing = 2
#colores de barras, solo toma el azul porque cada atributo tiene un dato
coloree  = [colors.blue, colors.green, colors.aqua, colors.black, colors.brown, colors.chartreuse]
for i, color in enumerate(coloree): 
    graficoBarras.bars[i].fillColor = color

dibujar.add(graficoBarras)
story.append(dibujar)

estiloT = getSampleStyleSheet()
estiloTitulo = estiloT['Heading2']
estiloTitulo.alignment = 1
estiloTitulo.spaceBefore = 160
titulo = Paragraph('Condición de pobreza', estiloTitulo)
story.append(titulo)

# Gráfico de Barras 1
dibujar = Drawing(400, 200)
datos = [(float(lista[3]), float(lista[4]), float(lista[5]), float(lista[6]), float(lista[7]))]
graficoBarras = HorizontalBarChart()
graficoBarras.x = 190  #posicion
graficoBarras.y = 50
graficoBarras.height = 125
graficoBarras.width = 250
graficoBarras.data = datos
graficoBarras.strokeColor = colors.black
graficoBarras.valueAxis.valueMin = 0
graficoBarras.barWidth = 20    #ancho barra
graficoBarras.valueAxis.valueMax = 100
graficoBarras.valueAxis.valueStep = 20  #paso de distancia entre punto y punto
graficoBarras.categoryAxis.labels.boxAnchor = 'ne'
graficoBarras.categoryAxis.labels.dx = -2
graficoBarras.categoryAxis.labels.dy = 8
graficoBarras.categoryAxis.labels.angle = 0
graficoBarras.categoryAxis.categoryNames = [p+' pobreza: '+lista[3], 'Pobreza extrema: '+lista[4], 'Pobreza extrema carencias promedio: '+lista[5],
       'Pobreza moderada: '+lista[6], p+' no pobre y no vulnerable: '+lista[7]]     #Etiquetas de barras
graficoBarras.groupSpacing = 10
graficoBarras.barSpacing = 2
#colores de barras, solo toma el azul porque cada atributo tiene un dato
coloree  = [colors.green, colors.aqua, colors.black, colors.brown, colors.chartreuse]
for i, color in enumerate(coloree): 
    graficoBarras.bars[i].fillColor = color

dibujar.add(graficoBarras)
story.append(dibujar)

#apoyos
estiloT = getSampleStyleSheet()
estiloTitulo = estiloT['Heading2']
estiloTitulo.alignment = 1
estiloTitulo.spaceBefore = 100
estiloTitulo.spaceAfter = 40
titulo = Paragraph('Apoyos: ' + lista[1], estiloTitulo)
story.append(titulo)

apoyos = conn.consultar_db("select m.NombreM, a.YearA, a.Periodo, a.NombreA, a.NoApoyos, TipoA from Apoyos as a inner join Municipio as m on a.ClaveMunicipal = m.ClaveMunicipal where a.YearA='2022' and a.ClaveMunicipal='15002';")

cadena = ','.join(str(elem) for elem in apoyos)
lista = cadena.split(',')
for i in range(len(lista)):
    lista[i] = lista[i].replace("(", "").strip()
    lista[i] = lista[i].replace(")", "").strip()
    lista[i] = lista[i].replace("'", "").strip()
    lista[i] = lista[i].replace("None", "").strip()

#tabla
datos = (
        ('Apoyo', 'No. apoyos'),
        (lista[3],  lista[4]),
        (lista[9],  lista[10]),
        (lista[15], lista[16]),
        (lista[21], lista[22]),
        (lista[27], lista[28]),
        (lista[33], lista[34]),
        (lista[39], lista[40]),
        (lista[45], lista[46]),
        (lista[51], lista[52]),
        (lista[57], lista[58]),
        (lista[63], lista[64]),
    )

tabla = Table(data = datos,
              style = [
                       ('GRID',(0,0),(-1,-1),0.5,colors.grey),
                       ('BOX',(0,0),(-1,-1),2,colors.black),
                       ('BACKGROUND', (0, 0), (-1, 0), colors.cornflowerblue),
                       ]
              )
story.append(tabla)
story.append(Spacer(0,15))

doc.build(story)
#abre el documento creado
webbrowser.open_new('static\pdf\generado\General.pdf')