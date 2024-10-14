// controller/blogController.js

const Blog = require('../models/Blog');
const cloudinary = require('../config/cloudinary');
const stream = require('stream');
const mongoose = require('mongoose'); // Import mongoose

exports.createBlogPost = async (req, res) => {
    console.log(req.body); // Logs the incoming body
    const { title, description, location } = req.body;

    const userId = req.user.id; // Assuming you have authentication middleware

    try {
        // Check if an image file is uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Create a stream to pass the buffer to Cloudinary
        const bufferStream = new stream.PassThrough();
        bufferStream.end(req.file.buffer);

        // Upload the image using Promises
        const result = await new Promise((resolve, reject) => {
            bufferStream.pipe(
                cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                    if (error) {
                        console.error('Error uploading to Cloudinary:', error);
                        return reject(new Error('Error uploading image'));
                    }
                    resolve(result);
                })
            );
        });

        // Parse the location string to an object if it's a string
        let parsedLocation;
        try {
            parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;
        } catch (error) {
            return res.status(400).json({ message: 'Invalid location format' });
        }

        // Create a new blog post
        const newBlogPost = await Blog.create({
            title,
            description,
            imageUrl: result.secure_url,
            location: parsedLocation,
            user: userId,
        });

        // Send the response
        return res.status(201).json(newBlogPost);

    } catch (error) {
        console.error('Error creating blog post:', error);
        if (error instanceof mongoose.Error) {
            return res.status(500).json({ message: 'Database connection error', error: error.message });
        }
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get All Blog Posts
exports.getAllBlogPosts = async (req, res) => {
    try {
        const blogPosts = await Blog.find(); // Populate user field
        res.status(200).json(blogPosts);
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        if (error instanceof mongoose.Error) {
            return res.status(500).json({ message: 'Database connection error', error: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Blog Post by ID
exports.getBlogPostById = async (req, res) => {
    const blogId = req.params.id; // Get blog ID from URL params

    try {
        const blogPost = await Blog.findById(blogId).populate('user', 'username'); // Populate user field
        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.status(200).json(blogPost);
    } catch (error) {
        console.error('Error fetching blog post:', error);
        if (error instanceof mongoose.Error) {
            return res.status(500).json({ message: 'Database connection error', error: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update Blog Post
exports.updateBlogPost = async (req, res) => {
    console.log(req.body);
    const { title, description, location } = req.body;
    const userId = req.user.id; // Get user ID from token
    const blogId = req.params.id; // Blog ID from URL params

    try {
        const blogPost = await Blog.findById(blogId);

        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        // Check if the logged-in user is the author of the blog post
        if (blogPost.user.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        // Initialize newUrl for the image URL
        let newUrl = blogPost.imageUrl; // Keep the old URL if no new image is uploaded

        // If there's a new image, upload it to Cloudinary
        if (req.file) {
            // Create a stream to pass the buffer to Cloudinary
            const bufferStream = new stream.PassThrough();
            bufferStream.end(req.file.buffer);

            // Upload the image using Promises
            const result = await new Promise((resolve, reject) => {
                bufferStream.pipe(
                    cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                        if (error) {
                            console.error('Error uploading to Cloudinary:', error);
                            return reject(new Error('Error uploading image'));
                        }
                        resolve(result);
                    })
                );
            });

            // Get the new image URL from the upload result
            newUrl = result.secure_url;
        }

        // Update fields
        blogPost.title = title || blogPost.title;
        blogPost.description = description || blogPost.description;
        blogPost.location = location ? JSON.parse(location) : blogPost.location;
        blogPost.imageUrl = newUrl; // Update the image URL

        const updatedBlogPost = await blogPost.save();

        res.status(200).json(updatedBlogPost);
    } catch (error) {
        console.error('Error updating blog post:', error);
        if (error instanceof mongoose.Error) {
            return res.status(500).json({ message: 'Database connection error', error: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete Blog Post
exports.deleteBlogPost = async (req, res) => {
    const userId = req.user.id; // Get user ID from token
    const blogId = req.params.id; // Blog ID from URL params

    try {
        const blogPost = await Blog.findById(blogId);

        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        // Check if the logged-in user is the author of the blog post
        if (blogPost.user.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        // Use findByIdAndDelete instead of remove
        await Blog.findByIdAndDelete(blogId); // Deletes the blog post by ID

        res.status(200).json({ message: 'Blog post deleted' });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        if (error instanceof mongoose.Error) {
            return res.status(500).json({ message: 'Database connection error', error: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
