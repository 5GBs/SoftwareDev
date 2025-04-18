from flask import Flask, render_template, request, jsonify, session
import os
from models import db, Users
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
    
# add hobby
@app.post('/submit-hobby')
def submit_hobby():
    if 'user_id' not in session:
        return jsonify({"error": "User not logged in"}), 403

    data = request.get_json()
    hobby = data.get('hobby')

    user = Users.query.get(session['user_id'])
    if user:
        user.hobby = hobby
        db.session.commit()
        return jsonify({"message": "Hobby saved successfully."}), 200
    else:
        return jsonify({"error": "User not found"}), 404
