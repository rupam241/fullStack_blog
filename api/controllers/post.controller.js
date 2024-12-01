import Post from "../models/post.model.js";
import File from "../models/image.model.js";
import { errorHandler } from "../utils/error.js";

export const createPost = async (req, res, next) => {
  console.log(req.user.isAdmin);
  if(!req.user.isAdmin){
    next(errorHandler(404," you are not authorized"))
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
    console.log(imageFile);

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
