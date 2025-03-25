import React, { useState, useMemo, useRef } from 'react';
import GameCard from '../../components/game/GameCard';
import GameQuestions from '../../components/game/GameQuestions';
import ResultScreen from '../../components/game/ResultScreen';
import gameData from '../../data/gameData';
import skillList from '../../data/skillList';

const GamePage = () => {
    const [currentView, setCurrentView] = useState('gameSelection');
    const [currentDifficulty, setCurrentDifficulty] = useState(null);
    const [currentWave, setCurrentWave] = useState(0);
    const [gameProgress, setGameProgress] = useState({
        waves_cleared: { Easy: 0, Medium: 0, Hard: 0 },
        total_stars: 0,
        lives: 3
    });
    const [selectedSkill, setSelectedSkill] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [generatedGame, setGeneratedGame] = useState(null);
    const dropdownRef = useRef(null);

    // Filter skills based on search term
    const filteredSkills = useMemo(() => {
        return skillList.filter(skill =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const handleGenerateGame = () => {
        if (selectedSkill === 'React Native') {
            setGeneratedGame(gameData);
        } else {
            alert(`Game generation for ${selectedSkill} would call your API in a real implementation`);
        }
    };

    const startWave = (difficulty, wave) => {
        setCurrentDifficulty(difficulty);
        setCurrentWave(wave);
        setCurrentView('playing');
    };

    const completeWave = (starsEarned) => {
        const newProgress = { ...gameProgress };
        
        if (currentWave > newProgress.waves_cleared[currentDifficulty]) {
            newProgress.waves_cleared[currentDifficulty] = currentWave;
        }
        
        newProgress.total_stars += starsEarned;
        setGameProgress(newProgress);
        setCurrentView('results');
    };

    const returnToSelection = () => {
        setCurrentView('gameSelection');
    };

    const handleSkillSelect = (skill) => {
        setSelectedSkill(skill);
        setSearchTerm(skill);
        setShowDropdown(false);
    };

    return (
        <div className="relative min-h-screen">
            {/* Background Image - Only covers the game content area */}
            <div 
                className="fixed top-0 left-0 right-0 bottom-0 bg-cover bg-center z-0 opacity-50 pointer-events-none"
                style={{ 
                    backgroundImage: 'url("https://i.pinimg.com/736x/5b/53/69/5b5369acf7d3601d81faa35ad42d76c3.jpg")',
                    filter: 'brightness(0.6) contrast(1.2)'
                }}
            ></div>

            {currentView === 'gameSelection' && (
                <div className="relative z-10 max-w-4xl mx-auto bg-gray-900 bg-opacity-70 p-8 rounded-xl shadow-2xl mt-12">
                    <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                        Tower of Knowledge
                    </h1>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 relative">
                        <div className="relative w-full sm:w-auto text-white" ref={dropdownRef}>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setShowDropdown(true);
                                    if (!e.target.value) {
                                        setSelectedSkill('');
                                    }
                                }}
                                onFocus={() => setShowDropdown(true)}
                                onBlur={() => {
                                    setTimeout(() => {
                                        if (!dropdownRef.current?.contains(document.activeElement)) {
                                            setShowDropdown(false);
                                        }
                                    }, 200);
                                }}
                                placeholder="Select Skill"
                                className="px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full"
                            />
                            {showDropdown && (
                                <div className="absolute z-20 mt-1 w-full bg-gray-800 rounded-md shadow-lg max-h-60 overflow-auto border border-gray-600">
                                    {filteredSkills.length > 0 ? (
                                        filteredSkills.map((skill) => (
                                            <div
                                                key={skill}
                                                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => handleSkillSelect(skill)}
                                            >
                                                {skill}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-gray-400">No skills found</div>
                                    )}
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={handleGenerateGame}
                            disabled={!selectedSkill}
                            className={`px-6 py-2 rounded transition-colors focus:outline-none focus:ring-2 w-full sm:w-auto ${
                                selectedSkill 
                                    ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                                    : 'bg-gray-600 cursor-not-allowed'
                            }`}
                        >
                            Generate Game
                        </button>
                    </div>

                    {generatedGame && (
                        <div className="space-y-6">
                            {['Easy', 'Medium', 'Hard'].map((difficulty) => (
                                <GameCard
                                    key={difficulty}
                                    difficulty={difficulty}
                                    progress={gameProgress.waves_cleared[difficulty]}
                                    maxWaves={3}
                                    onSelect={(wave) => startWave(difficulty, wave)}
                                    isLocked={
                                        (difficulty === 'Medium' && gameProgress.waves_cleared.Easy < 3) ||
                                        (difficulty === 'Hard' && gameProgress.waves_cleared.Medium < 3)
                                    }
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {currentView === 'playing' && generatedGame && (
                <div className="relative z-10">
                    <GameQuestions
                        questions={generatedGame['React Native Tower'][currentDifficulty][currentWave - 1].questions}
                        onComplete={completeWave}
                        onBack={returnToSelection}
                    />
                </div>
            )}

            {currentView === 'results' && (
                <div className="relative z-10">
                    <ResultScreen
                        difficulty={currentDifficulty}
                        wave={currentWave}
                        starsEarned={3}
                        totalStars={gameProgress.total_stars}
                        onContinue={() => {
                            if (currentWave < 3) {
                                startWave(currentDifficulty, currentWave + 1);
                            } else {
                                returnToSelection();
                            }
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default GamePage;