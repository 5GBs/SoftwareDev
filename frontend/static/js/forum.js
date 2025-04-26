// forum.js - Main JavaScript file for the Community Forum page

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const checkLoginStatus = async () => {
        try {
            const response = await fetch('/check-login-status');
            const data = await response.json();
            
            // Update UI based on login status
            const postAuthMessage = document.getElementById('post-auth-message');
            const postForm = document.getElementById('post-form');
            
            if (data.loggedIn) {
                // User is logged in
                if (postAuthMessage) {
                    postAuthMessage.style.display = 'none';
                }
                if (postForm) {
                    postForm.style.display = 'block';
                }
            } else {
                // User is not logged in
                if (postAuthMessage) {
                    postAuthMessage.textContent = 'Please log in to create a post';
                    postAuthMessage.style.display = 'block';
                }
                if (postForm) {
                    postForm.style.display = 'none';
                }
            }
        } catch (error) {
            console.error('Error checking login status:', error);
        }
    };
    
    // Call the function to check login status
    checkLoginStatus();
    
    // Handle post form submission
    const postForm = document.getElementById('post-form');
    if (postForm) {
        postForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const postTitle = document.getElementById('post-title').value;
            const postCategory = document.getElementById('post-category').value;
            const postContent = document.getElementById('post-content').value;
            const postImage = document.getElementById('post-image').files[0];
            
            // Validate form
            if (!postTitle || !postCategory || !postContent) {
                alert('Please fill out all required fields');
                return;
            }

            // Add validation for image (make it mandatory)
            if (!postImage) {
                document.getElementById('image-error').style.display = 'block';
                document.getElementById('image-upload-area').style.border = '2px solid red';
                return;
            } else {
                document.getElementById('image-error').style.display = 'none';
                document.getElementById('image-upload-area').style.border = '';
            }
            
            // Create FormData object to handle file upload
            const formData = new FormData();
            formData.append('title', postTitle);
            formData.append('category', postCategory);
            formData.append('content', postContent);
            
            if (postImage) {
                formData.append('picture', postImage);
            }
            
            try {
                const response = await fetch('/forum/submit-post', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    alert('Post created successfully!');
                    postForm.reset();
                    document.getElementById('image-preview').src = '';
                    document.getElementById('image-preview').style.display = 'none';
                    
                    // Refresh posts
                    fetchPosts();
                } else {
                    alert(`Error: ${result.error}`);
                }
            } catch (error) {
                console.error('Error submitting post:', error);
                alert('An error occurred while submitting your post');
            }
        });
    }
    
    // Handle image upload preview
    const postImageInput = document.getElementById('post-image');
    const imagePreview = document.getElementById('image-preview');
    const imageUploadArea = document.getElementById('image-upload-area');
    
    if (postImageInput && imagePreview && imageUploadArea) {
        imageUploadArea.addEventListener('click', function() {
            postImageInput.click();
        });
        
        postImageInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                    imageUploadArea.style.display = 'none';
                };
                
                reader.readAsDataURL(this.files[0]);
            }
        });
        
        // Handle drag and drop
        imageUploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            imageUploadArea.classList.add('dragover');
        });
        
        imageUploadArea.addEventListener('dragleave', function() {
            imageUploadArea.classList.remove('dragover');
        });
        
        imageUploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            imageUploadArea.classList.remove('dragover');
            
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                postImageInput.files = e.dataTransfer.files;
                
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                    imageUploadArea.style.display = 'none';
                };
                
                reader.readAsDataURL(e.dataTransfer.files[0]);
            }
        });
    }
    
    // Handle post category filters
    const filterButtons = document.querySelectorAll('.filter-button[data-post-category]');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-post-category');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter posts
            const posts = document.querySelectorAll('.post');
            
            posts.forEach(post => {
                if (category === 'all' || post.getAttribute('data-post-category') === category) {
                    post.style.display = 'block';
                } else {
                    post.style.display = 'none';
                }
            });
        });
    });
    
    // Handle hobby category filters
    const hobbyCategoryButtons = document.querySelectorAll('.filter-button[data-category]');
    
    hobbyCategoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            hobbyCategoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter category cards
            const categoryCards = document.querySelectorAll('.category-card');
            
            categoryCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Fetch posts from backend
    const fetchPosts = async () => {
        try {
            const response = await fetch('/forum/get-posts');
            
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            
            const data = await response.json();
            const posts = data.posts;
            const userId = data.user_id;
            
            // Clear existing posts (except for the sample post if needed)
            const postsContainer = document.querySelector('.posts-container');
            postsContainer.innerHTML = '';
            
            // Add posts to the container
            posts.forEach(post => {
                const postElement = createPostElement(post, userId, post.likes);
                postsContainer.appendChild(postElement);
            });
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };
    
    // Create a post element
    const createPostElement = (post, userId, likes) => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.setAttribute('data-post-category', post.category);
        postDiv.style.cssText = 'background-color: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); margin-bottom: 20px; overflow: hidden;';
        isAuthor = userId === post.author_id;
        
        // Format the date
        const postDate = new Date(post.creation_date);
        const formattedDate = postDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Create the HTML structure
        postDiv.innerHTML = `
            <div class="post-header" style="padding: 20px 20px 0;">
                <div class="post-meta" style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #666; font-size: 0.9rem;">
                    <span class="post-author">${post.author_name}</span>
                    <span class="post-date">${formattedDate}</span>
                </div>
                ${isAuthor ? `<button class="action-button delete-button" data-post-id="${post.post_id}" style="margin-left: 50%; background: none; border: none; padding: 12px; cursor: pointer; transition: all 0.3s ease; color: #666;">Delete</button>` : ``}
                <h3 class="post-title" style="margin: 0 0 15px; color: #1B5E20;">${post.title}</h3>
            </div>
            
            <div class="post-content" style="padding: 0 20px 20px;">
                <p>${post.description}</p>
                ${post.picture ? `<img src="data:image/jpeg;base64,${post.picture}" alt="${post.title}" class="post-image" style="width: 100%; border-radius: 8px; margin-top: 15px;">` : ''}
            </div>
            
            <div class="post-actions" style="display: flex; border-top: 1px solid #eee;">
                <button class="action-button like-button" data-post-id="${post.post_id}" style="flex: 1; background: none; border: none; padding: 12px; cursor: pointer; transition: all 0.3s ease; color: #666;"><i class="fas fa-heart"></i> Like</button>
                <button class="action-button comment-button" data-post-id="${post.post_id}" style="flex: 1; background: none; border: none; padding: 12px; cursor: pointer; transition: all 0.3s ease; color: #666;"><i class="fas fa-comment"></i> Comment</button>
                <button class="action-button share-button" data-post-id="${post.post_id}" style="flex: 1; background: none; border: none; padding: 12px; cursor: pointer; transition: all 0.3s ease; color: #666;"><i class="fas fa-share"></i> Share</button>
            </div>
            
            <div class="comments-section" data-post-id="${post.post_id}" style="display: none; padding: 10px 20px; border-top: 1px solid #eee;">
                <h4>Comments</h4>
                <div class="comments-container"></div>
                <form class="comment-form" data-post-id="${post.post_id}">
                    <textarea class="comment-input" placeholder="Add a comment..." required></textarea>
                    <button type="submit" class="comment-submit-button">Post Comment</button>
                </form>
            </div>
        `;
        
        // Add event listeners
        const deleteButton = postDiv.querySelector('.delete-button');
        const likeButton = postDiv.querySelector('.like-button');
        const commentButton = postDiv.querySelector('.comment-button');
        const shareButton = postDiv.querySelector('.share-button');
        const commentForm = postDiv.querySelector('.comment-form');

        // Show if post is liked or not
        (likes || []).forEach(like => {
            if(like.author_id === userId){
                likeButton.classList.add('liked');
                if (likeButton.classList.contains('liked')) {
                    likeButton.style.color = '#e91e63';
                } else {
                    likeButton.style.color = '#666';
                }
            }
        });
        
        if(deleteButton){
            deleteButton.addEventListener('click', () => handleDelete(post.post_id));
        }
        likeButton.addEventListener('click', () => handleLike(post.post_id, likeButton));
        commentButton.addEventListener('click', () => toggleComments(post.post_id));
        shareButton.addEventListener('click', () => handleShare(post.post_id));
        commentForm.addEventListener('submit', (e) => handleComment(e, post.post_id));
        
        return postDiv;
    };
    
    // Handle like button click
    const handleLike = async (postId, button) => {
        try {
            const response = await fetch('/forum/like-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ post_id: postId })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                // Toggle like button appearance
                button.classList.toggle('liked');
                if (button.classList.contains('liked')) {
                    button.style.color = '#e91e63';
                } else {
                    button.style.color = '#666';
                }
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };
    
    // Toggle comments section
    const toggleComments = async (postId) => {
        const commentsSection = document.querySelector(`.comments-section[data-post-id="${postId}"]`);
        
        if (commentsSection.style.display === 'none' || commentsSection.style.display === '') {
            commentsSection.style.display = 'block';
            
            // Fetch comments
            await fetchComments(postId);
        } else {
            commentsSection.style.display = 'none';
        }
    };
    
    // Fetch comments for a post
    const fetchComments = async (postId) => {
        try {
            const response = await fetch(`/forum/get-comments/${postId}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch comments');
            }
            
            const comments = await response.json();
            
            // Update comments container
            const commentsContainer = document.querySelector(`.comments-section[data-post-id="${postId}"] .comments-container`);
            commentsContainer.innerHTML = '';
            
            if (comments.length === 0) {
                commentsContainer.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
                return;
            }
            
            comments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.className = 'comment';
                commentElement.style.cssText = 'margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee;';
                
                // Format the date
                const commentDate = new Date(comment.creation_date);
                const formattedDate = commentDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                commentElement.innerHTML = `
                    <div class="comment-meta" style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span class="comment-author" style="font-weight: bold;">${comment.author_name}</span>
                        <span class="comment-date" style="color: #666; font-size: 0.8rem;">${formattedDate}</span>
                    </div>
                    <div class="comment-content">${comment.content}</div>
                `;
                
                commentsContainer.appendChild(commentElement);
            });
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };
    
    // Handle comment submission
    const handleComment = async (e, postId) => {
        e.preventDefault();
        
        const form = e.target;
        const commentInput = form.querySelector('.comment-input');
        const content = commentInput.value.trim();
        
        if (!content) {
            return;
        }
        
        try {
            const response = await fetch('/forum/submit-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    post_id: postId,
                    content: content
                })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                // Clear input
                commentInput.value = '';
                
                // Refresh comments
                await fetchComments(postId);
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };
    
    // Handle share button click
    const handleShare = (postId) => {
        // Get the current URL
        const url = window.location.href.split('#')[0] + `#post-${postId}`;
        
        // Create a temporary input element
        const tempInput = document.createElement('input');
        tempInput.value = url;
        document.body.appendChild(tempInput);
        
        // Select and copy the text
        tempInput.select();
        document.execCommand('copy');
        
        // Remove the temporary element
        document.body.removeChild(tempInput);
        
        // Show feedback
        alert('Link copied to clipboard!');
    };

    // Handle delete button click
    const handleDelete = async (postId) => {
        try {
            const response = await fetch('/forum/delete-post', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({post_id: postId})
            });

            const result = await response.json();

            if(response.ok){
                console.log(response);
                fetchPosts();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };
    
    // Initialize by fetching posts
    fetchPosts();
    
    // Explore button functionality
    const exploreButton = document.getElementById('explore-button');
    if (exploreButton) {
        exploreButton.addEventListener('click', function() {
            const discoverSection = document.querySelector('.discover-section');
            if (discoverSection) {
                discoverSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});