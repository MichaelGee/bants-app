import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from './useLocalStorage';
import type { User } from '@/types';
import { STORAGE_KEYS } from '@/types';

export function useAuth() {
  const [user, setUser, removeUser] = useLocalStorage<User | null>(STORAGE_KEYS.USER, null);
  const navigate = useNavigate();

  const login = useCallback(
    (username: string) => {
      const newUser: User = {
        id: crypto.randomUUID(),
        username: username.trim(),
        joinedAt: new Date().toISOString(),
      };
      setUser(newUser);
      return newUser;
    },
    [setUser]
  );

  const logout = useCallback(() => {
    removeUser();
    // Clear all match messages when logging out
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('bants_messages_')) {
        localStorage.removeItem(key);
      }
    });
    navigate('/', { replace: true });
  }, [removeUser, navigate]);

  return {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };
}
