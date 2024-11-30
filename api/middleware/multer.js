import multer from 'multer';
import path from 'path';

// Define the storage location and filename using disk storage
const storage = multer.diskStorage({
  // Specify where to store the uploaded file (in 'uploads' directory)
  destination: (req, file, cb) => {
    // Ensure the 'uploads' folder exists and resolve the absolute path
    cb(null, path.resolve('uploads'));  // 'uploads' folder in the project root
  },
  // Specify how to name the uploaded file
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Add unique suffix to filename
    cb(null, uniqueSuffix + path.extname(file.originalname));  // Retain the file extension
  }
});

// Multer upload setup using disk storage
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024,  // Limit the file size to 50MB (adjust as necessary)
  },
  fileFilter: (req, file, cb) => {
    // Allow only images (you can adjust this as per your requirements)
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);  // Allow the file if it matches one of the allowed types
    } else {
      cb(new Error('Only image files (jpeg, png, gif, jpg) are allowed'), false);
    }
  },
});

// Export multer upload for use in routes
export default upload ;
