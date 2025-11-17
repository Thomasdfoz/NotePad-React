
import React, { useState } from 'react';
import { saveUser } from '../services/storageService';

interface SignupPageProps {
  onSignupSuccess: () => void;
  onTogglePage: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignupSuccess, onTogglePage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // In a real app, you'd hash the password before saving.
    // For this simulation, we're storing it as plain text.
    const wasSaved = saveUser(username, password);

    if (wasSaved) {
      setSuccess('Account created successfully! You can now log in.');
      setTimeout(() => {
        onSignupSuccess();
      }, 2000);
    } else {
      setError('Username is already taken.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-800 rounded-xl shadow-lg">
        <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          <h1 className="mt-4 text-3xl font-extrabold text-white">Create a new account</h1>
          <p className="mt-2 text-sm text-slate-400">
            Or{' '}
            <button onClick={onTogglePage} className="font-medium text-sky-400 hover:text-sky-300">
              sign in to your existing account
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
                className="appearance-none rounded-none relative block w-full px-3 py-3 bg-slate-700 border border-slate-600 placeholder-slate-400 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 bg-slate-700 border border-slate-600 placeholder-slate-400 text-white rounded-b-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          {success && <p className="text-sm text-green-400 text-center">{success}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition-colors duration-200"
            >
              Create account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
