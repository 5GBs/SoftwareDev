# 5GBs

# Find My Hobby

A Flask-and-PostgreSQL-based web app that recommends hobbies based on quiz results.

## Scrum Master
Natalie Tepedino

## Assistant Scrum Master
Manny Campbell

## Product Owner
Yadhira Marcos-Avila

## Developers
* Adam Kerns
* Leo Amromine
* Michael Gohn
* Sasank Pagadala

## Build Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/5GBs/SoftwareDev.git
   ```

2. **Navigate to the Repo**
   ```bash
   # Navigate to the location of your file downloaded in step 1 (most likely titled 'SoftwareDev')

   # For example
   cd SoftwareDev
   ```

4. **Create and Activate a Virtual Environment**
    ```bash
    # For MacOS/Linux:
    python3 -m venv venv
    source venv/bin/activate

    # For Windows:
    python -m venv venv
    venv\Scripts\activate
    ```

5. **Install Dependencies**
    ```bash
    pip install -r requirements.txt
    ```

6. **Configure Environment Variables**
    ```bash
    # Create a new env file within the current folder 
    # (should still be SoftwareDev) by running the command below:
    cp backend/.env.example .env

    # You will need to edit this file (.env) to create a new database.
    ```

7. **Install Homebreq (if not installed)**
    ```bash
    # Open terminal and install
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

    # Remember your password! You will need it later.
   ``` 

8. **Make sure PostgreSQL is running**
   ```bash
   # Install PostgreSQ7 if not installed
      # For macOS:
      brew install postgresql
      
      #for Linux:
      sudo apt update
      sudo apt install postgresql postgresql-contrib
      sudo systemctl start postgresql

      # For Windows:
      # Download and install PostgreSQL from the following link
      https://www.postgresql.org/download/
   
      # Start the PostgreSQL service using brew
      brew services start postgresql
      ```

 9. **Create the database**
     ```bash
      # Create the database (schema inside)
      createdb -U postgres findmyhobby

      # If creatb is not available:
      psql -U postgres
      CREATE DATABASE findmyhobby;
      \q
      
      # Verify the database
      psql -U postgres -d findmyhobby

      # List the tables within the database
      \dt  
      ```

11. **Exit the database**
    ```bash
    \q
    ```

12. **Edit the .env file**
    ```bash
    # Navigate to the .env file
    # Edit it so that the username is 'postgres' and the password is the one you used in step 7

    DB_USER=postgres
    DB_PASS= 'your password'
    ```
    
13. **Finally, Run the App!**
    ```bash
    # Visit the localhost given in the terminal
    # (Most likely 'http://127.0.0.1:5000')
    flask run
    ```

