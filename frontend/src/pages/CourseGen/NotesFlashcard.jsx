import React, { useState } from 'react';
import { BookOpen, Layers, RotateCw } from 'lucide-react';
import notes from '../../assets/notes.png';
import flashcard from '../../assets/flashcard.png';
import { useNavigate, useParams } from 'react-router-dom';

const NotesFlashcard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { courseId } = useParams();
  const handleGenerateFlashcards = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(courseId)
      const response = await fetch(`http://localhost:8000/api/genflashcards/${courseId}`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to generate flashcards');
      navigate(`/flashcards/${courseId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex space-x-6 mt-6">
      <div className="w-1/2 bg-blue-50 rounded-2xl shadow-lg p-5">
        <div className="flex items-center mb-4">
          <BookOpen className="text-blue-600 mr-3" size={24} />
          <h2 className="text-xl font-bold text-blue-900">Generate Notes</h2>
        </div>
        <div className="mb-4 h-40 flex items-center justify-center">
          <img src={notes} alt="Notes" className="max-w-full max-h-full object-contain" />
        </div>
        <p className="text-blue-800 mb-4 text-sm leading-relaxed">
          Transform your learning experience with comprehensive, structured digital notes.
        </p>
        <button className="w-full bg-blue-600 text-white py-2 cursor-pointer rounded-lg hover:bg-blue-700 transition-colors duration-300 text-base flex items-center justify-center space-x-2">
          <BookOpen size={16} />
          <span>Generate Notes</span>
        </button>
      </div>

      <div className="w-1/2 bg-green-50 rounded-2xl shadow-lg p-5">
        <div className="flex items-center mb-4">
          <Layers className="text-green-600 mr-3" size={24} />
          <h2 className="text-xl font-bold text-green-900">Generate Flashcards</h2>
        </div>
        <div className="mb-4 h-40 flex items-center justify-center">
          <img src={flashcard} alt="Flashcards" className="max-w-full max-h-full object-contain" />
        </div>
        <p className="text-green-800 mb-4 text-sm leading-relaxed">
          Boost your memory with interactive, custom-generated flashcards.
        </p>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button 
          onClick={() => handleGenerateFlashcards()}
          disabled={loading}
          className={`w-full ${loading ? 'bg-green-700' : 'bg-green-600'} cursor-pointer text-white py-2 rounded-lg transition-colors duration-300 text-base flex items-center justify-center space-x-2`}
        >
          {loading ? (
            <>
              <RotateCw className="animate-spin" size={16} />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Layers size={16} />
              <span>Generate Flashcards</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default NotesFlashcard;