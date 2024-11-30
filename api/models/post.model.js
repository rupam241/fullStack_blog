import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true, // Ensures titles are unique
    },
    imageUrl: {
      type: String,  // Store the URL directly as a string
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ0JsvMgqFaoc2sETK_NJl89I58BkPgYLVLg&s", // Default image URL
    },
    imageFileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File", // Reference to the File model (to store image file's _id)
    },
    category: {
      type: String,
      default: "uncategorized", // Default category
    },
    slug: {
      type: String,
      required: true,
      unique: true, // Ensures slugs are unique
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
