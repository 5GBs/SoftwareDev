from flask import Flask

app = Flask(__name__)  # Create a Flask app instance

@app.route('/')  # Define a route for the homepage
def home():
    return "Hello, Flask!"  # Response when visiting '/'

if __name__ == '__main__':
    app.run(debug=True)  # Run the Flask app
