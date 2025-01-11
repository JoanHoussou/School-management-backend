import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import StudentDashboard from '../StudentDashboard';
import { AuthProvider } from '../../../../shared/utils/AuthContext';

// Mock des composants Ant Design
vi.mock('antd', () => ({
  Card: ({ children, title }) => (
    <div data-testid="mock-card">
      {title && <div>{title}</div>}
      {children}
    </div>
  ),
  List: {
    Item: ({ children }) => <div data-testid="mock-list-item">{children}</div>,
  },
  Row: ({ children }) => <div data-testid="mock-row">{children}</div>,
  Col: ({ children }) => <div data-testid="mock-col">{children}</div>,
}));

describe('StudentDashboard', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <StudentDashboard />
        </AuthProvider>
      </BrowserRouter>
    );
  });

  it('renders the dashboard title', () => {
    expect(screen.getByText('Tableau de bord')).toBeInTheDocument();
  });

  it('displays course information', () => {
    expect(screen.getByText('Cours du jour')).toBeInTheDocument();
    expect(screen.getByText('Mathématiques')).toBeInTheDocument();
  });

  it('shows assignments section', () => {
    expect(screen.getByText('Devoirs à rendre')).toBeInTheDocument();
  });

  it('displays recent messages', () => {
    expect(screen.getByText('Messages récents')).toBeInTheDocument();
  });
}); 