import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function UserNamePage() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to matches
  if (isAuthenticated) {
    navigate('/matches', { replace: true });
  }

  const validateUsername = (name: string): boolean => {
    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      setError('Username must be at least 2 characters');
      return false;
    }

    if (trimmedName.length > 20) {
      setError('Username must be less than 20 characters');
      return false;
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(trimmedName)) {
      setError('Username can only contain letters, numbers, and spaces');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateUsername(username)) {
      return;
    }

    try {
      login(username);
      toast.success(`Welcome to Bants, ${username.trim()}! ⚽`);
      navigate('/matches');
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Failed to save your information. Please try again.');
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <h1 className="text-6xl font-bold text-green-600 dark:text-green-400">⚽</h1>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Bants
          </h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Join the conversation. Live the game.
          </p>
        </div>

        {/* Form */}
        <div className="mt-8 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Your Name
              </label>
              <div className="mt-2">
                <Input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="name"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full"
                  aria-invalid={!!error}
                  aria-describedby={error ? 'username-error' : undefined}
                />
              </div>
              {error && (
                <p id="username-error" className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg">
              Join Bants
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Your name will be visible to other users in chat rooms
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl">💬</div>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Live Chat</p>
          </div>
          <div>
            <div className="text-2xl">⚽</div>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Match Updates</p>
          </div>
          <div>
            <div className="text-2xl">🎉</div>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Fan Community</p>
          </div>
        </div>
      </div>
    </div>
  );
}
