
import type { Note } from '../types';

const USERS_KEY = 'notepad_users';
const NOTES_KEY_PREFIX = 'notepad_notes_';

// User Management
export const getUsers = (): Record<string, string> => {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
  } catch (error) {
    console.error("Error parsing users from localStorage", error);
    return {};
  }
};

export const saveUser = (username: string, passwordHash: string): boolean => {
  const users = getUsers();
  if (users[username]) {
    return false; // User already exists
  }
  users[username] = passwordHash;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return true;
};

// Note Management
export const getNotesForUser = (username: string): Note[] => {
  try {
    const notes = localStorage.getItem(`${NOTES_KEY_PREFIX}${username}`);
    return notes ? JSON.parse(notes) : [];
  } catch (error) {
    console.error("Error parsing notes from localStorage", error);
    return [];
  }
};

export const saveNotesForUser = (username: string, notes: Note[]) => {
  localStorage.setItem(`${NOTES_KEY_PREFIX}${username}`, JSON.stringify(notes));
};
