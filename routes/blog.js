// routes/blog.js
const express = require('express');
const multer = require('multer'); // For handling file uploads
const { createBlogPost, getAllBlogPosts, updateBlogPost, deleteBlogPost, getBlogPostById, getBlogPostsByUser, getUserBlogPosts } = require('../controllers/blogController');
const { verifyToken } = require('../middleware/auth'); // You'll need to create this middleware for authentication

const router = express.Router();

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Create Blog Post Route
router.post('/', verifyToken, upload.single('image'), createBlogPost); // Expecting image field in the form data

// Get All Blog Posts Route
router.get('/', getAllBlogPosts);

// Get Single Blog Post Route
router.get('/:id', getBlogPostById);

// Get All Blog Posts by Authenticated User Route
// TODO

// Update Blog Post Route
router.put('/:id', verifyToken, upload.single('image'), updateBlogPost); // Expecting image and blog details

// Delete Blog Post Route
router.delete('/:id', verifyToken, deleteBlogPost);

module.exports = router;
