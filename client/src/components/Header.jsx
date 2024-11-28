import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { resetState } from "../redux/user/userSlice";
// Assuming you have a logout action

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const { currentuser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme); // Get the theme from Redux
  const dispatch = useDispatch();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme()); // Dispatch theme toggle action
  };

  const handleLogout = () => {
  // Dispatch logout action
    setIsProfileMenuOpen(false);
  };

  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const closeMenu = (e) => {
      if (!e.target.closest(".profile-menu")) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, []);

  return (
    <header className="p-5 border-b border-gray-500">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Design */}
        <Link
          to="/"
          className="self-center whitespace-nowrap text-md sm:text-xl font-semibold dark:text-white"
        >
          <span className="px-3 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
            Rupam's
          </span>
          <span className="text-gray-500 text-md">Blog</span>
        </Link>

        {/* Search for Desktop */}
        <form className="hidden lg:inline">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 pr-10 rounded border border-gray-300 outline-0"
            />
            <AiOutlineSearch className="absolute right-2 text-gray-400 cursor-pointer w-6 h-6" />
          </div>
        </form>

        {/* Hamburger Icon */}
        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none order-4"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 order-1 md:order-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-blue-400" : "hover:text-gray-400"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "text-blue-400" : "hover:text-gray-400"
            }
          >
            About
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive ? "text-blue-400" : "hover:text-blue-400"
            }
          >
            Projects
          </NavLink>
        </nav>

        {/* Dark Mode Icon and SignIn Button */}
        <div className="flex items-center gap-2 order-2 md:order-3 relative">
          <button
            className="w-12 h-10 text-gray-400 sm:inline"
            onClick={handleThemeToggle}
          >
            <FaMoon />
          </button>
          {currentuser ? (
            <div className="relative profile-menu">
              <button onClick={toggleProfileMenu}>
                <img
                  src={
                    currentuser.profilePicture || "path/to/default-avatar.png"
                  }
                  alt={`${currentuser.username}'s Profile`}
                  className="w-8 h-8 rounded-full"
                  referrerPolicy="no-referrer"
                />
              </button>
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-auto bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col">
                  <span className="p-1 ">{currentuser.username}</span>
                  <span className="p-1">{currentuser.email}</span>
                  <Link
                    to="/dashboard?tab=profile" // Changed 'tap' to 'tab'
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/dashboard?tab=setting"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-b-lg"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/signup">
              <button className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white text-lg">
                Sign Up
              </button>
            </Link>
          )}
        </div>

        {/* Search Icon for Small Screens */}
        <button className="w-12 h-10 lg:hidden text-gray-400 order-3 md:order-2">
          <AiOutlineSearch className="w-6 h-5" />
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`${isOpen ? "block" : "hidden"} md:hidden bg-gray-800 p-4`}
      >
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "block py-2 text-gray-400"
              : "block py-2 text-gray-200 hover:text-gray-400"
          }
          onClick={toggleMenu}
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive
              ? "block py-2 text-gray-400"
              : "block py-2 text-gray-200 hover:text-gray-400"
          }
          onClick={toggleMenu}
        >
          About
        </NavLink>
        <NavLink
          to="/services"
          className={({ isActive }) =>
            isActive
              ? "block py-2 text-gray-400"
              : "block py-2 text-gray-200 hover:text-gray-400"
          }
          onClick={toggleMenu}
        >
          Services
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive
              ? "block py-2 text-gray-400"
              : "block py-2 text-gray-200 hover:text-gray-400"
          }
          onClick={toggleMenu}
        >
          Contact
        </NavLink>
      </div>
    </header>
  );
};

export default Header;
