import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { 
  User, 
  Settings, 
  MessageSquare, 
  BarChart2, 
  HelpCircle, 
  LogOut,
  BookOpen, 
  ChevronLeft, 
  ChevronRight,
  ClipboardList,
  BrainCircuit 
} from 'lucide-react';

const SideBar = () => {
    const { user, logout } = useUser();
    const [collapsed, setCollapsed] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);

    const menuItems = [
        { name: 'Profile', icon: User, path: '/profile' },
        { name: 'Courses', icon: BookOpen, path:'/my-courses'},
        { name: 'Assessments', icon: ClipboardList, path: '/assessment' },
        { name: 'Video Conferencing', icon: HelpCircle, path: (user?.role==='mentor'?'/mentor':(user?.role==='mentee'?'/mentee':'/none') )},
        { name: 'Settings', icon: Settings, path: '/settings' },
        { name: 'Messages', icon: MessageSquare, path: '/messages', badge: 3 },
        { name: 'Analytics', icon: BarChart2, path: '/analytics' },
        { name: 'Interviews', icon: BrainCircuit, path: '/interview' },
        { name: 'Help', icon: HelpCircle, path: '/help' },
    ];

    return (
        <div 
            className={`flex max-h-screen bg-gradient-to-b from-indigo-900 to-blue-800 text-white transition-all duration-300 ease-in-out relative ${
                collapsed ? 'w-20' : 'w-72'
            } h-screen flex flex-col`}
        >
            {/* Collapsible button positioned outside sidebar */}
            <button 
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-4 top-20 bg-blue-600 text-white p-2 rounded-full shadow-lg z-10 transform transition-transform hover:scale-110"
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            {/* Logo and App Name */}
            <div className="p-6 flex items-center justify-center border-b border-blue-700">
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-xl font-bold text-white">
                        O
                    </div>
                    {!collapsed && (
                        <h2 className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                            OdysseyAI
                        </h2>
                    )}
                </div>
            </div>

            {/* User Profile Section */}
            <div className="p-4 border-b border-blue-700">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-xl font-bold shadow-md">
                            {user?.name?.charAt(0) || 'G'}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-indigo-900"></div>
                    </div>
                    {!collapsed && (
                        <div className="overflow-hidden">
                            <p className="font-medium truncate">{user?.name || 'Guest'}</p>
                            <p className="text-xs text-blue-300 truncate">{user?.email || 'guest@example.com'}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 h-full">
                <ul className="space-y-1">
                    {menuItems.map((item) => (
                        <li key={item.name}>
                            <a 
                                href={item.path} 
                                className={`flex items-center p-3 rounded-lg transition-all duration-200
                                ${hoveredItem === item.name 
                                    ? 'bg-blue-700 shadow-md transform scale-105' 
                                    : 'hover:bg-blue-700/60'}`}
                                onMouseEnter={() => setHoveredItem(item.name)}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                <div className={`${!collapsed && 'mr-4'} text-blue-300`}>
                                    <item.icon size={20} />
                                </div>
                                {!collapsed && (
                                    <span className="flex-1 transition-all">{item.name}</span>
                                )}
                                {!collapsed && item.badge && (
                                    <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                                        {item.badge}
                                    </span>
                                )}
                                {collapsed && item.badge && (
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
            <div className="p-4 border-t border-blue-700 mb-auto">
                <button 
                    onClick={logout} 
                    className="flex items-center p-3 w-full rounded-lg hover:bg-gray/20 transition-colors group !bg-black"
                >
                    <div className={`${!collapsed && 'mr-4'} !text-white group-hover:text-gray transition-colors`}>
                        <LogOut size={20} />
                    </div>
                    {!collapsed && <span className="group-hover:text-white transition-colors">Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default SideBar;