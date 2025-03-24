import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ExamCardItem from "../../components/assessment/ExamCardItem";
import QuestionNavigation from "../../components/assessment/QuestionNavigation";
import ResultScreen from "../../components/assessment/ResultScreen";
import axios from "axios";
import { useParams } from "react-router-dom";

const Exam = () => {
  const { t } = useTranslation();
  const { examId } = useParams();
  const [quiz, setQuiz] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/assessment/${examId}`);
        setQuiz(res.data.questions);
      } catch (error) {
        console.error(t("errorFetchingQuestions"), error);
      }
    };
    fetchQuestions();
  }, [examId, t]);

  const handleAnswer = (selectedOption) => {
    setUserAnswers({ ...userAnswers, [currentQuestion]: selectedOption });
  };

  const navigateToQuestion = (questionIndex) => {
    setCurrentQuestion(questionIndex);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let totalScore = 0;
    Object.keys(userAnswers).forEach((questionIndex) => {
      const index = parseInt(questionIndex);
      if (userAnswers[index] === quiz[index].answer) {
        totalScore += 1;
      }
    });
    setScore(totalScore);
    return totalScore * 10;
  };

  const handleSubmit = async () => {
    const finalScore = calculateScore();
    setShowResults(true);
    try {
      await axios.patch(`http://localhost:8000/api/assessment/${examId}`, { score: finalScore });
    } catch (error) {
      console.error(t("errorUpdatingScore"), error);
    }
  };

  const restartQuiz = () => {
    setUserAnswers({});
    setCurrentQuestion(0);
    setShowResults(false);
    setScore(0);
  };

  if (quiz.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <p className="text-indigo-600 font-medium">{t("loadingQuiz")}</p>
      </div>
    );
  }

  if (showResults) {
    return <ResultScreen score={score} totalQuestions={quiz.length} onRestart={restartQuiz} userAnswers={userAnswers} quiz={quiz} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      <h1 className="text-center font-bold text-4xl text-indigo-800 mb-2">{t("challengeQuiz")}</h1>
      <p className="text-center text-indigo-600 mb-10">{t("quizDescription")}</p>

      <ExamCardItem quiz={quiz[currentQuestion]} userSelectedOption={handleAnswer} selectedOption={userAnswers[currentQuestion] || null} />

      <button onClick={handlePrevious} disabled={currentQuestion === 0}>
        {t("previous")}
      </button>
      {currentQuestion === quiz.length - 1 ? (
        <button onClick={handleSubmit}>{t("submitQuiz")}</button>
      ) : (
        <button onClick={handleNext}>{t("next")}</button>
      )}

      <QuestionNavigation totalQuestions={quiz.length} currentQuestion={currentQuestion} answeredQuestions={userAnswers} onQuestionClick={navigateToQuestion} />
    </div>
  );
};

export default Exam;