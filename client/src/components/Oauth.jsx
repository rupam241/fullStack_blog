import React, { useState } from "react";
import { Alert, Spinner } from 'flowbite-react';
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase"; // Adjust the path if firebase.js is elsewhere
import { useDispatch,useSelector } from "react-redux";
import { signInSuccess, signInStart, signInFailure } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";


function Oauth() {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      dispatch(signInStart()); // Start sign-in process (set loading state)

      // Attempt sign-in with Google popup
      const resultFromGoogle = await signInWithPopup(auth, provider);
      const { displayName, email, photoURL } = resultFromGoogle.user;

      // Send user data to your API
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          email,
          photoURL,
        }),
      });

      // Check if the response is ok and handle accordingly
      if (res.ok) {
        const data = await res.json(); // Parse the JSON response
        console.log(data); // Log the response for debugging

        // Dispatch user data to the Redux store and navigate
        dispatch(signInSuccess(data)); 
        navigate("/"); // Redirect to the home page
      } else {
        const errorData = await res.json(); // Parse error response
        console.error("API Error:", errorData); // Log API error
        dispatch(signInFailure(errorData.message || "Failed to sign in")); // Dispatch failure action
      }
    } catch (error) {
      // Catch errors during the sign-in process
      console.error("Error during Google sign-in:", error);
      dispatch(signInFailure(error.message)); // Dispatch failure with error message
    }
  };

  return (
    <>
    <button
      type="button"
      className="px-2 py-1 bg-transparent rounded-lg text-lg flex items-center justify-center border hover:bg-gradient-to-t from-pink-500 to-orange-400"
      onClick={handleGoogleClick}
    >
      Sign In with Google
    </button>
    
    
    </>
  );
}

export default Oauth;
