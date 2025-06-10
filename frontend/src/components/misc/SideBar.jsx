import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useTranslation } from "react-i18next";
import {
    Video,
    LogOut,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    BrainCircuit,
    Briefcase,
    Lightbulb,
    Route,
    ListChecks,
    BarChart2,
    SearchIcon,
    Gamepad2,
    Menu,
    X
} from 'lucide-react';
import image from '../../assets/athena.png';

const SideBar = ({ collapsed, setCollapsed }) => {
    const { t } = useTranslation();
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [hoveredItem, setHoveredItem] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleLogout = () => {
        // Note: In a real app, avoid localStorage in artifacts
        // localStorage.removeItem('token');
        // localStorage.removeItem('user');
        // localStorage.removeItem('userData');
        // localStorage.removeItem('auth');
        // localStorage.removeItem('session');
        setUser(null);
        navigate('/');
        // window.location.reload();
    };

    const menuItems = [
        { name: t("sidebar.items.learning"), icon: Route, path: '/roadmap' },
        { name: t("sidebar.items.courses"), icon: BookOpen, path: '/my-courses' },
        { name: t("sidebar.items.assessments"), icon: ClipboardList, path: '/assessment' },
        ...(user?.role === 'mentor' ? [{ name: t("sidebar.items.attendance"), icon: ListChecks, path: '/offline-attendance' }] : []),
        ...(user?.role === 'mentor' || user?.role === 'mentee'
            ? [{ name: t("sidebar.items.video"), icon: Video, path: user?.role === 'mentor' ? '/mentor' : '/mentee' }]
            : []),
        { name: t("sidebar.items.projects"), icon: Lightbulb, path: '/recommend-projects' },
        { name: t("sidebar.items.coding"), icon: BarChart2, path: '/coding' },
        ...(user?.role === 'mentor' || user?.role === 'mentee'
            ? [{ name: t("sidebar.items.exams"), icon: BarChart2, path: user?.role === 'mentor' ? '/create-exam' : '/mentee-exam' }]
            : []),
        { name: t("sidebar.items.interviews"), icon: BrainCircuit, path: '/interview' },
        { name: t("sidebar.items.internships"), icon: Briefcase, path: '/internships' }
    ];

    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleNavigation = (path) => {
        if (isMobile) {
            setMobileOpen(false);
        }
        navigate(path);
    };

    const renderMobileToggle = () => {
        if (!isMobile) return null;

        return (
            <div className="fixed top-4 left-4 z-50 md:hidden">
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="p-2 rounded-full bg-blue-600 text-white shadow-lg"
                    aria-label={mobileOpen ? t("sidebar.aria.close") : t("sidebar.aria.open")}
                >
                    {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>
        );
    };

    const renderMobileOverlay = () => {
        if (!isMobile || !mobileOpen) return null;

        return (
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setMobileOpen(false)}
            ></div>
        );
    };

    return (
        <>
            {renderMobileToggle()}
            {renderMobileOverlay()}

            <div
                className={`
                    bg-gradient-to-b from-indigo-900 to-blue-800 text-white transition-all duration-300 ease-in-out relative
                    ${isMobile 
                        ? `fixed top-0 left-0 z-50 h-full w-3/4 max-w-72 transform transition-transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`
                        : `${collapsed ? 'w-20' : 'w-72'} h-full`
                    }
                    flex flex-col
                `}
            >
                {/* Collapse/Expand Button - Only show on desktop */}
                {!isMobile && (
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="absolute -right-4 top-20 bg-blue-600 text-white p-2 rounded-full shadow-lg z-10 transform transition-transform hover:scale-110"
                        aria-label={collapsed ? t("sidebar.aria.expand") : t("sidebar.aria.collapse")}
                    >
                        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>
                )}

                {/* Logo Section */}
                <div className="p-6 flex items-center justify-center border-b border-blue-700">
                    <div className="flex items-center">
                        <img
                            src={image}
                            alt="App Logo"
                            className={`w-10 h-10 bg-white rounded-full object-contain ${collapsed && !isMobile ? 'mx-auto' : 'mr-3'}`}
                        />
                        {(!collapsed || isMobile) && (
                            <h2 className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                                {t("sidebar.appName")}
                            </h2>
                        )}
                    </div>
                </div>

                {/* User Profile Section */}
                <div 
                    className="p-4 border-b border-blue-700 cursor-pointer hover:bg-blue-700/60 transition-colors"
                    onClick={() => handleNavigation('/profile')}
                >
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-xl font-bold shadow-md">
                                {user?.name?.charAt(0) || 'G'}
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-indigo-900"></div>
                        </div>
                        {(!collapsed || isMobile) && (
                            <div className="overflow-hidden">
                                <p className="font-medium truncate">{user?.name || 'Guest'}</p>
                                <p className="text-xs text-blue-300 truncate">{user?.email || 'guest@example.com'}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto py-4 px-3">
                    <ul className="space-y-1">
                        {menuItems.map((item) => (
                            <li key={item.name}>
                                <a
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleNavigation(item.path);
                                    }}
                                    href={item.path}
                                    className={`flex items-center p-3 rounded-lg transition-all duration-200 cursor-pointer
                                        ${isActive(item.path)
                                            ? 'bg-blue-600 shadow-lg'
                                            : hoveredItem === item.name
                                                ? 'bg-blue-700 shadow-md transform scale-105'
                                                : 'hover:bg-blue-700/60'}`}
                                    onMouseEnter={() => setHoveredItem(item.name)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                >
                                    <div className={`${(!collapsed || isMobile) && 'mr-4'} ${isActive(item.path) ? 'text-white' : 'text-blue-300'}`}>
                                        <item.icon size={20} />
                                    </div>
                                    {(!collapsed || isMobile) && (
                                        <span className={`flex-1 transition-all ${isActive(item.path) ? 'font-semibold' : ''}`}>
                                            {item.name}
                                        </span>
                                    )}
                                    {(!collapsed || isMobile) && item.badge && (
                                        <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                                            {item.badge}
                                        </span>
                                    )}
                                    {collapsed && !isMobile && item.badge && (
                                        <span className="absolute left-10 top-1/2 transform -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                                            {item.badge}
                                        </span>
                                    )}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-blue-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center p-3 w-full rounded-lg hover:bg-red-600/20 transition-colors group bg-red-600/10"
                    >
                        <div className={`${(!collapsed || isMobile) && 'mr-4'} text-white group-hover:text-red-500 cursor-pointer transition-colors`}>
                            <LogOut size={20} />
                        </div>
                        {(!collapsed || isMobile) && (
                            <span className="text-white group-hover:text-red-500 cursor-pointer transition-colors">
                                {t("sidebar.logout")}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
};

export default SideBar;