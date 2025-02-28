import React from 'react';
import { useUser } from '../context/UserContext';

const Home = () => {
    const { user } = useUser();
    console.log(user);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl">
                <h1 className="text-3xl font-bold">Welcome, {user?.name || 'Guest'}!</h1>
                <p className="mt-4">This is your home page after successful registration or login.</p>
            </div>
        </div>
    );
};

export default Home;
