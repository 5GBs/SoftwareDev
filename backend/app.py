from flask import Flask, render_template
import os
from models import db
from dotenv import load_dotenv

# load env variables
load_dotenv()

# create new app
app = Flask(
    __name__,
    static_folder='../frontend',
    template_folder='../templates'
)

# configure db connection
app.config['SQLALCHEMY_DATABASE_URI'] = \
f'postgresql://{os.getenv("DB_USER")}:{os.getenv("DB_PASS")}@{os.getenv("DB_HOST")}:{os.getenv("DB_PORT")}/{os.getenv("DB_NAME")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# initialize app
db.init_app(app)

# homepage
@app.get('/')
def homepage():
    return render_template('homepage.html')

# signup
@app.get('/signup')
def signup():
    return render_template('signup.html')

if __name__ == '__main__':
    app.run(debug=True)
