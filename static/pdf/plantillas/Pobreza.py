# -*- coding:utf-8 -*-

import webbrowser
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4
from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.graphics.shapes import Drawing, Rect, String, Group, Line
from reportlab.graphics.widgets.markers import makeMarker
import pymysql
from conexion import CONEXION
import configparser
#Gráfico de Barras
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.barcharts import HorizontalBarChart
#Gráfico de pastel
from reportlab.graphics.charts.piecharts import Pie

class Pobreza():
    def GenerarPobreza(yearA, clave):

        #Documento generado
        doc = SimpleDocTemplate('static\pdf\generado\Pobreza.pdf', pagesize=A4)
        story = []

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
        #consultas
        pobreza = conn.consultar_db(f"select m.NombreM, p.YearP, p.Poblacion, p.Pobreza, p.PobExt, p.PobExtCar, p.PobMod, p.NpobNvul, p.RezagoEd, p.CarSalud, p.CarSaludPor, p.CarSS, p.CarCalidadViv, p.CarServViv, p.CarAlim, p.IngresoInf, p.IngresoInfE, p.PIB, p.UET from TPobreza as p inner join Municipio as m on p.ClaveMunicipal = m.ClaveMunicipal where p.YearP={yearA} and p.ClaveMunicipal={clave};")
        poblacion = conn.consultar_db(f"select  SUM(Poblacion) from TPobreza where YearP={yearA};")
        #pasar a cadena
        cadena = ','.join(str(elem) for elem in pobreza)
        cadena2 = ','.join(str(elem) for elem in poblacion)
        print(cadena)

        if cadena == '':
            #Mensaje
            estiloT = getSampleStyleSheet()
            estiloTitulo = estiloT['title']
            estiloTitulo.alignment = 1
            titulo = Paragraph('Sin datos del año ' + str(yearA), estiloTitulo)
            story.append(titulo)

        else: 
            #pasar a lista
            lista = cadena.split(',')
            for i in range(len(lista)):
                lista[i] = lista[i].replace("(", "").strip()
                lista[i] = lista[i].replace(")", "").strip()
                lista[i] = lista[i].replace("'", "").strip()
            #0: nombre  1: año  2: poblacion    3: pobreza   4: pobext 5: pobextcar   6: pobmod    7: noponvul    8: rezed    9: carsal 
            # 10:  carsalpob    11: carss   12: carcalidadviv   13: carserviv   14: caralim     15: ingreso     16: iingresoinfe    17: pib     18: uet

            lista2 = cadena2.split(',')
            for i in range(len(lista2)):
                lista2[i] = lista2[i].replace("(", "").strip()
                lista2[i] = lista2[i].replace(")", "").strip()
                lista2[i] = lista2[i].replace("'", "").strip()
                lista2[i] = lista2[i].replace("Decimal", "").strip()
            #0: poblacion estado

            #Nombre del municipio
            estiloT = getSampleStyleSheet()
            estiloTitulo = estiloT['title']
            estiloTitulo.alignment = 1
            titulo = Paragraph(lista[0], estiloTitulo)
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

            if lista[2] != 'None' and lista2[0] != 'None':
                #poblacion
                estiloT = getSampleStyleSheet()
                estiloTitulo = estiloT['Heading2']
                estiloTitulo.alignment = 1
                titulo = Paragraph('Población: ' + lista[1], estiloTitulo)
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

            if lista[8] != 'None' and lista[9] != 'None' and lista[10] != 'None' and lista[11] != 'None' and lista[12] != 'None' and lista[13] != 'None' and lista[14] != 'None' and lista[15] != 'None' and lista[16] != 'None':
                estiloT = getSampleStyleSheet()
                estiloTitulo = estiloT['Heading2']
                estiloTitulo.alignment = 1
                estiloTitulo.spaceBefore = 10
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

            if lista[3] != 'None' and lista[9] != 'None' and lista[4] != 'None' and lista[5] != 'None' and lista[6] != 'None' and lista[7] != 'None':
                estiloT = getSampleStyleSheet()
                estiloTitulo = estiloT['Heading2']
                estiloTitulo.alignment = 1
                estiloTitulo.spaceBefore = 160
                titulo = Paragraph('Condición de pobreza', estiloTitulo)
                story.append(titulo)

                # Gráfico de Barras 2
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

        doc.build(story)
        #abre el documento creado
        webbrowser.open_new('static\pdf\generado\Pobreza.pdf')