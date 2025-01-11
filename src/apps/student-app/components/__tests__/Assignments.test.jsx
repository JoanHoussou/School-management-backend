import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Assignments from '../Assignments';
import { AuthProvider } from '../../../../shared/utils/AuthContext';

// Mock des composants Ant Design
vi.mock('antd', () => ({
  Table: ({ dataSource }) => (
    <div data-testid="mock-table">
      {dataSource.map((item, index) => (
        <div key={index} data-testid="mock-table-row">
          {item.title}
        </div>
      ))}
    </div>
  ),
  Tag: ({ children }) => <span data-testid="mock-tag">{children}</span>,
  Space: ({ children }) => <div data-testid="mock-space">{children}</div>,
  Button: ({ children }) => <button>{children}</button>,
}));

describe('Assignments Component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Assignments />
        </AuthProvider>
      </BrowserRouter>
    );
  });

  it('renders the assignments title', () => {
    expect(screen.getByText('Devoirs')).toBeInTheDocument();
  });

  it('displays assignments table', () => {
    const table = screen.getByTestId('mock-table');
    expect(table).toBeInTheDocument();
  });

  it('shows assignment status tags', () => {
    const tags = screen.getAllByTestId('mock-tag');
    expect(tags.length).toBeGreaterThan(0);
  });

  it('displays assignment actions', () => {
    const actions = screen.getAllByTestId('mock-space');
    expect(actions.length).toBeGreaterThan(0);
  });
}); 