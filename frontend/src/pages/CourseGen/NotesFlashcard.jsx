import React from 'react';
import { BookOpen, Layers, FileSearch } from 'lucide-react';
import notes from '../../assets/notes.png';
import flashcard from '../../assets/flashcard.png';
import pdf from '../../assets/pdf.png';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotesFlashcard = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { t } = useTranslation();

  const handleNavigateToFlashcards = () => {
    navigate(`/flashcards/${courseId}`);
  };

  const handleNavigateToNotes = () => {
    navigate(`/notes/${courseId}`);
  };

  const handleNavigateToQueryPDF = () => {
    navigate(`/chat-with-pdf/${courseId}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 mt-6 justify-center px-4 max-w-6xl mx-auto">
      {/* Notes Card */}
      <div className="flex-1 min-w-0 bg-blue-50 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col">
        <div className="flex items-center mb-4">
          <BookOpen className="text-blue-600 mr-3 flex-shrink-0" size={24} />
          <h2 className="text-xl font-bold text-blue-900 truncate">{t('notes.title')}</h2>
        </div>
        <div className="mb-4 h-40 flex items-center justify-center bg-white rounded-lg overflow-hidden">
          <img src={notes} alt={t('notes.title')} className="max-w-full max-h-full object-contain p-2" />
        </div>
        <p className="text-blue-800 mb-5 text-sm leading-relaxed flex-grow">{t('notes.description')}</p>
        <button
          onClick={handleNavigateToNotes}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition-colors duration-300 text-base flex items-center justify-center space-x-2"
        >
          <BookOpen size={16} />
          <span>{t('notes.button')}</span>
        </button>
      </div>

      {/* Flashcards Card */}
      <div className="flex-1 min-w-0 bg-green-50 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col">
        <div className="flex items-center mb-4">
          <Layers className="text-green-600 mr-3 flex-shrink-0" size={24} />
          <h2 className="text-xl font-bold text-green-900 truncate">{t('flashcards.title')}</h2>
        </div>
        <div className="mb-4 h-40 flex items-center justify-center bg-white rounded-lg overflow-hidden">
          <img src={flashcard} alt={t('flashcards.title')} className="max-w-full max-h-full object-contain p-2" />
        </div>
        <p className="text-green-800 mb-5 text-sm leading-relaxed flex-grow">{t('flashcards.description')}</p>
        <button
          onClick={handleNavigateToFlashcards}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg transition-colors duration-300 text-base flex items-center justify-center space-x-2"
        >
          <Layers size={16} />
          <span>{t('flashcards.button')}</span>
        </button>
      </div>

      {/* Query PDF Card */}
      <div className="flex-1 min-w-0 bg-purple-50 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col">
        <div className="flex items-center mb-4">
          <FileSearch className="text-purple-600 mr-3 flex-shrink-0" size={24} />
          <h2 className="text-xl font-bold text-purple-900 truncate">{t('querypdf.title')}</h2>
        </div>
        <div className="mb-4 h-40 flex items-center justify-center bg-white rounded-lg overflow-hidden">
          <img src={pdf} alt={t('querypdf.title')} className="max-w-full max-h-full object-contain p-2" />
        </div>
        <p className="text-purple-800 mb-5 text-sm leading-relaxed flex-grow">{t('querypdf.description')}</p>
        <button
          onClick={handleNavigateToQueryPDF}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg transition-colors duration-300 text-base flex items-center justify-center space-x-2"
        >
          <FileSearch size={16} />
          <span>{t('querypdf.button')}</span>
        </button>
      </div>
    </div>
  );
};

export default NotesFlashcard;