from flask_wtf import FlaskForm
from wtforms.fields import StringField
# from wtforms.validators import FileAllowed

class ProfileIconForm(FlaskForm):
    profile_icon = StringField("Profile Icon")
