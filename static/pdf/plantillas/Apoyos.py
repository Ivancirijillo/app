# -*- coding:utf-8 -*-

import webbrowser
import configparser
from reportlab.platypus import (SimpleDocTemplate, PageBreak, Image, Spacer,
Paragraph, Table, TableStyle)
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from conexion import CONEXION
from reportlab.lib.pagesizes import letter, landscape
#configuracion de archivo ini
class Apoyos():
    def GenerarApoyos(yearA, clave):

        doc = SimpleDocTemplate('static\pdf\generado\Apoyos.pdf', pagesize=landscape(A4))
        story=[]

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
        apoyos = conn.consultar_db(f"select m.NombreM, a.YearA, a.Periodo, a.NombreA, a.NoApoyos, TipoA from Apoyos as a inner join Municipio as m on a.ClaveMunicipal = m.ClaveMunicipal where a.YearA='{yearA}' and a.ClaveMunicipal='{clave}'")

        cadena = ','.join(str(elem) for elem in apoyos)

        if cadena == '':

            #Nombre del municipio
            estiloT = getSampleStyleSheet()
            estiloTitulo = estiloT['title']
            estiloTitulo.alignment = 1
            titulo = Paragraph('Sin datos del año ' + str(yearA), estiloTitulo)
            story.append(titulo)

        else: 
            lista = cadena.split(',')
            for i in range(len(lista)):
                lista[i] = lista[i].replace("(", "").strip()
                lista[i] = lista[i].replace(")", "").strip()
                lista[i] = lista[i].replace("'", "").strip()
                lista[i] = lista[i].replace("None", "").strip()
            #0 municipio
            #1 año
            #2 periodo
            #3 nombre
            #4 noapoyos
            #5 tipo apoyo
            #0-5 6-11 12-17 18-23 24-29     30-35 36-41 42-47 48-53     54-59   60-65
            #1     2   3     4       5       6      7     8     9       10      11

            #Nombre del municipio
            estiloT = getSampleStyleSheet()
            estiloTitulo = estiloT['title']
            estiloTitulo.alignment = 1
            titulo = Paragraph(lista[0], estiloTitulo)
            story.append(titulo)
            #apoyos
            estiloT = getSampleStyleSheet()
            estiloTitulo = estiloT['Heading2']
            estiloTitulo.alignment = 1
            estiloTitulo.spaceAfter = 10
            titulo = Paragraph('Apoyos: ' + lista[1], estiloTitulo)
            story.append(titulo)

            #tabla
            datos = ()
            datos = [('Apoyo', 'Periodo', 'Tipo de Apoyo', 'No. apoyos')]
            
            for i in range(0, len(lista), 6):
                datos += [(lista[i+3], lista[i+2], lista[i+5], lista[i+4])]

            #datos = (
            #        ('Apoyo', 'Periodo', 'Tipo de Apoyo', 'No. apoyos'),
            #        (lista[3],  lista[2],   lista[5],       lista[4]),
            #        (lista[9],  lista[8],   lista[11],      lista[10]),
            #        (lista[15], lista[14],  lista[17],      lista[16]),
            #        (lista[21], lista[20],  lista[23],      lista[22]),
            #        (lista[27], lista[26],  lista[29],      lista[28]),
            #        (lista[33], lista[32],  lista[35],      lista[34]),
            #        (lista[39], lista[38],  lista[41],      lista[40]),
            #        (lista[45], lista[44],  lista[47],      lista[46]),
            #        (lista[51], lista[50],  lista[53],      lista[52]),
            #        (lista[57], lista[56],  lista[59],      lista[58]),
            #        (lista[63], lista[62],  lista[65],      lista[64]),
            #    )

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
        webbrowser.open_new('static\pdf\generado\Apoyos.pdf')