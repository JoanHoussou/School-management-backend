import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Schedule from '../Schedule';
import { AuthProvider } from '../../../../shared/utils/AuthContext';

// Mock des composants Ant Design
vi.mock('antd', () => ({
  Calendar: ({ dateCellRender }) => (
    <div data-testid="mock-calendar">
      {dateCellRender && dateCellRender(new Date('2024-03-20'))}
    </div>
  ),
  Badge: ({ text }) => <div data-testid="mock-badge">{text}</div>,
  Card: ({ children, title }) => (
    <div data-testid="mock-card">
      {title && <div>{title}</div>}
      {children}
    </div>
  ),
}));

describe('Schedule Component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Schedule />
        </AuthProvider>
      </BrowserRouter>
    );
  });

  it('renders the schedule title', () => {
    expect(screen.getByText('Emploi du temps')).toBeInTheDocument();
  });

  it('displays schedule entries', () => {
    const calendar = screen.getByTestId('mock-calendar');
    expect(calendar).toBeInTheDocument();
  });

  it('shows course information in calendar', () => {
    const badges = screen.getAllByTestId('mock-badge');
    expect(badges.length).toBeGreaterThan(0);
  });
}); 