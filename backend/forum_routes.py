from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask import Blueprint
from backend.models import db, Users, Posts, Comments, Likes
from datetime import datetime
import base64

# Create a blueprint for forum routes
forum_routes = Blueprint('forum_routes', __name__)

# Check login status
@forum_routes.route('/check-login-status', methods=['GET'])
def check_login_status():
    if 'user_id' in session:
        return jsonify({"loggedIn": True})
    else:
        return jsonify({"loggedIn": False})

# Get all posts
@forum_routes.route('/get-posts', methods=['GET'])
def get_posts():
    try:
        # Get all posts ordered by creation date (newest first)
        posts_query = db.session.query(
            Posts, Users.username.label('author_name')
        ).join(
            Users, Posts.author_id == Users.user_id
        ).order_by(
            Posts.creation_date.desc()
        ).all()
        
        # Format the response
        posts_list = []
        for post, author_name in posts_query:
            # Convert the binary image data to base64 string if it exists
            picture_data = None
            if post.picture:
                picture_data = base64.b64encode(post.picture).decode('utf-8')
            
            posts_list.append({
                'post_id': post.post_id,
                'title': post.title,
                'description': post.description,
                'picture': picture_data,
                'creation_date': post.creation_date.isoformat(),
                'author_id': post.author_id,
                'author_name': author_name,
                'category': post.category,  # Ensure your Posts model has this field
                'likes': [{'author_id': like.author_id} for like in post.likes]
            })
        
        return jsonify({
            'posts': posts_list,
            'user_id': session.get('user_id')
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Submit a new post
@forum_routes.route('/submit-post', methods=['POST'])
def submit_post():
    if 'user_id' not in session:
        return jsonify({"error": "User not logged in"}), 403
    
    try:
        title = request.form.get('title')
        description = request.form.get('content')
        category = request.form.get('category')
        
        # Check if required fields are provided
        if not title or not description or not category:
            return jsonify({"error": "Missing required fields"}), 400
        
        # Handle image upload
        picture_data = None
        if 'picture' in request.files and request.files['picture'].filename:
            picture_file = request.files['picture']
            picture_data = picture_file.read()
        
        # Create a new post
        new_post = Posts(
            title=title,
            description=description,
            category=category,
            picture=picture_data,
            creation_date=datetime.now(),
            author_id=session['user_id']
        )
        
        # Add to database
        db.session.add(new_post)
        db.session.commit()
        
        return jsonify({"message": "Post created successfully", "post_id": new_post.post_id})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Like a post
@forum_routes.route('/like-post', methods=['POST'])
def like_post():
    if 'user_id' not in session:
        return jsonify({"error": "User not logged in"}), 403
    
    try:
        data = request.get_json()
        post_id = data.get('post_id')
        
        if not post_id:
            return jsonify({"error": "Post ID is required"}), 400
        
        # Check if the post exists
        post = Posts.query.get(post_id)
        if not post:
            return jsonify({"error": "Post not found"}), 404
        
        # Check if the user has already liked this post
        existing_like = Likes.query.filter_by(
            author_id=session['user_id'],
            post_id=post_id
        ).first()
        
        if existing_like:
            # Unlike the post
            db.session.delete(existing_like)
            db.session.commit()
            return jsonify({"message": "Post unliked successfully"})
        else:
            # Like the post
            new_like = Likes(
                author_id=session['user_id'],
                post_id=post_id,
                creation_date=datetime.now()
            )
            db.session.add(new_like)
            db.session.commit()
            return jsonify({"message": "Post liked successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Get comments for a post
@forum_routes.route('/get-comments/<int:post_id>', methods=['GET'])
def get_comments(post_id):
    try:
        # Check if the post exists
        post = Posts.query.get(post_id)
        if not post:
            return jsonify({"error": "Post not found"}), 404
        
        # Get all comments for this post ordered by creation date
        comments_query = db.session.query(
            Comments, Users.username.label('author_name')
        ).join(
            Users, Comments.author_id == Users.user_id
        ).filter(
            Comments.post_id == post_id
        ).order_by(
            Comments.creation_date.asc()
        ).all()
        
        # Format the response
        comments_list = []
        for comment, author_name in comments_query:
            comments_list.append({
                'comment_id': comment.comment_id,
                'content': comment.content,
                'creation_date': comment.creation_date.isoformat(),
                'author_id': comment.author_id,
                'author_name': author_name,
                'post_id': comment.post_id
            })
        
        return jsonify(comments_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Submit a comment
@forum_routes.route('/submit-comment', methods=['POST'])
def submit_comment():
    if 'user_id' not in session:
        return jsonify({"error": "User not logged in"}), 403
    
    try:
        data = request.get_json()
        post_id = data.get('post_id')
        content = data.get('content')
        
        # Check if required fields are provided
        if not post_id or not content:
            return jsonify({"error": "Missing required fields"}), 400
        
        # Check if the post exists
        post = Posts.query.get(post_id)
        if not post:
            return jsonify({"error": "Post not found"}), 404
        
        # Create a new comment
        new_comment = Comments(
            content=content,
            creation_date=datetime.now(),
            author_id=session['user_id'],
            post_id=post_id
        )
        
        # Add to database
        db.session.add(new_comment)
        db.session.commit()
        
        return jsonify({"message": "Comment added successfully", "comment_id": new_comment.comment_id})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
# Delete a post
@forum_routes.route('/delete-post', methods=['DELETE'])
def delete_post():
    if 'user_id' not in session:
        return jsonify({"error": "user not logged in"}), 403
    
    try:
        data = request.get_json()
        post_id = data.get('post_id')

        # Check if required field is provided
        if not post_id:
            return jsonify({"error": "Missing required field"}), 400
        
        
        # Check if the post exists
        post = Posts.query.get(post_id)
        if not post:
            return jsonify({"error": "Post not found"}), 404
        
        # Check if user is authorized to delete
        user_id = session.get('user_id')
        if user_id != post.author_id:
            return jsonify({"error": "Not authorized to delete"}), 403

        # Delete post from database
        db.session.delete(post)
        db.session.commit()

        return jsonify({"message": "Post deleted successfully", "post_id": post_id})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500