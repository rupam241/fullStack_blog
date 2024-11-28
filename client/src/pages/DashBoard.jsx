import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSideBar from "../components/DashSideBar";
import DashProfile from "../components/DashProfile";

function DashBoard() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab") || "defaultTab"; // Use a default value if 'tab' is null
    setTab(tabFromUrl);
  }, [location.search]);

 

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
    {/* Sidebar: takes full width on small screens, and 10rem on medium screens */}
    <div className="w-full md:w-40 h-auto  bg-slate-50">
      <DashSideBar tab={tab} />
    </div>
  
    {/* Main Content: Takes up remaining space and centers its content */}
    <div className="flex-1 flex  justify-center">
      <DashProfile />
    </div>
  </div>
  
  );
}

export default DashBoard;
