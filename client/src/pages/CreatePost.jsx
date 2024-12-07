import React, { useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import {useNavigate} from 'react-router-dom'

function CreatePost() {
  const [imageChange, setImageChange] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("uncategorized");
  const [content, setContent] = useState("");
  const [error, setError] = useState(""); // Error state to handle errors

  const navigate=useNavigate();
  const [sendData, setSendData] = useState({
    title,
    category,
    content,
    imageFileId: imageData,
  });

  useEffect(() => {
    setSendData({
      title,
      category,
      content,
      imageFileId: imageData,
    });
  }, [title, category, content, imageData]);

  const uploadImage = async () => {
    if (!imageChange) {
      alert("No image file uploaded");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("image", imageChange);

    try {
      const res = await fetch("/api/files/upload-single", {
        method: "POST",
        body: uploadData,
      });
      const getRes = await res.json();

      if (res.ok) {
        setImageData(getRes.file.filename); // Update imageData after successful upload
        alert("Image uploaded successfully");
        
      } else {
        alert("Image upload failed");
      }
    } catch (error) {
      console.log("Error uploading image:", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate the form fields before submitting
    if (!title || !content || !category || !imageData) {
      setError("Please provide all required fields (title, content, category, and image).");
      return;
    }

    try {
      const response = await fetch("/api/posts/create-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
      });

      const data = await response.json();
      console.log(data.data.slug);
      

      

      if (response.ok) {
        alert("Post created successfully");
        navigate(`/post/${data.data.slug}`);
      } else {
        setError(data.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setError("An error occurred while creating the post");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col gap-4"
        type="submit"
      >
        {/* Title and Category Fields */}
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <input
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1 outline-none border-2 border-teal-100 border-dotted p-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <select
            name="category"
            id="category"
            className="p-1 rounded-lg"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="react">React.js</option>
            <option value="next">Next.js</option>
            <option value="array">Array</option>
            <option value="string">String</option>
          </select>
        </div>

        {/* Image Upload Section */}
        <div className="flex flex-wrap gap-4 items-center justify-between border-4 border-teal-100 border-dotted p-3">
          <input
            type="file"
            accept="image/*"
            className="sm:w-auto"
            id="image"
            onChange={(e) => setImageChange(e.target.files[0])}
          />
          <button
            onClick={uploadImage}
            type="button"
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-md text-sm sm:w-auto"
          >
            Upload Image
          </button>
        </div>

        {/* Content (Rich Text Editor) */}
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          value={content}
          onChange={setContent}
        />

        {/* Error Message */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full text-center bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-md mt-2"
        >
          Publish
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
