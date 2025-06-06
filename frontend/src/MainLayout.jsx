import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./components/misc/SideBar";
import LanguageSelector from "./components/language/LanguageSelector";

const MainLayout = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile(); // Initial check
        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile); // Cleanup
    }, []);

    return (
        <div className="flex h-screen bg-gray-100">
            <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />
            <div className="flex flex-col flex-1 overflow-hidden relative">
                <div className="absolute top-4 right-4 z-10">
                    <LanguageSelector />
                </div>

                {/* Main content with outlet */}
                <div className="flex-1 overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default MainLayout;