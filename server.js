const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Image Upload Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// In-memory data storage
let posts = [];
let users = {
    'Mirudhula': { followers: 120, following: 45, isFollowing: false }
};

// Ensure uploads folder exists
const fs = require('fs');
if (!fs.existsSync('./uploads')){
    fs.mkdirSync('./uploads');
}

// Get all posts
app.get('/api/posts', (req, res) => {
    res.json({ posts, user: users['Mirudhula'] });
});

// Create post with image support
app.post('/api/posts', upload.single('image'), (req, res) => {
    const { username, content } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newPost = {
        id: Date.now(),
        username: username || 'Mirudhula',
        content,
        imageUrl,
        likes: 0,
        comments: []
    };
    posts.unshift(newPost);
    res.status(201).json(newPost);
});

// Edit post
app.put('/api/posts/:id', (req, res) => {
    const postId = Number(req.params.id);
    const { content } = req.body;
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.content = content;
        res.json(post);
    } else {
        res.status(404).json({ error: 'Post not found' });
    }
});

// Delete post
app.delete('/api/posts/:id', (req, res) => {
    const postId = Number(req.params.id);
    posts = posts.filter(p => p.id !== postId);
    res.json({ success: true });
});

// Like post
app.post('/api/posts/:id/like', (req, res) => {
    const postId = Number(req.params.id);
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.likes += 1;
        res.json(post);
    } else {
        res.status(404).json({ error: 'Post not found' });
    }
});

// Add comment
app.post('/api/posts/:id/comment', (req, res) => {
    const postId = Number(req.params.id);
    const { comment } = req.body;
    const post = posts.find(p => p.id === postId);
    if (post && comment) {
        post.comments.push(comment);
        res.json(post);
    } else {
        res.status(400).json({ error: 'Failed to add comment' });
    }
});

// Toggle Follow
app.post('/api/follow', (req, res) => {
    const user = users['Mirudhula'];
    user.isFollowing = !user.isFollowing;
    if (user.isFollowing) user.followers += 1;
    else user.followers -= 1;
    res.json(user);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));