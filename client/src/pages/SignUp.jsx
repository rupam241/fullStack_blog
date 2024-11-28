import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Spinner } from "flowbite-react";
import Oauth from '../components/Oauth.jsx';

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state before submitting

    if (!formData.username || !formData.email || !formData.password) {
      return setError("Please fill out all fields");
    }

    try {
      setLoading(true); // Start loading
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      // Check if the signup was successful
      if (!res.ok) {
        return setError(data.message || "Signup failed. Please try again.");
      }

      alert(`${formData.username} registered successfully!`);

      navigate('/signin'); // Redirect to Sign In on success

    } catch (error) {
      console.error("Signup error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* Left side */}
        <div className="flex-1">
          <Link to="" className="font-bold dark:text-white text-4xl">
            <span className="px-3 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Rupam's
            </span>
            <span className="text-gray-500 text-md">Blog</span>
          </Link>
          <p className="text-sm mt-5">
            If you want to read the article, please signup with your email and password or with Google.
          </p>
        </div>

        {/* Right side */}
        <div className="flex-1">
          <form className="flex flex-col gap-4 text-xl" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                placeholder="Username"
                id="username"
                className="w-full p-2 pr-10 rounded border border-gray-500 outline-0"
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="name@gmail.com"
                id="email"
                className="w-full p-2 pr-10 rounded border border-gray-500 outline-0"
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Password"
                id="password"
                className="w-full p-2 pr-10 rounded border border-gray-500 outline-0"
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white text-lg flex items-center justify-center">
              {loading ? (
                <>
                  <Spinner className="w-5 h-5" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </button>
            <Oauth/>
          </form>

          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account? </span>
            <Link to="/signin" className="text-blue-500">Sign In</Link>
          </div>

          {error && (
            <Alert className="mt-5" color="failure">
              {error}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignUp;
