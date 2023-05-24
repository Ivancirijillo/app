from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired

# Clase Usuario que implementa los métodos de Flask-Login
class User:
    def __init__(self, username):
        self.username = username
        # Establece is_active como True para indicar que el usuario está activo
        self.is_active = True  

    def get_id(self):
        return self.username
    
    def is_active(self):
        # Devuelve el valor de is_active para indicar si el usuario está activo
        return self.is_active  

    def is_authenticated(self):
        # Devuelve True para indicar que el usuario está autenticado        
        return True  

# 
class LoginForm(FlaskForm):
    username = StringField('Usuario', validators=[DataRequired()])
    password = PasswordField('Contraseña', validators=[DataRequired()])
    submit = SubmitField('Iniciar sesión')