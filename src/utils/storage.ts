import type { Message } from '@/types';
import { STORAGE_KEYS } from '@/types';

export const storageUtils = {
  // Get messages for a specific match
  getMessages: (matchId: string): Message[] => {
    try {
      const key = STORAGE_KEYS.MESSAGES(matchId);
      const stored = localStorage.getItem(key);
      if (!stored) return [];

      const messages = JSON.parse(stored);
      // Convert timestamp strings back to Date objects
      return messages.map((msg: Message) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    } catch (error) {
      console.error('Error loading messages:', error);
      return [];
    }
  },

  // Save messages for a specific match
  saveMessages: (matchId: string, messages: Message[]): void => {
    try {
      const key = STORAGE_KEYS.MESSAGES(matchId);
      // Keep only last 500 messages to prevent storage overflow
      const messagesToStore = messages.slice(-500);
      localStorage.setItem(key, JSON.stringify(messagesToStore));
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  },

  // Add a single message
  addMessage: (matchId: string, message: Message): void => {
    const messages = storageUtils.getMessages(matchId);
    messages.push(message);
    storageUtils.saveMessages(matchId, messages);
  },

  // Check storage availability
  isStorageAvailable: (): boolean => {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  },
};
