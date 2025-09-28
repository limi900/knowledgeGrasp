import { useState } from 'react';
import SignUpPage from './SignUpPage';
import LoginPage from './LoginPage';

import './UnidentifiedUserPage.css'


export default function UnidentifiedUserPage() {

  // used to set the type of form that we want
  const [typeOfAuth, setTypeOfAuth] = useState(null);



  return (
    <div className="hero-container">
        <div className="hero-content">
            <div className="game-logo">🎮 KNOWLEDGE QUEST</div>
            
            <h1 className="hero-title">Eat Questions, Not Just Food!</h1>
            
            <h2 className="hero-subtitle">The Ultimate Learning Adventure</h2>
            
            <p className="game-description">
                Navigate through mazes, collect knowledge pellets, and answer questions to level up your skills!
            </p>
            
            <p className="game-description">
                Just like Pac-Man, but instead of avoiding ghosts, you're avoiding wrong answers!
            </p>

        </div>

        <div className="cta-section">
            <h2 className="hero-subtitle">Ready to Play?</h2>
            
            <div className="cta-buttons">
                <button 
                    className="cta-button primary" 
                    onClick={() => setTypeOfAuth("signup")}
                >
                    Sign Up
                </button>
                <button 
                    className="cta-button secondary" 
                    onClick={() => setTypeOfAuth("login")}
                >
                    Login
                </button>
            </div>
        </div>

        <div className="auth-form-container">
            {typeOfAuth === "signup" && <SignUpPage />}
            {typeOfAuth === "login" && <LoginPage />}
        </div>
    </div>



    
  );
}