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

class Padron():
    def GenerarPadron(yearA, clave):

        #Documento generado
        doc = SimpleDocTemplate('static\pdf\generado\Padron.pdf', pagesize=A4)
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
        padronE = conn.consultar_db(f"select m.NombreM, p.YearE, p.PHombres, p.PMujeres, p.PTotal, p.LNHombres, p.LNMujeres, p.LNTotal from PadronElectoral as p inner join Municipio as m on p.ClaveMunicipal = m.ClaveMunicipal  where p.YearE={yearA} and p.ClaveMunicipal={clave};")
        datosEstado = conn.consultar_db(f"select  SUM(PTotal), SUM(LNTotal) from PadronElectoral where YearE={yearA};")
        #pasar a cadena
        cadena = ','.join(str(elem) for elem in padronE)
        cadena2 = ','.join(str(elem) for elem in datosEstado)
        
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
            #Subtitulo
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

        doc.build(story)

        #abre el documento creado
        webbrowser.open_new('static\pdf\generado\Padron.pdf')