const Game = require('../models/Game'); // Import the Game model

// Create a new game
exports.createGame = async (req, res) => {
    try {
        const { name, difficulty_levels } = req.body;
        const newGame = new Game({ name, difficulty_levels });
        await newGame.save();
        res.status(201).json({ message: 'Game created successfully', game: newGame });
    } catch (error) {
        res.status(500).json({ message: 'Error creating game', error });
    }
};

// Get game by ID
exports.getGameById = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) return res.status(404).json({ message: 'Game not found' });
        res.status(200).json(game);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching game', error });
    }
};

// Handle wave completion
exports.completeWave = async (req, res) => {
    try {
        const { gameId, difficulty, waveNumber, correctAnswers } = req.body;
        const game = await Game.findById(gameId);

        if (!game) return res.status(404).json({ message: 'Game not found' });

        const difficultyLevel = game.difficulty_levels[difficulty];
        if (!difficultyLevel) return res.status(400).json({ message: 'Invalid difficulty level' });

        const wave = difficultyLevel.find(w => w.wave === waveNumber);
        if (!wave) return res.status(400).json({ message: 'Invalid wave number' });

        // Check answers
        let correctCount = 0;
        wave.questions.forEach((q, index) => {
            if (q.correct_answer === correctAnswers[index]) correctCount++;
        });

        if (correctCount === 3) {
            game.progress.waves_cleared[difficulty] += 1;
            let starsEarned = difficulty === 'Easy' ? 1 : difficulty === 'Medium' ? 2 : 3;
            game.progress.total_stars += starsEarned;
            wave.stars_earned = starsEarned;
        } else {
            game.progress.lives -= 1;
        }

        await game.save();
        res.status(200).json({ message: 'Wave completed', game });
    } catch (error) {
        res.status(500).json({ message: 'Error completing wave', error });
    }
};

// Get user progress
exports.getProgress = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) return res.status(404).json({ message: 'Game not found' });
        res.status(200).json({ progress: game.progress });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching progress', error });
    }
};

// Reset game progress
exports.resetGame = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) return res.status(404).json({ message: 'Game not found' });

        game.progress = {
            waves_cleared: { Easy: 0, Medium: 0, Hard: 0 },
            total_stars: 0,
            lives: 3
        };

        await game.save();
        res.status(200).json({ message: 'Game progress reset', game });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting game', error });
    }
};
