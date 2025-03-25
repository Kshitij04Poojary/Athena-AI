import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw
} from 'lucide-react';

// Importing the flashcard content and individual flashcard component
import { flashCardContent } from './Content';
import FlashCardItem from './FlashCardItem';

const Flashcards = () => {
  const [flashCards, setFlashCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Load flashcards on component mount
  useEffect(() => {
    setFlashCards(flashCardContent);
  }, []);

  // Handle flipping the card
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Navigate to previous card
  const handlePrevious = () => {
    setCurrentCardIndex((prev) => 
      prev === 0 ? flashCards.length - 1 : prev - 1
    );
    setIsFlipped(false);
  };

  // Navigate to next card
  const handleNext = () => {
    setCurrentCardIndex((prev) => 
      prev === flashCards.length - 1 ? 0 : prev + 1
    );
    setIsFlipped(false);
  };

  // Reset to first card
  const handleReset = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  // If no flashcards are loaded
  if (flashCards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.p 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-gray-500 text-lg"
        >
          Loading flashcards...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-gradient-to-br from-[#F5F7FA] to-[#E6E9F0] min-h-screen flex flex-col justify-center">
      <div className="text-center mb-12">
        <motion.h2 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold bg-gradient-to-r from-[#8A4FFF] to-[#4E93FF] text-transparent bg-clip-text mb-4"
        >
          Smart Flashcards
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600 text-lg"
        >
          Learn Smarter, Not Harder
        </motion.p>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          <FlashCardItem 
            key={currentCardIndex}
            flashcard={flashCards[currentCardIndex]}
            isFlipped={isFlipped}
            onFlip={handleFlip}
          />
        </AnimatePresence>

        <div className="flex justify-center items-center space-x-6 mt-12">
          <motion.button 
            onClick={handlePrevious}
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white/20 backdrop-blur-md p-4 rounded-full hover:bg-white/40 transition-all shadow-lg"
          >
            <ChevronLeft className="text-[#8A4FFF] w-6 h-6" />
          </motion.button>

          <motion.button 
            onClick={handleReset}
            whileHover={{ rotate: 180 }}
            className="bg-gradient-to-r from-[#8A4FFF] to-[#4E93FF] p-4 rounded-full hover:from-[#7A3EEE] hover:to-[#3E82EE] transition-all shadow-xl"
          >
            <RefreshCw className="text-white w-6 h-6" />
          </motion.button>

          <motion.button 
            onClick={handleNext}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white/20 backdrop-blur-md p-4 rounded-full hover:bg-white/40 transition-all shadow-lg"
          >
            <ChevronRight className="text-[#8A4FFF] w-6 h-6" />
          </motion.button>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-6 text-sm text-gray-500 tracking-wider"
        >
          Card {currentCardIndex + 1} of {flashCards.length}
        </motion.div>
      </div>
    </div>
  );
};

export default Flashcards;