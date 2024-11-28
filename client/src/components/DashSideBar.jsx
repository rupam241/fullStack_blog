import { HiUser } from "react-icons/hi";
import {HiArrowSmRight} from "react-icons/hi"
import { Link } from "react-router-dom";

import React from "react";

function DashSideBar({tab}) {
  return (
    <div className=" flex flex-col gap-1">
  <div className={`flex justify-between px-4 py-2 rounded-lg cursor-pointer items-center ${
          tab === "profile" ? "bg-slate-100" : ""
        }`}>
    <div className="flex gap-2 items-center">
      <div>
        <HiUser />
      </div>
      <Link to='/dashboard?tab=profile'>
      <div>Profile</div>
      </Link>
    </div>

    {/* user */}
    <div>User</div>
  </div>
  

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
