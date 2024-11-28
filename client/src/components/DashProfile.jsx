import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeImage } from "../redux/file/imageSlice";

function DashProfile() {
  const dispatch = useDispatch();
  const { currentuser } = useSelector((state) => state.user);
  const filePickerRef = useRef();
  const [imageFileData, setimageFileData] = useState(null);
  const [imageFileUrl, setimageFileUrl] = useState(null);
  const [getImage, setGetImage] = useState(null);
  const [formData, setFormData] = useState(null);

  const handleImageChange = (e) => {
    const imagefile = e.target.files[0];
    if (imagefile && imagefile.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(imagefile);
      setimageFileData(imagefile);
      setimageFileUrl(imageUrl);
    } else {
      console.log("Selected file is not an image");
    }
  };

  //handle the changes in input

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,profilepicture:getImage // For fields like username, email, password
    });
  };
  console.log(formData); 

  // route for updating userDetails



  const uplodImage = async () => {
    if (!imageFileData) {
      console.error("No file selected for upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFileData);

    try {
      const response = await fetch("/api/files/upload-single", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("Upload response:", data);

      if (response.ok) {
        dispatch(changeImage(data));
        setGetImage(data.file.url);

        // Example: Update Redux store with uploaded image URL
      } else {
        console.error("Image upload failed:", data);
      }
    } catch (error) {
      console.error("Error during image upload:", error);
    }
  };

  useEffect(() => {
    if (imageFileData) {
      uplodImage();
    }
  }, [imageFileData]);

  const handleSubmit=async(req,res)=>{
    e.preventDefault;
    try {
      const updateValue=await fetch('/api/user/update',{
        headers
      })
    } catch (error) {
      
    }
  }

  return (
    <div className="max-w-lg mx-auto p-3 w-full flex flex-col gap-1">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            handleImageChange(e); // Call the handleImageChange function
            handleChange(e); // Call the handleChange function
          }}
          ref={filePickerRef}
          className="hidden"
          id="profilepicture"
        />
        <div
          className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => {
            filePickerRef.current.click();
          }}
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
            placeholder="username"
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
      </form>
      <button
        className="mt-2 border-2 border-slate p-2 rounded-full hover:bg-blue-400"
        onClick={uplodImage}
      >
        Update
      </button>
      <div className="flex justify-between mt-2 text-red-400">
        <div className="cursor-pointer">Delete Account</div>
        <div className="cursor-pointer">Sign Out</div>
      </div>
    </div>
  );
}

export default DashProfile;
