import path from 'path';
import File from '../models/image.model.js'; // Import the File model

// Function to handle single image upload
const uploadSingleImage = async (req, res) => {
  try {
    // Check if a file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Check if the uploaded file is an image
    if (!req.file.mimetype.startsWith('image')) {
      return res.status(400).json({ message: 'Uploaded file is not an image' });
    }

    // Define the local path (URL) where the image is stored
    const imageUrl = path.join('uploads', req.file.filename); // This assumes 'uploads' folder is in your project root

    // Save the image information to MongoDB asynchronously
    const file = new File({
      url: imageUrl,  // Store the local file path
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    // Save the file document asynchronously to MongoDB
    await file.save();  // Wait for the save operation to complete

    // Return the image information in the response
    res.status(200).json({
      message: 'Image uploaded and saved to database successfully',
      file: file, // Return the saved file document
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred during image upload' });
  }
};




export  {uploadSingleImage} ;
