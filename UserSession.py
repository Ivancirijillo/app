from flask_login import UserMixin
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired

# Clase Usuario que implementa los métodos de Flask-Login
class User(UserMixin):
    def __init__(self, username, role):
        self.username = username
        self.role = role
        # Establece is_active como True para indicar que el usuario está activo
        self.active = True  

    def get_id(self):
        return self.username
    
    def is_active(self):
        # Devuelve el valor de active para indicar si el usuario está activo
        return self.active  

    def is_authenticated(self):
        # Devuelve True para indicar que el usuario está autenticado        
        return True  

# Clase LoginForm para el formulario de inicio de sesión
class LoginForm(FlaskForm):
    username = StringField('Usuario', validators=[DataRequired()])
    password = PasswordField('Contraseña', validators=[DataRequired()])
    submit = SubmitField('Iniciar sesión')

# Clase TypeUser para gestionar el tipo de usuario
class TypeUser:
    usuarioA = None  # Variable de clase para almacenar el valor de usuarioA

    @classmethod
    def set_usuarioA(cls, value):
        # Establece el valor de la variable usuarioA en la clase
        cls.usuarioA = value

    @classmethod
    def get_usuarioA(cls):
        # Obtiene el valor de la variable usuarioA de la clase
        return cls.usuarioA

    @staticmethod
    def load_user(user_id):
        # Carga el usuario en función del valor de usuarioA y devuelve un objeto User
        if TypeUser.usuarioA:
            role = 'admin'
        else:
            role = 'normal'
        # Crea el objeto User usando el id y rol determinado
        user = User(user_id, role)
        return user
