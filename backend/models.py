from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
db = SQLAlchemy()

class Users(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    hobby = db.Column(db.String(50), nullable=True)
    password = db.Column(db.String(255), nullable=False)
    creation_date = db.Column(db.DateTime, nullable=False, default=datetime.now)

    def __repr__(self):
        return f'Users({self.user_id}, {self.username}, {self.email}, {self.hobby})'

class Posts(db.Model):
    __tablename__ = 'posts'

    post_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)  # Added category field
    picture = db.Column(db.LargeBinary, nullable=True)   # Made nullable
    creation_date = db.Column(db.DateTime, nullable=False, default=datetime.now)

    author_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    author = db.relationship('Users', backref='posts')

    def __repr__(self):
        return f'Posts({self.post_id}, {self.title}, {self.category}, {self.creation_date})'
    
class Comments(db.Model):
    __tablename__ = 'comments'

    comment_id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    creation_date = db.Column(db.DateTime, nullable=False, default=datetime.now)

    author_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    author = db.relationship('Users', backref='comments')

    post_id = db.Column(db.Integer, db.ForeignKey('posts.post_id'), nullable=False)
    post = db.relationship('Posts', backref='comments')

    def __repr__(self):
        return f'Comments({self.comment_id}, {self.content}, {self.creation_date})'

class Likes(db.Model):
    __tablename__ = 'likes'

    like_id = db.Column(db.Integer, primary_key=True)
    creation_date = db.Column(db.DateTime, nullable=False, default=datetime.now)

    author_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    author = db.relationship('Users', backref='likes')

    post_id = db.Column(db.Integer, db.ForeignKey('posts.post_id'), nullable=False)
    post = db.relationship('Posts', backref='likes')

    def __repr__(self):
        return f'Likes({self.like_id}, {self.author_id}, {self.post_id})'