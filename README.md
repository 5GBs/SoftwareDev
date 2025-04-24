# 5GBs

# Find My Hobby

A Flask-and-PostgreSQL-based web app that recommends hobbies based on quiz results.

## Scrum Master
Manny Campbell

## Product Owner
Yadhira Marcos-Avila

## Developers
* Adam Kerns
* Leo Amromine
* Michael Gohn
* Natalie Tepedino
* Sasank Pagadala

## Build Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/5GBs/SoftwareDev.git

2. **Navigate to the Repo**
    Wherever you downloaded the files navigate to the main folder (most likely titled "SoftwareDev")

3. **Create and Activate a Virtual Environment**
    ```bash
    python3 -m venv venv
    source venv/bin/activate    # for MacOS/Linux
    venv\Scripts\activate # for Windows

4. **Install Dependencies**
    ```bash
    pip install -r requirements.txt

5. **Configure Environment Variables and Edit the .env file**
    ```bash
    cp .env.example .env 

    You will need to edit this file (.env) to create a new database

6. **Make sure PostgreSQL is running and the created database exists**

7. **Finally, Run the App!**
    ```bash
    flask run

    Visit the localhost given in the terminal (Most likely 'http://127.0.0.1:5000')

