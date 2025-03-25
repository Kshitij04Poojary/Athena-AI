const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    skill: { type: String },
    difficulty_levels: {
        Easy: [{
            wave: { type: Number, required: true },
            questions: [{
                question: { type: String, required: true },
                options: { type: [String], required: true },
                correct_answer: { type: String, required: true }
            }],
            stars_earned: { type: Number, default: 0 } // Bronze stars
        }],
        Medium: [{
            wave: { type: Number, required: true },
            questions: [{
                question: { type: String, required: true },
                options: { type: [String], required: true },
                correct_answer: { type: String, required: true }
            }],
            stars_earned: { type: Number, default: 0 } // Silver stars
        }],
        Hard: [{
            wave: { type: Number, required: true },
            questions: [{
                question: { type: String, required: true },
                options: { type: [String], required: true },
                correct_answer: { type: String, required: true }
            }],
            stars_earned: { type: Number, default: 0 } // Gold stars
        }]
    },
    progress: {
        waves_cleared: {
            Easy: { type: Number, default: 0 },
            Medium: { type: Number, default: 0 },
            Hard: { type: Number, default: 0 }
        },
        total_stars: { type: Number, default: 0 }, 
        lives: { type: Number, default: 3 } 
    }
}, { timestamps: true });

const Game = mongoose.model('Game', GameSchema);
module.exports = Game;
