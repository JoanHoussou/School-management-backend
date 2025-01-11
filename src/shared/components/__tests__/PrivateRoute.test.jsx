import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';
import { AuthProvider } from '../../utils/AuthContext';

// Mock du hook useAuth
vi.mock('../../utils/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { role: 'student' },
    loading: false,
  }),
}));

const TestComponent = () => <div>Protected Content</div>;

describe('PrivateRoute Component', () => {
  it('renders children when authenticated and authorized', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <PrivateRoute role="student">
            <TestComponent />
          </PrivateRoute>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when not authenticated', () => {
    vi.mock('../../utils/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: false,
        user: null,
        loading: false,
      }),
    }));

    const { container } = render(
      <BrowserRouter>
        <AuthProvider>
          <PrivateRoute role="student">
            <TestComponent />
          </PrivateRoute>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(container.innerHTML).toBe('');
  });
}); 