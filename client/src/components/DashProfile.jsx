import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeImage } from "../redux/file/imageSlice";
import { updateFailure, updateStart, updateSucess } from "../redux/user/userSlice";

function DashProfile() {
  const dispatch = useDispatch();
  const { currentuser } = useSelector((state) => state.user);
  const { image } = useSelector((state) => state.image);

  const filePickerRef = useRef();
  const [imageFileData, setImageFileData] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [formData, setFormData] = useState({});
  const[showModel,setShowModel]=useState(false)

  // Handle image selection
  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    if (imageFile && imageFile.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(imageFile);
      setImageFileData(imageFile);
      setImageFileUrl(imageUrl);
    } else {
      console.log("Selected file is not an image");
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });

    if (e.target.id === "profilePicture") {
      setFormData((prev) => ({
        ...prev,
        profilePicture: profilePicture
      }));
    }
  };
console.log(formData);

  // Upload image to the server
  const uploadImage = async () => {
    if (!imageFileData) {
      console.error("No file selected for upload.");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("image", imageFileData);

    try {
      const response = await fetch("/api/files/upload-single", {
        method: "POST",
        body: uploadData,
      });
      const data = await response.json();

      if (response.ok) {
        dispatch(changeImage(data));
        setFormData((prev) => ({
          ...prev,
          profilepicture: data.file.url,
        }));
        console.log("Image uploaded successfully:", data);
      } else {
        console.error("Image upload failed:", data);
      }
    } catch (error) {
      console.error("Error during image upload:", error);
    }
  };

  // Trigger image upload when an image is selected
  useEffect(() => {
    if (imageFileData) {
      uploadImage();
    }
  }, [imageFileData]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData || Object.keys(formData).length === 0) {
      console.log("No changes made to the form.");
      return;
    }
  
    try {
      dispatch(updateStart());
      const response = await fetch(`/api/user/update/${currentuser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      if (!response.ok) {
        dispatch(updateFailure(data.message));
      } else {
        dispatch(updateSucess(data)); // Ensure `data` contains the updated user object
      }
    } catch (error) {
      dispatch(updateFailure("An error occurred during the update."));
      console.error("Error during user update:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full flex flex-col gap-1">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            handleImageChange(e);
            handleChange(e);
          }}
          ref={filePickerRef}
          className="hidden"
          id="profilepicture"
        />
        <div
          className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          <img
            src={imageFileUrl || currentuser.profilepicture}
            alt="user"
            className="rounded-full w-full object-cover border-8 border-[lightgray]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            id="username"
            placeholder="Username"
            defaultValue={currentuser?.username || ""}
            className="outline-none border-2 border-slate-300 p-2 rounded-full font-serif text-md"
            onChange={handleChange}
          />
          <input
            type="text"
            id="email"
            placeholder="Email"
            defaultValue={currentuser?.email || ""}
            className="outline-none border-2 border-slate-300 p-2 rounded-full font-serif text-md"
            onChange={handleChange}
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="outline-none border-2 border-slate-300 p-2 rounded-full font-serif text-md"
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="mt-2 border-2 border-slate p-2 rounded-full hover:bg-blue-400"
        >
          Update
        </button>
      </form>
      <div className="flex justify-between mt-2 text-red-400">
        <div className="cursor-pointer"onClick={(()=>{
          setShowModel(true)
        })}>Delete Account</div>
        <div className="cursor-pointer">Sign Out</div>
      </div>
   
    </div>
  );
}

export default DashProfile;
