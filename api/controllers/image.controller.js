import File from '../models/image.model.js'; 
import cloudinary from '../config/cloudinary.js';
import {errorHandler} from '../utils/error.js'

// Function to handle the single image upload
 const uploadSingleImage = async (req, res,next) => {

  
  

  
  try {
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Cloudinary upload (optional, if you want to use Cloudinary for image storage)
    const image = req.file;
     
    const imagePath = image.path;
  
     // This is the local path if you're using disk storage with multer

    // Upload image to Cloudinary (if you choose to use Cloudinary)
    const cloudinaryResult = await cloudinary.uploader.upload(imagePath, {
      folder: 'your_folder_name', // Optional: specify folder in Cloudinary
    });

    // Create and save the image document in the database
    const newFile = new File({
      url: cloudinaryResult.secure_url,  // Store Cloudinary URL
      filename: req.file.filename,      // Store filename
      originalName: req.file.originalname,  // Store original name
      mimetype: req.file.mimetype,      // Store mimetype
      size: req.file.size,              // Store file size
      cloudinaryId: cloudinaryResult.public_id, // Store Cloudinary ID for future reference (if you want to delete or manage images)
    });

    // Save the file to the database
    await newFile.save();

    // Respond with success
    res.status(200).json({
      message: 'Image uploaded and saved successfully',
      file: newFile,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred during image upload' });
  }
};

export { uploadSingleImage };
