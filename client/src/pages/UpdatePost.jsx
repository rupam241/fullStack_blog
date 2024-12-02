import React, { useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function UpdatePost() {
  const [imageChange, setImageChange] = useState(null); // Tracks selected image for upload
  const [imageData, setImageData] = useState(null); // Holds image URL for the post
  const [title, setTitle] = useState(""); // Post title
  const [category, setCategory] = useState("uncategorized"); // Post category
  const [content, setContent] = useState(""); // Post content
  const [error, setError] = useState(""); // Error state to handle errors

  const navigate = useNavigate();
  const { postId } = useParams();
  const { currentuser } = useSelector((state) => state.user);

  // UseEffect to fetch the post data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/posts/get-post?postId=${postId}`);
        const data = await res.json();

        if (res.ok) {
          setTitle(data.posts[0].title);
          setContent(data.posts[0].content);
          setCategory(data.posts[0].category);
          setImageData(data.posts[0].imageUrl); // Set the initial image URL
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchData();
  }, [postId]);

  // Upload Image function
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
        setImageData(getRes.file.url); // Update the image URL
        setImageChange(null); // Reset the selected image
        alert("Image uploaded successfully");
      } else {
        alert("Image upload failed");
      }
    } catch (error) {
      console.log("Error uploading image:", error);
    }
  };

  // Handle form submission (updating the post)
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/posts/update-post/${postId}/${currentuser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          category,
          content,
          imageUrl: imageData, // Include image URL in the request body
        }),
      });

      const responseData = await res.json();

      if (res.ok) {
        alert("Post updated successfully");
        // You can redirect or reset the form here if necessary
      } else {
        setError(responseData.error || "Error updating post");
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Error updating post:", error);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update a Post</h1>
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
        {/* Title and Category Fields */}
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <input
            type="text"
            placeholder="Title"
            required
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
          </select>
        </div>

        {/* Image Upload Section */}
        <div className="flex flex-wrap gap-4 items-center justify-between border-4 border-teal-100 border-dotted p-3">
          {imageData && !imageChange ? (
            // Show the current image if no new file is selected
            <div className="flex flex-col items-center gap-2">
              <img
                src={imageData}
                alt="Current Post"
                className="w-full h-auto object-cover rounded-md"
              />
              <button
                type="button"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-md text-sm"
                onClick={() => setImageChange(true)} // Enable file selection
              >
                Change Image
              </button>
            </div>
          ) : (
            // Show file input and upload button if the user is changing the image
            <div className="flex items-center justify-between gap-4">
              <input
                type="file"
                accept="image/*"
                className="sm:w-auto"
                id="image"
                onChange={(e) => setImageChange(e.target.files[0])}
              />
              {imageChange && (
                <button
                  type="button"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-md text-sm"
                  onClick={uploadImage} // Trigger image upload
                >
                  Upload Image
                </button>
              )}
            </div>
          )}
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
          Update
        </button>
      </form>
    </div>
  );
}

export default UpdatePost;
