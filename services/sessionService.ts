
import type { User } from '../types';

const SESSION_USER_KEY = 'notepad_current_user';

export const setCurrentUser = (user: User) => {
  sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
};

export const getCurrentUser = (): User | null => {
  try {
    const userJson = sessionStorage.getItem(SESSION_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error("Error parsing user from sessionStorage", error);
    return null;
  }
};

export const clearCurrentUser = () => {
  sessionStorage.removeItem(SESSION_USER_KEY);
};
