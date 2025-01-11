import { describe, it, expect, vi, beforeEach } from 'vitest';
import authService from '../authService';

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('successfully logs in with valid credentials', async () => {
      const credentials = {
        username: 'student-1',
        password: 'password'
      };

      const result = await authService.login(credentials);

      expect(result.user).toBeDefined();
      expect(result.user.role).toBe('student');
      expect(result.token).toBeDefined();
    });

    it('throws error with invalid credentials', async () => {
      const credentials = {
        username: 'invalid',
        password: 'wrong'
      };

      await expect(authService.login(credentials)).rejects.toThrow();
    });
  });

  describe('getCurrentUser', () => {
    it('returns null when no user is stored', () => {
      const user = authService.getCurrentUser();
      expect(user).toBeNull();
    });

    it('returns user data when stored in localStorage', () => {
      const mockUser = { id: 1, username: 'test', role: 'student' };
      localStorage.setItem('user', JSON.stringify(mockUser));

      const user = authService.getCurrentUser();
      expect(user).toEqual(mockUser);
    });
  });
}); 