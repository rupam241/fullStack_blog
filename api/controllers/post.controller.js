import Post from "../models/post.model.js";
import File from "../models/image.model.js";
import { errorHandler } from "../utils/error.js";

export const createPost = async (req, res, next) => {
  if (!req.user.isAdmin) {
    next(errorHandler(404, " you are not authorized"));
  }

  try {
    const { title, content, category, imageFileId } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (title, content)",
      });
    }

    // Find the image file by its ID (filename or ObjectId)
    const imageFile = await File.findOne({ filename: imageFileId });

    if (!imageFile) {
      return res.status(404).json({
        success: false,
        message: "Image file not found",
      });
    }

    // Create a slug for the post title
    const slug = title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "-");

    // Create the post
    const newPost = new Post({
      title,
      content,
      category,
      userId: req.user?.id || "Unknown", // User ID from request
      imageUrl: imageFile.url, // Store the image URL from the File model
      imageFileId: imageFile._id, // Store the ObjectId of the image file
      slug,
    });

    // Save the post
    const savedPost = await newPost.save();

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: savedPost,
    });
  } catch (error) {
    next(error);
  }
};

export const getposts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDir = req.query.order === "asc" ? 1 : -1;

    // Filters
    const filters = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    };

    // Query with filters, sorting, and pagination
    const posts = await Post.find(filters)
      .sort({ updateAt: sortDir })
      .skip(startIndex)
      .limit(limit);

    // Total count of filtered posts
    const totalPosts = await Post.countDocuments(filters);

    // Posts created in the last month
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthsPost = await Post.countDocuments({
      ...filters,
      createdAt: { $gte: oneMonthAgo },
    });

    // Response
    res.status(200).json({
      posts,
      totalPosts,
      lastMonthsPost,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    next(error); // Pass error to middleware
  }
};

export const deletePost = async (req, res, next) => {
  // Logging the user information for debugging purposes


  // Authorization check: User should be an admin OR the user should own the post
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(400, "You are not authorized to delete this post"));
  }

  try {
    // Find and delete the post by its ID
    const post = await Post.findByIdAndDelete(req.params.postId);

    // If no post is found, return an error
    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }

    // Success response
    res.status(200).json('The post has been deleted');
    
  } catch (error) {
    // Pass any errors to the error handler middleware
    next(error);
  }
};




