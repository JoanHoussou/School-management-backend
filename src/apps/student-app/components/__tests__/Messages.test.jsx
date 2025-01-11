import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Messages from '../Messages';
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
  Input: {
    TextArea: ({ placeholder }) => (
      <textarea data-testid="mock-textarea" placeholder={placeholder} />
    ),
  },
  Button: ({ children, onClick }) => (
    <button data-testid="mock-button" onClick={onClick}>
      {children}
    </button>
  ),
}));

describe('Messages Component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Messages />
        </AuthProvider>
      </BrowserRouter>
    );
  });

  it('renders the messages title', () => {
    expect(screen.getByText('Messages')).toBeInTheDocument();
  });

  it('displays message list', () => {
    const listItems = screen.getAllByTestId('mock-list-item');
    expect(listItems.length).toBeGreaterThan(0);
  });

  it('shows new message form', () => {
    const textarea = screen.getByTestId('mock-textarea');
    expect(textarea).toBeInTheDocument();
  });

  it('handles sending new message', () => {
    const sendButton = screen.getByText('Envoyer');
    fireEvent.click(sendButton);
    // Vérifier que le gestionnaire d'envoi est appelé
  });
}); 