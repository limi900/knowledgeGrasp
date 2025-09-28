import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../src/contexts/AuthContext';
import NavBar from '../../src/components/NavBar';
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
    if (!currentQuestion || answered) return;
    const isCorrect = option === currentQuestion.correct_answer;
    setWasCorrect(isCorrect);
    setAnswered(true);
    if (isCorrect) {
      setQuizScore((s) => s + 1);
    }
  };

  const handleQuestionTrigger = ({ topicTitle, topicIndex: tIdx, questionIndex: qIdx, question }) => {
    setActiveTopicTitle(topicTitle || '');
    setTopicIndex(tIdx || 0);
    setQuestionIndex(qIdx || 0);
    setAnswered(false);
    setWasCorrect(null);
  };

  if (loading) {
    return (

      <div>
          <div className="pacman-scene-container">
          <NavBar />
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
      <NavBar />
      
      <div className="game-area">
        <div className="game-header">
          <h1 className="game-title">🎮 Knowledge Quest Maze</h1>
          <div className="game-stats">
            <div className="stat">
              <span className="stat-label">Score:</span>
              <span className="stat-value">{quizScore}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Questions:</span>
              <span className="stat-value">{totalQuestions > 0 ? `1/${totalQuestions}` : '0/0'}</span>
            </div>
          </div>
        </div>

        <div className="current-question">
          {activeTopicTitle ? `${activeTopicTitle}` : ''}
        </div>
        <div className="current-question" style={{ fontSize: '1.25rem' }}>
          {currentQuestion?.question || 'No question available'}
        </div>

        <div>
          {currentQuestion?.options?.map((opt, idx) => (
            <button
              key={idx}
              className="possible-answer"
              onClick={() => handleOptionClick(opt)}
              disabled={answered}
              style={{
                display: 'block',
                margin: '0.5rem 0',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.2)',
                background:
                  answered && opt === currentQuestion.correct_answer
                    ? 'rgba(46, 204, 113, 0.2)'
                    : 'rgba(255,255,255,0.08)',
                color: '#ecf0f1',
                cursor: answered ? 'default' : 'pointer',
                textAlign: 'left',
                width: '100%'
              }}
            >
              {opt}
            </button>
          ))}
          {answered && (
            <div style={{ color: wasCorrect ? '#2ecc71' : '#e74c3c', marginTop: '0.5rem' }}>
              {wasCorrect ? 'Correct!' : `Incorrect. Answer: ${currentQuestion?.correct_answer}`}
            </div>
          )}
        </div>


        {/* <div className="maze-container">
          <div className="maze-placeholder">
            <div className="pacman-character">👤</div>
            <div className="question-pellet">❓</div>
            <div className="question-pellet">❓</div>
            <div className="question-pellet">❓</div>
            <div className="question-pellet">❓</div>
            <p className="maze-text">Maze will be rendered here</p>
            <p className="maze-subtext">Collect question pellets to learn!</p>
          </div>
        </div> */}

        <div className="maze-container">
          <div className="maze-placeholder">
            <PacmanGame data={mazeData} onQuestionTrigger={handleQuestionTrigger} />
          </div>
        </div>



      </div>
    </div>
  );
}
