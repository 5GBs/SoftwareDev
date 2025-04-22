from flask import Flask, render_template
import os

# create new app
app = Flask(
    __name__,
    static_folder='../frontend',
    template_folder='../templates'
)
# import blueprints
from routes import users_bp
app.register_blueprint(users_bp)

# Register secret for session management
app.secret_key = os.getenv('SECRET')

# TODO: insert DB connection 
# app.config['SQLALCHEMY_DATABASE_URI'] = 


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
