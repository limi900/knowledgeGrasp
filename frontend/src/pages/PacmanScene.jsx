import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../src/contexts/AuthContext';
import './PacmanScene.css';
import PacmanGame from './PacmanGame.jsx';

export default function PacmanScene() {
  const { currentUser, logout } = useAuth();
  const [mazeData, setMazeData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quiz state
  const [quizScore, setQuizScore] = useState(0);
  const [topicIndex, setTopicIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(null);
  const [activeTopicTitle, setActiveTopicTitle] = useState('');
  
  // Game progress state
  const [gameScore, setGameScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [totalGameQuestions, setTotalGameQuestions] = useState(0);
  const [remainingPellets, setRemainingPellets] = useState(0);
  
  // Transition state
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [questionCooldown, setQuestionCooldown] = useState(false);

  useEffect(() => {
    // Get maze data from localStorage (set by HomePage after backend response)
    const savedMazeData = localStorage.getItem('mazeData');
    if (savedMazeData) {
      try {
        const parsedData = JSON.parse(savedMazeData);
        setMazeData(parsedData);
        console.log('Loaded maze data:', parsedData);
      } catch (error) {
        console.error('Error parsing maze data:', error);
      }
    }
    
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 20);

    return () => clearTimeout(timer);
  }, []);

  // Compute current question and totals
  const totalQuestions = useMemo(() => {
    if (!mazeData?.topics) return 0;
    return mazeData.topics.reduce((sum, t) => sum + (t?.questions?.length || 0), 0);
  }, [mazeData]);

  const currentQuestion = useMemo(() => {
    if (!mazeData?.topics || mazeData.topics.length === 0) return null;
    const topic = mazeData.topics[topicIndex] ?? mazeData.topics[0];
    if (!topic?.questions || topic.questions.length === 0) return null;
    return topic.questions[questionIndex] ?? topic.questions[0];
  }, [mazeData, topicIndex, questionIndex]);

  const handleOptionClick = (option) => {
    if (!currentQuestion || answered || questionCooldown) return;
    const isCorrect = option === currentQuestion.correct_answer;
    setWasCorrect(isCorrect);
    setAnswered(true);
    if (isCorrect) {
      setQuizScore((s) => s + 1);
    }
    
    // Set cooldown to prevent immediate new questions
    setQuestionCooldown(true);
    setTimeout(() => {
      setQuestionCooldown(false);
    }, 2000); // 2 second cooldown after answering
  };

  const handleQuestionTrigger = ({ topicTitle, topicIndex: tIdx, questionIndex: qIdx, question }) => {
    // Don't change question if in cooldown period
    if (questionCooldown) return;
    
    // Start transition
    setIsTransitioning(true);
    
    // Clear current state
    setAnswered(false);
    setWasCorrect(null);
    
    // After a brief delay, update the question
    setTimeout(() => {
      setActiveTopicTitle(topicTitle || '');
      setTopicIndex(tIdx || 0);
      setQuestionIndex(qIdx || 0);
      setIsTransitioning(false);
    }, 150);
  };

  const handleScoreUpdate = ({ questionsAnswered, totalQuestions, remainingPellets }) => {
    setQuestionsAnswered(questionsAnswered);
    setTotalGameQuestions(totalQuestions);
    setRemainingPellets(remainingPellets);
  };

  const handleSaveMaze = () => {
    if (!mazeData) return;
    
    const mazeName = prompt('Enter a name for your maze:', `Maze ${new Date().toLocaleDateString()}`);
    if (!mazeName) return;
    
    try {
      const savedMazes = JSON.parse(localStorage.getItem(`savedMazes_${currentUser?.email}`) || '[]');
      
      const mazeToSave = {
        name: mazeName,
        data: mazeData,
        progress: {
          score: quizScore,
          questionsAnswered: questionsAnswered,
          totalQuestions: totalGameQuestions,
          remainingPellets: remainingPellets
        },
        savedAt: Date.now()
      };
      
      savedMazes.push(mazeToSave);
      localStorage.setItem(`savedMazes_${currentUser?.email}`, JSON.stringify(savedMazes));
      
      alert('Maze saved successfully!');
    } catch (error) {
      console.error('Error saving maze:', error);
      alert('Failed to save maze. Please try again.');
    }
  };

  if (loading) {
    return (

      <div>
          <div className="pacman-scene-container">
          <div className="loading-screen">
            <div className="loading-content">
              <h1 className="loading-title">🎮 Generating Your Maze...</h1>
              <p className="loading-subtitle">Preparing your learning adventure</p>
              <div className="loading-spinner"></div>
            </div>
          </div>
        </div>
      </div>

      
    );
  }

  return (
    <div className="pacman-scene-container">
      <div className="game-layout">
        {/* Fixed Header Section */}
        <div className="game-header-section">
          <div className="game-header">
            <h1 className="game-title">🎮 Knowledge Quest Maze</h1>
            <div className="game-stats">
              <div className="stat">
                <span className="stat-label">Score:</span>
                <span className="stat-value">{quizScore}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Questions:</span>
                <span className="stat-value">{totalGameQuestions > 0 ? `${questionsAnswered}/${totalGameQuestions}` : '0/0'}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Pellets:</span>
                <span className="stat-value">{remainingPellets}</span>
              </div>
              <button className="save-button" onClick={handleSaveMaze}>
                💾 Save Maze
              </button>
            </div>
          </div>
        </div>

        {/* Fixed Question Section */}
        <div className="question-section">
          <div className={`question-container ${isTransitioning ? 'transitioning' : ''}`}>

            <div className="question-topic">
              {activeTopicTitle ? `${activeTopicTitle}` : 'Waiting for question...'}
            </div>
            <div className="question-text">
              {currentQuestion?.question || 'Collect a pellet to get a question!'}
            </div>
            
            <div className="answer-options">
              {currentQuestion?.options?.map((opt, idx) => (
                <button
                  key={idx}
                  className={`answer-option ${answered && opt === currentQuestion.correct_answer ? 'correct' : ''} ${answered || questionCooldown ? 'disabled' : ''}`}
                  onClick={() => handleOptionClick(opt)}
                  disabled={answered || isTransitioning || questionCooldown}
                >
                  {opt}
                </button>
              ))}
            </div>
            
            {answered && (
              <div className={`answer-feedback ${wasCorrect ? 'correct' : 'incorrect'}`}>
                {wasCorrect ? '✅ Correct!' : `❌ Incorrect. Answer: ${currentQuestion?.correct_answer}`}
              </div>
            )}
            
            {questionCooldown && !answered && (
              <div className="cooldown-message">
                🎯 Collect another pellet to get a new question!
              </div>
            )}

          </div>
        </div>

        {/* Fixed Game Section */}
        <div className="game-section">
          <div className="maze-container">
            <div className="maze-placeholder">
              <PacmanGame 
                data={mazeData} 
                onQuestionTrigger={handleQuestionTrigger}
                onScoreUpdate={handleScoreUpdate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
