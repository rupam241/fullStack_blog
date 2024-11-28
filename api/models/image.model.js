// models/File.js
import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,  // This will store the local path of the image
  },
  filename: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
});

const File = mongoose.model('File', fileSchema);

export default File;
