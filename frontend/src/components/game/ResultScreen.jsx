import React from 'react';

const ResultScreen = ({ difficulty, wave, starsEarned, totalStars, onContinue }) => {
  const difficultyStyles = {
    Easy: {
      icon: '★',
      color: 'text-yellow-500',
      bg: 'bg-yellow-900/30',
      starColor: 'text-yellow-400'
    },
    Medium: {
      icon: '✪',
      color: 'text-gray-300',
      bg: 'bg-gray-800/30',
      starColor: 'text-gray-300'
    },
    Hard: {
      icon: '✯',
      color: 'text-yellow-300',
      bg: 'bg-yellow-800/30',
      starColor: 'text-yellow-300'
    }
  };

  return (
    <div className={`max-w-md mx-auto p-8 rounded-xl shadow-2xl ${difficultyStyles[difficulty].bg}`}>
      <h1 className="text-3xl font-bold text-center mb-2">Wave Complete!</h1>
      <h2 className={`text-2xl text-center mb-8 ${difficultyStyles[difficulty].color}`}>
        {difficulty} - Wave {wave}
      </h2>
      
      <div className="mb-8 text-center">
        <h3 className="text-xl mb-4">You earned:</h3>
        <div className="flex justify-center gap-4 mb-2">
          {[...Array(3)].map((_, i) => (
            <span 
              key={i} 
              className={`text-4xl ${i < starsEarned ? difficultyStyles[difficulty].starColor : 'text-gray-600'}`}
            >
              {difficultyStyles[difficulty].icon}
            </span>
          ))}
        </div>
        <p className="text-lg">
          {starsEarned} out of 3 {difficultyStyles[difficulty].icon} stars
        </p>
      </div>

      <div className="mb-8 text-center">
        <h3 className="text-xl">Total Stars: <span className="font-bold">{totalStars}</span></h3>
      </div>

      <button 
        onClick={onContinue}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-bold transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        {wave < 3 ? 'Continue to Next Wave' : 'Return to Tower'}
      </button>
    </div>
  );
};

export default ResultScreen;