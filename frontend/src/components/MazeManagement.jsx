import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './MazeManagement.css';

export default function MazeManagement({ onCreateNew, onLoadSaved }) {
  const { currentUser } = useAuth();
  const [savedMazes, setSavedMazes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedMazes();
  }, []);

  const loadSavedMazes = () => {
    try {
      const saved = localStorage.getItem(`savedMazes_${currentUser?.email}`);
      if (saved) {
        setSavedMazes(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved mazes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMaze = (mazeData) => {
    // Store the maze data and navigate to Pacman scene
    localStorage.setItem('mazeData', JSON.stringify(mazeData));
    onLoadSaved();
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="maze-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your mazes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="maze-management">
      <div className="maze-management-container">
        <div className="header-section">
          <h1 className="main-title">🎮 Your Mazes</h1>
          <p className="main-subtitle">Create new learning adventures or continue your existing ones</p>
        </div>

        <div className="maze-options">
          <div className="option-card create-new" onClick={onCreateNew}>
            <div className="option-icon">✨</div>
            <h3 className="option-title">Create New Maze</h3>
            <p className="option-description">Start a fresh learning adventure with a new topic</p>
            <div className="option-action">+ New Maze</div>
          </div>

          {savedMazes.length > 0 && (
            <div className="saved-mazes-section">
              <h3 className="saved-mazes-title">📚 Your Saved Mazes</h3>
              <div className="saved-mazes-grid">
                {savedMazes.map((maze, index) => (
                  <div key={index} className="saved-maze-card" onClick={() => handleLoadMaze(maze.data)}>
                    <div className="maze-header">
                      <h4 className="maze-name">{maze.name}</h4>
                      <span className="maze-date">{formatDate(maze.savedAt)}</span>
                    </div>
                    <div className="maze-stats">
                      <div className="stat">
                        <span className="stat-label">Score:</span>
                        <span className="stat-value">{maze.progress?.score || 0}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Questions:</span>
                        <span className="stat-value">{maze.progress?.questionsAnswered || 0}/{maze.data?.topics?.reduce((sum, topic) => sum + (topic?.questions?.length || 0), 0) || 0}</span>
                      </div>
                    </div>
                    <div className="maze-topics">
                      {maze.data?.topics?.slice(0, 3).map((topic, topicIndex) => (
                        <span key={topicIndex} className="topic-tag">
                          {topic.topic}
                        </span>
                      ))}
                      {maze.data?.topics?.length > 3 && (
                        <span className="topic-tag more">+{maze.data.topics.length - 3} more</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {savedMazes.length === 0 && (
            <div className="no-saved-mazes">
              <div className="no-mazes-icon">📝</div>
              <h3>No Saved Mazes Yet</h3>
              <p>Create your first maze to start building your collection of learning adventures!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
