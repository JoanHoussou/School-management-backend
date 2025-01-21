import '@testing-library/jest-dom';
import { vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Setup pour gérer localStorage dans les tests
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0,
  [Symbol.iterator]: function* () {
    yield* [];
  }
};

global.localStorage = localStorageMock as Storage;

// Nettoyer après chaque test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});