from flask_login import UserMixin
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, SelectField
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

# 
class LoginForm(FlaskForm):
    username = StringField('Usuario', validators=[DataRequired()])
    password = PasswordField('Contraseña', validators=[DataRequired()])
    submit = SubmitField('Iniciar sesión')


class TypeUser:
    usuarioA = None  # Variable de clase para almacenar el valor de usuarioA

    @classmethod
    def set_usuarioA(cls, value):
        cls.usuarioA = value

    @classmethod
    def get_usuarioA(cls):
        return cls.usuarioA

    @staticmethod
    def load_user(user_id):
        print('segunda consulta')
        if TypeUser.usuarioA:
            role = 'admin'
        else:
            role = 'normal'
        user = User(user_id, role)
        print(TypeUser.usuarioA)
        return user
