
import React, { useState } from 'react';
import { getUsers } from '../services/storageService';
import { setCurrentUser } from '../services/sessionService';
import type { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onTogglePage: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onTogglePage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = getUsers();
    // In a real app, passwords would be hashed and compared.
    // For this simulation, we're doing a simple string comparison.
    if (users[username] && users[username] === password) {
      const user: User = { username };
      setCurrentUser(user);
      onLogin(user);
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-800 rounded-xl shadow-lg">
        <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          <h1 className="mt-4 text-3xl font-extrabold text-white">Sign in to your account</h1>
          <p className="mt-2 text-sm text-slate-400">
            Or{' '}
            <button onClick={onTogglePage} className="font-medium text-sky-400 hover:text-sky-300">
              create a new account
            </button>
          </p>
        </div>
        <div className="p-2 my-2 text-xs text-center text-yellow-200 bg-yellow-900/50 rounded-lg">
            <strong>Disclaimer:</strong> This is a demo app. All data is stored in your browser's local storage and is not secure. Do not use real passwords.
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 bg-slate-700 border border-slate-600 placeholder-slate-400 text-white rounded-t-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 bg-slate-700 border border-slate-600 placeholder-slate-400 text-white rounded-b-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition-colors duration-200"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
