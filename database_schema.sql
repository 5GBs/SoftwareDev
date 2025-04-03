CREATE DATABASE project_database;

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    creation_date TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS posts (
    post_id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    picture BYTEA NOT NULL,
    creation_date TIMESTAMP NOT NULL,
    author_id INT NOT NULL,
    FOREIGN KEY(author_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS comments (
    comment_id SERIAL PRIMARY KEY,
    text VARCHAR(255) NOT NULL,
    creation_date TIMESTAMP NOT NULL,
    author_id INT NOT NULL,
    post_id INT NOT NULL,
    FOREIGN KEY(author_id) REFERENCES users(user_id),
    FOREIGN KEY(post_id) REFERENCES posts(post_id)
);

CREATE TABLE IF NOT EXISTS likes (
    like_id SERIAL PRIMARY KEY,
    creation_date TIMESTAMP NOT NULL,
    author_id INT NOT NULL,
    post_id INT NOT NULL,
    FOREIGN KEY(author_id) REFERENCES users(user_id),
    FOREIGN KEY(post_id) REFERENCES posts(post_id)
);