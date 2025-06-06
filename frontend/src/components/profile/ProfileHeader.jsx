import { User } from 'lucide-react';

const ProfileHeader = ({ step }) => {
    return (
        <div className="mb-8 bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
            <div className="md:h-28 h-20 bg-gradient-to-r from-indigo-600 via-purple-500 to-blue-500 relative">
                <div className="absolute inset-0 bg-pattern opacity-20"></div>
            </div>

            <div className="md:px-8 px-4 py-6 flex flex-col md:flex-row md:items-center gap-6 relative">
                {/* Avatar Container */}
                <div className="absolute -top-14 left-8 bg-white p-2 rounded-2xl shadow-xl">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center text-white transition-transform duration-300 hover:scale-105">
                        <User size={36} />
                    </div>
                </div>

                {/* User Info */}
                <div className="md:ml-24 pt-6 md:pt-0">
                    <h1 className="md:text-3xl text-xl font-bold text-gray-800 px-3">Your Profile</h1>
                    <p className="text-gray-500 mt-1 text-sm md:text-md">Complete your profile to connect with mentors</p>
                </div>

                {/* Progress Indicator */}
                <div className="ml-auto hidden md:flex items-center gap-1">
                    {[1, 2, 3].map((stepNumber) => (
                        <div
                            key={stepNumber}
                            className={`md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                                stepNumber === step
                                    ? "bg-indigo-600 w-8"
                                    : stepNumber < step
                                    ? "bg-indigo-400"
                                    : "bg-gray-200"
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Step Labels */}
            <div className="md:px-8 px-4 pb-4 text-sm font-medium">
                <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:justify-between">
                    <span
                        className={`transition-colors duration-300 ${
                            step === 1 ? "text-indigo-600" : "text-gray-400"
                        }`}
                    >
                        Academic Details
                    </span>
                    <span
                        className={`transition-colors duration-300 ${
                            step === 2 ? "text-indigo-600" : "text-gray-400"
                        }`}
                    >
                        Experience
                    </span>
                    <span
                        className={`transition-colors duration-300 ${
                            step === 3 ? "text-indigo-600" : "text-gray-400"
                        }`}
                    >
                        Future Goals
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;