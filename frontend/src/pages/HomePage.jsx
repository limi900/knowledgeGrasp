import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <h1>Welcome to Knowledge Grasp!</h1>
      <h2>Hello, {currentUser?.email}!</h2>
      <p>You are successfully logged in.</p>
      <p>This is your home page where you can start learning.</p>
      
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
