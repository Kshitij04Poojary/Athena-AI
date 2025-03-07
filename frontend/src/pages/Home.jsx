import React, { useEffect } from 'react';
import { useUser } from '../context/UserContext';
import SideBar from '../components/SideBar';
import { Cpu, BarChart, Clock, Activity } from 'lucide-react';
import axios from 'axios';
const Home = () => {
    const { user } = useUser();
    console.log(user);
    async function load_flask() {
    // console.log(user);

        try {
            const response = await axios.post("http://127.0.0.1:5004/recommendations/load-projects", {"user_id": user._id}, {withCredentials: true});
            console.log(response.data)
        } catch (error) {
            console.log(error)
        }

    }
    useEffect(() => {
        if (user) {
            load_flask()
        }
    }, [user])
    return (
        <div className="flex min-h-max bg-gradient-to-br from-gray-50 to-gray-100 min-w-full">
            <SideBar />
            <main className="flex-1 p-8 transition-all duration-300 min-w-full">
                <div className="max-w-5xl mx-auto">
                    <header className="mb-12">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome, {user?.name || 'Explorer'}!</h1>
                        <p className="text-gray-600">Discover the power of AI with OdesseyAI</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                                <Cpu className="mr-3 text-indigo-500" size={24} />
                                AI Dashboard
                            </h2>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex flex-col">
                                    <span className="text-sm text-indigo-500 mb-1">Active Models</span>
                                    <span className="text-2xl font-bold text-indigo-800">{user?.models || 3}</span>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 flex flex-col">
                                    <span className="text-sm text-purple-500 mb-1">Predictions</span>
                                    <span className="text-2xl font-bold text-purple-800">{user?.predictions || 1204}</span>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col">
                                    <span className="text-sm text-blue-500 mb-1">Accuracy</span>
                                    <span className="text-2xl font-bold text-blue-800">{user?.accuracy || "98.2%"}</span>
                                </div>
                                <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100 flex flex-col">
                                    <span className="text-sm text-cyan-500 mb-1">API Calls</span>
                                    <span className="text-2xl font-bold text-cyan-800">{user?.apiCalls || 347}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                                <BarChart className="mr-3 text-green-500" size={24} />
                                Performance Metrics
                            </h2>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">CPU Usage</span>
                                        <span className="text-sm font-medium text-green-600">42%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Memory</span>
                                        <span className="text-sm font-medium text-blue-600">67%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">GPU</span>
                                        <span className="text-sm font-medium text-purple-600">89%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                                <Clock className="mr-3 text-orange-500" size={24} />
                                Recent Activity
                            </h2>

                            <ul className="space-y-4">
                                <li className="flex items-start border-l-4 border-green-400 pl-4 py-1">
                                    <div>
                                        <p className="text-sm font-medium">Model training completed</p>
                                        <p className="text-xs text-gray-500">Today, 10:32 AM</p>
                                    </div>
                                </li>
                                <li className="flex items-start border-l-4 border-blue-400 pl-4 py-1">
                                    <div>
                                        <p className="text-sm font-medium">Dataset updated</p>
                                        <p className="text-xs text-gray-500">Yesterday, 4:15 PM</p>
                                    </div>
                                </li>
                                <li className="flex items-start border-l-4 border-purple-400 pl-4 py-1">
                                    <div>
                                        <p className="text-sm font-medium">API key generated</p>
                                        <p className="text-xs text-gray-500">Mar 1, 9:43 AM</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow text-white">
                            <h2 className="text-2xl font-semibold mb-6 flex items-center">
                                <Activity className="mr-3" size={24} />
                                Getting Started
                            </h2>

                            <ul className="space-y-4">
                                <li className="flex items-center">
                                    <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center mr-4 shadow-sm">
                                        <span className="text-white text-sm">1</span>
                                    </div>
                                    <span>Create your first AI model</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center mr-4 shadow-sm">
                                        <span className="text-white text-sm">2</span>
                                    </div>
                                    <span>Upload your dataset</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center mr-4 shadow-sm">
                                        <span className="text-white text-sm">3</span>
                                    </div>
                                    <span>Configure training parameters</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center mr-4 shadow-sm">
                                        <span className="text-white text-sm">4</span>
                                    </div>
                                    <span>Deploy your model</span>
                                </li>
                            </ul>

                            <button className="mt-8 bg-white text-indigo-700 py-2 px-4 rounded-lg font-medium hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1">
                                Start Tutorial
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;