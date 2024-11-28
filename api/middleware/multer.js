import multer from 'multer';
import path from 'path';

// Define the storage location and filename using disk storage
const storage = multer.diskStorage({
  // Specify where to store the uploaded file (in 'uploads' directory)
  destination: (req, file, cb) => {
    // Use an absolute path to ensure correct directory location
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
    // Accept all file types by default
    cb(null, true);  // Allow any file type
    // You can add specific conditions here if you want to limit by MIME types (optional)
    // if (file.mimetype.startsWith('image') || file.mimetype.startsWith('application')) {
    //   cb(null, true);  // Allow image and application files
    // } else {
    //   cb(new Error('Only image and application files are allowed'), false);
    // }
  },
});

export default upload;
