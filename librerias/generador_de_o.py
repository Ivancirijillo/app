class Generador():
    def __init__(self, objeto, clase, id):
        self.__objeto = objeto
        self.__clase = clase
        self.__id = id
    
    def crear_objetos(self):
        objeto = self.__objeto
        clase = self.__clase
        id = self.__id
        inicio_o = f"<{objeto} class='{clase}' id='{id}'> {id}"
        fin_o = f" </{objeto}>"
        resultado = inicio_o+fin_o
        return resultado
    