
import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import NotepadApp from './components/NotepadApp';
import { getCurrentUser, clearCurrentUser } from './services/sessionService';
import type { User } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    clearCurrentUser();
    setCurrentUser(null);
  };

  const togglePage = () => {
    setIsLoginPage(!isLoginPage);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-xl text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {currentUser ? (
        <NotepadApp user={currentUser} onLogout={handleLogout} />
      ) : (
        isLoginPage ? (
          <LoginPage onLogin={handleLogin} onTogglePage={togglePage} />
        ) : (
          <SignupPage onSignupSuccess={togglePage} onTogglePage={togglePage} />
        )
      )}
    </div>
  );
};

export default App;
