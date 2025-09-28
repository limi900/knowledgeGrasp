import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './HomePage.css';

export default function HomePage({ onNavigateToPacman }) {
  const { currentUser, logout } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');

    try {
      console.log('Sending request to backend...');
      const response = await fetch('http://localhost:5001/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_input: prompt
        })
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('Backend response:', data);
      
      // Store the maze data and navigate to Pacman scene
      localStorage.setItem('mazeData', JSON.stringify(data));
      onNavigateToPacman();
      
    } catch (error) {
      console.error('Full error details:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setError('Cannot connect to backend. Make sure the backend server is running on port 5001.');
      } else {
        setError(`Failed to process your request: ${error.message}`);
      }
    } finally {
      setLoading(false);
      setPrompt('');
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="homepage-container">
      <div className="main-content">
        <div className="header-section">
          <h1 className="main-title">🎮KnowledgeGrasp </h1>
          <p className="main-subtitle">Tell us about what you want to study or a brief overview of the topics you want to learn</p>
        </div>

        <form onSubmit={handleSubmit} className="prompt-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="prompt-input-container">
            <div className="input-wrapper">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask anything"
                className="prompt-input"
                disabled={loading}
              />
              <button type="submit" className="send-button" disabled={loading || !prompt.trim()}>
                {loading ? '⏳' : '→'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Logout Button */}
      {/* <button onClick={handleLogout} className="logout-button">
        Logout
      </button> */}
    </div>
  );
}
