import { useState } from "react";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.js';
import './SignUpPage.css'


export default function SignUpPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmedPassword) {
      return setError("Passwords do not match");
    }
    
    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    try {
      setError("");
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      // User will be automatically redirected by AuthContext
    } catch (error) {
      setError("Failed to create an account: " + error.message);
    }
    
    setLoading(false);
  };



  return (
    <div className="auth-card">
      <div className="card-header">
        <h2 className="card-title">Create Account</h2>
        <p className="card-subtitle">Join Knowledge Grasp today</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            className="form-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
          />
          {password.length > 0 && (
            <div className={`password-strength ${
              password.length < 6 ? 'weak' : 
              password.length < 8 ? 'medium' : 'strong'
            }`}>
              {password.length < 6 ? 'Password too short' : 
               password.length < 8 ? 'Good password' : 'Strong password'}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input
            className="form-input"
            type="password"
            value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
            placeholder="Confirm your password"
            required
          />
          {confirmedPassword.length > 0 && password !== confirmedPassword && (
            <div className="error-message" style={{marginTop: '0.5rem', marginBottom: 0, fontSize: '0.8rem'}}>
              Passwords do not match
            </div>
          )}
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}