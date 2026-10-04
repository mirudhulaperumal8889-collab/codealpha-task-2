let isFollowing = false;
let followers = 120;

// Dark Mode Toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const darkModeBtn = document.getElementById('darkModeBtn');
    if (darkModeBtn) {
        const isDark = document.body.classList.contains('dark-mode');
        darkModeBtn.innerText = isDark ? '☀️' : '🌙';
    }
}

// Follow / Unfollow
function toggleFollow() {
    const btn = document.getElementById('followBtn');
    const count = document.getElementById('followersCount');
    
    if (isFollowing) {
        followers--;
        btn.innerText = 'Follow';
        btn.style.background = '#1877f2';
    } else {
        followers++;
        btn.innerText = 'Unfollow';
        btn.style.background = '#e4e6eb';
        btn.style.color = '#000';
    }
    count.innerText = followers;
    isFollowing = !isFollowing;
}

// Preview Selected Image Before Post
function previewImage(event) {
    const input = event.target;
    const previewContainer = document.getElementById('imagePreviewContainer');
    const previewImg = document.getElementById('imagePreview');

    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            previewContainer.style.display = 'inline-block';
        }
        reader.readAsDataURL(input.files[0]);
    }
}

// Remove Selected Image
function removeSelectedImage() {
    const imageInput = document.getElementById('imageInput');
    const previewContainer = document.getElementById('imagePreviewContainer');
    const previewImg = document.getElementById('imagePreview');

    imageInput.value = '';
    previewImg.src = '';
    previewContainer.style.display = 'none';
}

// Create New Post with Image Support
function addPost() {
    const postText = document.getElementById('postInput').value;
    const imageInput = document.getElementById('imageInput');
    const postsFeed = document.getElementById('postsFeed');

    if (!postText.trim() && imageInput.files.length === 0) {
        alert('தயவுசெய்து ஏதாவது டைப் செய்யவும் அல்லது படத்தை தேர்ந்தெடுக்கவும்!');
        return;
    }

    const postCard = document.createElement('div');
    postCard.className = 'post-card';

    let imageHTML = '';
    if (imageInput.files && imageInput.files[0]) {
        const imgURL = URL.createObjectURL(imageInput.files[0]);
        imageHTML = `<img src="${imgURL}" class="post-image" alt="Post Image">`;
    }

    postCard.innerHTML = `
        <div class="post-header">
            <div class="post-header-left">
                <div class="avatar" style="width:40px; height:40px; line-height:40px; font-size:18px;">M</div>
                <div>
                    <strong>Mirudhula</strong>
                    <p style="font-size:12px; color:gray;">இப்போது</p>
                </div>
            </div>
            <div>
                <button onclick="editPost(this)" style="padding: 4px 8px; font-size: 12px;">Edit</button>
                <button onclick="deletePost(this)" class="danger" style="padding: 4px 8px; font-size: 12px;">Delete</button>
            </div>
        </div>
        <p class="post-content">${postText}</p>
        ${imageHTML}
        <div class="post-actions">
            <button onclick="likePost(this)">❤️ Like (<span class="like-count">0</span>)</button>
        </div>
        <div class="comments-section">
            <div class="comments-list"></div>
            <div class="comment-input-box">
                <input type="text" placeholder="Write a comment...">
                <button onclick="addComment(this)">Send</button>
            </div>
        </div>
    `;

    postsFeed.prepend(postCard);

    // Clear Inputs
    document.getElementById('postInput').value = '';
    removeSelectedImage();
}

// Edit Post
function editPost(button) {
    const postCard = button.closest('.post-card');
    const postContent = postCard.querySelector('.post-content');
    const newText = prompt('உங்கள் பதிவை திருத்தவும்:', postContent.innerText);
    if (newText !== null && newText.trim() !== '') {
        postContent.innerText = newText;
    }
}

// Delete Post
function deletePost(button) {
    if (confirm('இந்தப் பதிவை நீக்க வேண்டுமா?')) {
        const postCard = button.closest('.post-card');
        postCard.remove();
    }
}

// Like Post
function likePost(button) {
    const likeCountSpan = button.querySelector('.like-count');
    let likes = parseInt(likeCountSpan.innerText);
    likes++;
    likeCountSpan.innerText = likes;
}

// Add Comment
function addComment(button) {
    const input = button.previousElementSibling;
    const commentText = input.value;
    if (!commentText.trim()) return;

    const commentsList = button.closest('.comments-section').querySelector('.comments-list');
    const newComment = document.createElement('p');
    newComment.style.fontSize = '14px';
    newComment.style.margin = '4px 0';
    newComment.innerHTML = `<strong>You:</strong> ${commentText}`;
    
    commentsList.appendChild(newComment);
    input.value = '';
}

// Search / Filter Posts
function filterPosts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const posts = document.querySelectorAll('.post-card');

    posts.forEach(post => {
        const text = post.querySelector('.post-content').innerText.toLowerCase();
        if (text.includes(query)) {
            post.style.display = 'block';
        } else {
            post.style.display = 'none';
        }
    });
}