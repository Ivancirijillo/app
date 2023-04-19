# -*- coding:utf-8 -*-
#Esto es un buena forma de saber las propiedades de los elementos que usemos,
#usaremos pprint que nos lo mostrará en el shell
#import pprint
#pprint.pprint(r.getProperties())
import webbrowser
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4
from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.graphics.shapes import Drawing, Rect, String, Group, Line
from reportlab.graphics.widgets.markers import makeMarker
import pymysql, os
from conexion import CONEXION
import configparser
#Gráfico de Barras
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.barcharts import HorizontalBarChart

#Gráfico de pastel
from reportlab.graphics.charts.piecharts import Pie

class Delincuencia():
    def GenerarDelincuencia(yearA, clave):
        if(os.path.dirname(__file__).find("/")!=-1):
            ruta_pdf=os.path.dirname(__file__).replace("/plantillas","/generado/")+"Delincuencia.pdf"
        else:
            ruta_pdf=os.path.dirname(__file__).replace("\plantillas","\generado\\")+"Delincuencia.pdf"
        
        #Documento generado
        doc = SimpleDocTemplate(ruta_pdf, pagesize=A4)
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
        delincuencia = conn.consultar_db(f"SELECT m.NombreM, d.YearD, d.DelitosAI, d.Homicidios,d.Feminicidios, d.Secuestros, d.DespH, d.DespM, d.DespT, d.Robo, d.RoboT from Delincuencia as d inner join Municipio as m on d.ClaveMunicipal = m.ClaveMunicipal where d.YearD={yearA} and d.ClaveMunicipal={clave}")
        #pasar a cadena
        cadena = ','.join(str(elem) for elem in delincuencia)
        
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
            #0: nombre  1: año  2: DelitosAI    3: Homicidios   4: Feminicidios 5: Secuestros   6: DespH    7: DespM    8: DespT    9: Robo 10:  roboT
            #Nombre del municipio
            estiloT = getSampleStyleSheet()
            estiloTitulo = estiloT['title']
            estiloTitulo.alignment = 1
            titulo = Paragraph(lista[0], estiloTitulo)
            story.append(titulo)
            #Subtitulo
            estiloT = getSampleStyleSheet()
            estiloTitulo = estiloT['Heading2']
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
            if (max(listanum) <= 100):
                paso=20

            elif  (100 < max(listanum) and max(listanum) <= 500):
                paso=50

            elif  (500 < max(listanum) and max(listanum) <= 1000):
                paso=100

            elif  (1000 < max(listanum) and max(listanum) <= 5000):
                paso=500
            
            else:
                paso=2000
                                
            graficoBarras.valueAxis.valueStep = paso  #paso de distancia entre punto y punto
            graficoBarras.valueAxis.valueMax = (max(listanum))+paso
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

        doc.build(story)
        #abre el documento creado
        return ruta_pdf