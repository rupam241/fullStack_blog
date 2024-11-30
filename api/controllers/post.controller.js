import Post from "../models/post.model.js";
import File from "../models/image.model.js";

export const createPost = async (req, res, next) => {
  try {
    const { title, content, category, imageFileId } = req.body;

    // Validate required fields
    if (!title || !content || !category || !imageFileId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (title, content, category, and imageFileId)',
      });
    }

    // Find the file by its ID from the File model
    const imageFile = await File.findById(imageFileId);

    // Check if the image file exists
    if (!imageFile) {
      return res.status(404).json({
        success: false,
        message: 'Image file not found in the File model',
      });
    }

    // Create a slug for the post title
    const slug = title
      .split(' ')
      .join('-')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '-');

    // Create a new post
    const newPost = new Post({
      title,
      content,
      category,
      userId: req.user?.id || 'Unknown', // Assuming user ID is passed
      image: imageFile._id,  // Store the ObjectId of the image from the File model
      imageUrl: imageFile.url, // Store the image URL from the File model
      slug,
    });

    // Save the post
    const savedPost = await newPost.save();

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: savedPost,
    });
  } catch (error) {
    next(error); // Handle errors properly
  }
};
