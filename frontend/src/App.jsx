import { useState } from 'react'
import './App.css'
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SignUpPage from "./authenticationPages/SignUpPage.jsx";
import LoginPage from "./authenticationPages/LoginPage.jsx";
import UnidentifiedUserPage from './authenticationPages/UnidentifiedUserPage';
import HomePage from './pages/HomePage';
import PacmanScene from './pages/PacmanScene';

function AppContent() {
  const { currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigateToPacman = () => {
    setCurrentPage('pacman');
  };

  const handleNavigateToHome = () => {
    setCurrentPage('home');
  };

  if (!currentUser) {
    return <UnidentifiedUserPage />;
  }

  if (currentPage === 'pacman') {
    return <PacmanScene onNavigateToHome={handleNavigateToHome} />;
  }

  return <HomePage onNavigateToPacman={handleNavigateToPacman} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App
