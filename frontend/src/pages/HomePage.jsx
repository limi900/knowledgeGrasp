import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './HomePage.css';
import NavBar from '../components/NavBar';

export default function HomePage() {
  const { currentUser, logout } = useAuth();
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // right now I just clear the prompt but then ill send it to the backend later
    console.log('Prompt submitted:', prompt);
    setPrompt('');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="homepage-container">
      <NavBar/>
      <div className="main-content">
        <div className="header-section">
          <h1 className="main-title">🎮KnowledgeGrasp </h1>
          <p className="main-subtitle">Tell us about what you want to study or a brief overview of the topics you want to learn</p>
        </div>

        <form onSubmit={handleSubmit} className="prompt-form">
          <div className="prompt-input-container">
            <div className="input-wrapper">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask anything"
                className="prompt-input"
              />
              <button type="submit" className="send-button">
                →
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
