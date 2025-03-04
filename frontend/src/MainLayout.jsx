import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./components/SideBar";  // Adjust the path based on your folder structure

const MainLayout = () => {
    return (
        <div style={{ display: "flex" }}>
            <SideBar />
            <div style={{ flex: 1, padding: "20px" }}> 
                <Outlet /> 
            </div>
        </div>
    );
};

export default MainLayout;
