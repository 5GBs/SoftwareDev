from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from backend.user_util import (
    create_user, check_user_credentials
)
import os
from backend.models import db, Users
from dotenv import load_dotenv

# load env variables
load_dotenv()

# create new app
app = Flask(
    __name__,
    static_folder='../frontend/static',
    template_folder='../frontend/templates'
)

# configure db connection
app.config['SQLALCHEMY_DATABASE_URI'] = \
    f'postgresql://{os.getenv("DB_USER")}:{os.getenv("DB_PASS")}@{os.getenv("DB_HOST")}:{os.getenv("DB_PORT")}/{os.getenv("DB_NAME")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

# initialize app
db.init_app(app)

# homepage
@app.get('/')
def homepage():
    return render_template('homepage.html', page='home')

# hobby
@app.get('/hobby')
def hobby():
    return render_template('hobby.html', page='hobby')

# quiz
@app.get('/quiz')
def quiz():
    if 'user_id' not in session:
        return render_template('signup.html', page='signup')
    
    return render_template('hobby-quiz.html', page='quiz')

# signup
@app.route('/signup', methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        firstName = request.form["firstName"]
        email = request.form["email"]
        password = request.form["password"]
        
        if not firstName or not email or not password:
            return render_template('signup.html', error="All fields are required")
        
        from werkzeug.security import generate_password_hash
        password_hash = generate_password_hash(password)
        
        print(f"Username: {firstName}, Email: {email}") #DEBUGGING
        
        result = create_user(firstName, email, password_hash)
        print(f"Result: {result}") #DEBUGGING

        if result == "Success" :
            return redirect(url_for("login"))
        else:
            return render_template('signup.html', error=result)
        
    return render_template('signup.html', page='signup')

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]

        user = check_user_credentials(email, password)
        if user:
            session["user_id"] = user.user_id
            return redirect(url_for("homepage"))  
        else:
            return render_template("login.html", error="Invalid credentials")

    return render_template("login.html", page='login')


if __name__ == '__main__':
    app.run(debug=True)

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('homepage'))

# add hobby
@app.route('/submit-hobby', methods=["POST"])
def submit_hobby():
    if 'user_id' not in session:
        return jsonify({"error": "User not logged in"}), 403

    data = request.get_json()
    hobby = data.get('hobby')

    user = Users.query.get(session['user_id'])
    if user:
        user.hobby = hobby
        session['hobby'] = hobby
        db.session.commit()
        return jsonify({"message": "Hobby saved successfully."}), 200
    else:
        return jsonify({"error": "User not found"}), 404
    
# routing and handling the results page
@app.route('/results', methods=["GET"])
def results():
    if 'user_id' not in session:
        return jsonify({"error": "User not logged in"}), 403
    
    user = Users.query.get(session['user_id'])
    hobby = user.hobby
    hobby_events = {
        "Gardening": [
            {
                "title": "Community Garden Meetup",
                "when": "Saturdays, 10 AM – 12 PM",
                "where": "Green Thumb Community Garden, Local Park",
                "desc": "Join fellow plant lovers to share tips, trade seeds, and work on beautifying the garden."
            },
            {
                "title": "Succulent & Houseplant Workshop",
                "when": "April 14, 2 PM – 4 PM",
                "where": "The Plant Nest, Downtown",
                "desc": "Learn how to care for low-maintenance plants and create your own arrangement to take home."
            },
            {
                "title": "Spring Garden Tour",
                "when": "April 21, 9 AM – 1 PM",
                "where": "Local Neighborhood Gardens (self-guided)",
                "desc": "Explore a variety of home gardens and chat with local green thumbs."
            },
        ],
        "Art": [
            {
                "title": "Sip & Paint Night",
                "when": "Every Friday, 6 PM – 8 PM",
                "where": "The Canvas Lounge",
                "desc": "Relax with a drink and a paintbrush—no experience needed!"
            },
            {
                "title": "Weekend Sketchwalk",
                "when": "Sundays, 11 AM – 1 PM",
                "where": "Downtown Historic District",
                "desc": "Explore the city while sketching scenes, buildings, and people."
            },
            {
                "title": "Beginner’s Acrylic Painting Class",
                "when": "April 10, 5 PM – 7 PM",
                "where": "Local Arts Center",
                "desc": "Learn painting techniques with step-by-step guidance."
            },
        ],
        "Hiking": [
            {
                "title": "Sunset Trail Hike",
                "when": "Fridays, 6 PM",
                "where": "Oakridge Trailhead",
                "desc": "A guided 3-mile hike with scenic sunset views and good company."
            },
            {
                "title": "Beginner’s Birdwatching Walk",
                "when": "April 13, 8 AM",
                "where": "Willow Lake Nature Preserve",
                "desc": "Bring binoculars and learn to identify local bird species with a park ranger."
            },
            {
                "title": "Outdoor Adventure Club Meetup",
                "when": "Biweekly Saturdays",
                "where": "Varies (posted online)",
                "desc": "Meet outdoor enthusiasts for hiking, kayaking, or nature photography trips."
            }
        ],
        "Music": [
            {
                "title": "Open Mic Night",
                "when": "Wednesdays, 7 PM",
                "where": "The Tune Box Cafe",
                "desc": "Show off your musical talent or enjoy the vibes from local performers."
            },
            {
                "title": "Intro to Guitar Workshop",
                "when": "April 15, 4 PM",
                "where": "Soundwave Music School",
                "desc": "Learn guitar basics and play your first song in under an hour."
            },
            {
                "title": "Music Jam Sessions",
                "when": "Saturdays, 2 PM – 5 PM",
                "where": "Local Community Center",
                "desc": "Bring your instrument and jam with others in a casual, fun environment."
            }
        ],
        "Coding": [
            {
                "title": "Build Your First Website (HTML/CSS Workshop)",
                "when": "April 12, 6 PM – 8 PM",
                "where": "Local Tech Hub",
                "desc": "A hands-on workshop for beginners to create their first personal website."
            },
            {
                "title": "Tech & Code Meetup",
                "when": "Monthly, 3rd Thursday",
                "where": "Coffee Code Collective",
                "desc": "Network with other tech enthusiasts and discuss new tools, trends, and side projects."
            },
            {
                "title": "Game Jam Weekend",
                "when": "April 26–28",
                "where": "Innovation Lab",
                "desc": "Collaborate with other developers and creatives to build a game in 48 hours."
            }
        ]
    }
    events = hobby_events.get(hobby, [])
    return render_template("Results-Events.html", hobby=hobby, events=events)