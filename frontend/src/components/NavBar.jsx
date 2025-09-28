import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './NavBar.css';

export default function NavBar({ onNavigateToMazes }) {
  const { currentUser, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (!e.target.closest('.profile-dropdown-container')) {
      setShowDropdown(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <div className="maze-selector" onClick={onNavigateToMazes}>
            <span>Your mazes</span>
          </div>
        </div>
        
        <div className="navbar-center">
          <h1 className="navbar-title">Knowledge Grasp</h1>
        </div>
        
        <div className="navbar-right">
          <div className="profile-dropdown-container" onClick={handleClickOutside}>
            <div className="profile-icon" onClick={toggleDropdown}>
              {currentUser?.email ? (
                <span className="profile-initials">
                  {currentUser.email.charAt(0).toUpperCase()}
                </span>
              ) : (
                <span>•</span>
              )}
            </div>
            
            {showDropdown && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <div className="user-info">
                    <div className="user-email">{currentUser?.email}</div>
                  </div>
                </div>
                
                <div className="dropdown-divider"></div>
                
                <div className="dropdown-menu">
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}