import { errorHandler } from "../utils/error.js";
import Post from "../models/post.model.js";

export const createPost = async (req, res, next) => {
    console.log(req.user);
 
    
    
    try {
       

        console.log(req.user.isAdmin);

        
        // Check if the user is an admin
        if (!req.user.isAdmin) {
            return next(errorHandler(403, "You are not allowed to create a post"));
        }

        // Validate required fields
        if (!req.body.title || !req.body.content) {
            return next(errorHandler(400, "Please provide all the fields"));
        }

        // Generate slug from title
        const slug = req.body.title
            .split(' ')
            .join('-')
            .toLowerCase()
            .replace(/[^a-zA-Z0-9-]/g, '-');

        // Create a new post instance
        const newPost = new Post({
            ...req.body,
            slug,
            userId: req.user?.id || "Unknown", // Ensure userId is provided or default to "Unknown"
        });

        // Save the post to the database
        const savedPost = await newPost.save();

        // Respond with the saved post
        res.status(201).json({
            success: true,
            message: "Post created successfully",
            data: savedPost,
        });
    } catch (error) {
        // Pass any errors to the error handler middleware
        next(error);
    }
};
