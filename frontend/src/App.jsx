import { useState } from 'react'
import './App.css'
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SignUpPage from "./authenticationPages/SignUpPage.jsx";
import LoginPage from "./authenticationPages/LoginPage.jsx";
import UnidentifiedUserPage from './authenticationPages/UnidentifiedUserPage';
import HomePage from './pages/HomePage';
import PacmanScene from './pages/PacmanScene';
import MazeManagement from './components/MazeManagement';
import NavBar from './components/NavBar';

function AppContent() {
  const { currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState('mazes'); // Start with maze management

  const handleNavigateToMazes = () => {
    setCurrentPage('mazes');
  };

  const handleNavigateToHome = () => {
    setCurrentPage('home');
  };

  const handleNavigateToPacman = () => {
    setCurrentPage('pacman');
  };

  const handleCreateNew = () => {
    setCurrentPage('home');
  };

  const handleLoadSaved = () => {
    setCurrentPage('pacman');
  };

  if (!currentUser) {
    return <UnidentifiedUserPage />;
  }

  if (currentPage === 'home') {
    return (
      <>
        <NavBar onNavigateToMazes={handleNavigateToMazes} />
        <HomePage onNavigateToPacman={handleNavigateToPacman} />
      </>
    );
  }

  if (currentPage === 'pacman') {
    return (
      <>
        <NavBar onNavigateToMazes={handleNavigateToMazes} />
        <PacmanScene onNavigateToHome={handleNavigateToHome} />
      </>
    );
  }

  return (
    <>
      <NavBar onNavigateToMazes={handleNavigateToMazes} />
      <MazeManagement 
        onCreateNew={handleCreateNew}
        onLoadSaved={handleLoadSaved}
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App
