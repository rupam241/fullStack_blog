import { Alert, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInFailure, signInSuccess } from '../redux/user/userSlice';
import Oauth from '../components/Oauth.jsx';

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Effect to log data when it's available
  useEffect(() => {
    if (formData.email && formData.password) {
      console.log(formData); // Log form data whenever formData is updated
    }
  }, [formData]); // Dependency on formData

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill all the fields'));
    }

    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      // Log the data here, to check if API response is correct
   

      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
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
            If you want to read the article, please sign in with your email and password or with Google.
          </p>
        </div>

        {/* Right side */}
        <div className="flex-1">
          <form className="flex flex-col gap-4 text-xl" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="name@gmail.com"
                id="email"
                className="w-full p-2 pr-10 rounded border border-gray-500 outline-0"
                onChange={handleChange}
                value={formData.email}
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
                value={formData.password}
              />
            </div>

            <button type="submit" className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white text-lg flex items-center justify-center">
              {loading ? (
                <>
                  <Spinner className="w-5 h-5" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <Oauth />
          </form>

          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account? </span>
            <Link to="/signup" className="text-blue-500">Sign up</Link>
          </div>

          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
