import React from 'react';
import { BookOpen, Layers } from 'lucide-react';
import notes from '../../assets/notes.png';
import flashcard from '../../assets/flashcard.png';
import { useNavigate, useParams } from 'react-router-dom';

const NotesFlashcard = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const handleNavigateToFlashcards = () => {
    navigate(`/flashcards/${courseId}`);
  };

  const handleNavigateToNotes = () => {
    navigate(`/notes/${courseId}`);
  };

  return (
    <div className="flex space-x-6 mt-6">
      <div className="w-1/2 bg-blue-50 rounded-2xl shadow-lg p-5">
        <div className="flex items-center mb-4">
          <BookOpen className="text-blue-600 mr-3" size={24} />
          <h2 className="text-xl font-bold text-blue-900">View Notes</h2>
        </div>
        <div className="mb-4 h-40 flex items-center justify-center">
          <img src={notes} alt="Notes" className="max-w-full max-h-full object-contain" />
        </div>
        <p className="text-blue-800 mb-4 text-sm leading-relaxed">
          Transform your learning experience with comprehensive, structured digital notes.
        </p>
        <button 
          onClick={handleNavigateToNotes}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors duration-300 text-base flex items-center justify-center space-x-2"
        >
          <BookOpen size={16} />
          <span>View Notes</span>
        </button>
      </div>

      <div className="w-1/2 bg-green-50 rounded-2xl shadow-lg p-5">
        <div className="flex items-center mb-4">
          <Layers className="text-green-600 mr-3" size={24} />
          <h2 className="text-xl font-bold text-green-900">View Flashcards</h2>
        </div>
        <div className="mb-4 h-40 flex items-center justify-center">
          <img src={flashcard} alt="Flashcards" className="max-w-full max-h-full object-contain" />
        </div>
        <p className="text-green-800 mb-4 text-sm leading-relaxed">
          Boost your memory with interactive, custom-generated flashcards.
        </p>
        <button 
          onClick={handleNavigateToFlashcards}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors duration-300 text-base flex items-center justify-center space-x-2"
        >
          <Layers size={16} />
          <span>View Flashcards</span>
        </button>
      </div>
    </div>
  );
};

export default NotesFlashcard;