import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./components/misc/SideBar";  
import LanguageSelector from "./components/language/LanguageSelector";  

const MainLayout = () => {
    return (
        <div style={{ display: "flex", position: "relative", minHeight: "100vh" }}>
            {/* Sidebar on the left */}
            <SideBar />

            {/* Main Content Area */}
            <div style={{ flex: 1, padding: "20px", position: "relative" }}> 
                {/* Language Selector in the top-right */}
                <div style={{ position: "absolute", top: "10px", right: "20px", zIndex: 1000 }}>
                    <LanguageSelector />
                </div>

                {/* Page Content */}
                <Outlet /> 
            </div>
        </div>
    );
};

export default MainLayout;
