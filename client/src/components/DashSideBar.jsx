import { HiUser } from "react-icons/hi";
import { HiArrowSmRight,HiDocumentText } from "react-icons/hi";
import { FaComment } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import React from "react";

function DashSideBar({ tab }) {
 
  
  const { currentuser } = useSelector((state) => state.user);
  return (
    <div className=" flex flex-col gap- p-3">
      <div
        className={`flex justify-between px-4 py-2 rounded-lg cursor-pointer items-center ${
          tab === "profile" ? "bg-slate-100" : ""
        }`}
      >
        <div className="flex  gap-4">
          <div className="flex gap-2 items-center ">
            <div>
              <HiUser />
            </div>

            <Link to="/dashboard?tab=profile">
              <div>Profile</div>
            </Link>
          </div>

          {/* user */}
          <div className="bg-slate-400 rounded-lg">
            {currentuser.isAdmin ? "Admin" : "user"}
          </div>
        </div>
      </div>

      {/* posts */}

        {currentuser.isAdmin && (
        <div
          className={`flex justify-between px-4 py-2 rounded-lg cursor-pointer items-center ${
            tab === "posts" ? "bg-slate-100" : ""
          }`}
        >
          <div className="flex gap-4">
            <div className="flex gap-2 items-center">
              <div>
                <HiDocumentText />
              </div>

              <Link to="/dashboard?tab=posts">
                <div>Posts</div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* users */}

      {currentuser.isAdmin && (
        <div
          className={`flex justify-between px-4 py-2 rounded-lg cursor-pointer items-center ${
            tab === "users" ? "bg-slate-100" : ""
          }`}
        >
          <div className="flex gap-4">
            <div className="flex gap-2 items-center">
              <div>
                <HiDocumentText />
              </div>

              <Link to="/dashboard?tab=users">
                <div>Users</div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* comments */}
      {currentuser.isAdmin && (
        <div
          className={`flex justify-between px-4 py-2 rounded-lg cursor-pointer items-center ${
            tab === "comments" ? "bg-slate-100" : ""
          }`}
        >
          <div className="flex gap-4">
            <div className="flex gap-2 items-center">
              <div>
              <FaComment />
              </div>

              <Link to="/dashboard?tab=comments">
                <div>Comment</div>
              </Link>
            </div>
          </div>
        </div>
      )}
      {/* signout */}
      <div className="flex justify-between  px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-100">
        <div className="flex gap-2 items-center">
          <div>
            <HiArrowSmRight />
          </div>
          <div>Signout</div>
        </div>
      </div>
    </div>
  );
}

export default DashSideBar;
