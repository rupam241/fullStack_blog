import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="border border-t-8 border-teal-500 rounded-lg p-4">
      <div>
        <div>
          <div>
            <Link
              to=""
              className="self-center whitespace-nowrap text-md sm:text-text-xl font-semibold dark:text-white"
            >
              <span className="px-3 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                Rupam's
              </span>
              <span className="text-gray-500 text-md">Blog</span>
            </Link>
          </div>

          <div className="flex gap-7">
            <div className="flex flex-col ">
            <div className="mt-4 flex flex-col gap-2 text-gray-400 font-medium">
              <Link to="/about" className="font-bold text-gray-500">
                About
              </Link>
              <div className="flex flex-col gap-1">
                <Link to="/projects">100 JS Projects</Link>
                <Link to="">Rupam's Blog</Link>
              </div>
            </div>

            {/* Bottom section */}
            <div className="mt-4 flex flex-col gap-2 text-gray-400 font-medium">
              <Link to="/legal" className="font-bold text-gray-500">
                Legal
              </Link>
              <div className="flex flex-col gap-1">
                <Link to="/privacy policy">Privacy Policy</Link>
                <Link to="">Terms and Conditions</Link>
              </div>
            </div>
            </div>

            {/* Follow Us section in a row */}
            <div className="mt-4">
              <div className="text-gray-400 font-medium">
                <span className="font-bold text-gray-500">Follow Us</span>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <Link to="https://github.com/rupam241Github" className="text-gray-500">
                  GitHub
                </Link>
                <Link to="https://discord.com" className="text-gray-500">
                  Discord
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
