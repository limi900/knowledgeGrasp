import { useState } from 'react'
import './App.css'
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SignUpPage from "./authenticationPages/SignUpPage.jsx";
import LoginPage from "./authenticationPages/LoginPage.jsx";
import UnidentifiedUserPage from './authenticationPages/UnidentifiedUserPage';
import HomePage from './pages/HomePage';

function AppContent() {
  const { currentUser } = useAuth();

  return (
    <>
      {currentUser ? <HomePage /> : <UnidentifiedUserPage />}
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
