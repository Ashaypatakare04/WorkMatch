import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthModal } from '../components/auth/AuthModal.js';
import { api } from '../services/api.js';

vi.mock('../services/api.js', () => ({
  api: {
    login: vi.fn(),
    register: vi.fn(),
    demoLogin: vi.fn(),
    oauthLogin: vi.fn()
  }
}));

describe('AuthModal Component & Authentication Flows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <AuthModal isOpen={false} onClose={vi.fn()} onSuccess={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders sign in form with inputs and social login options when open', () => {
    render(
      <AuthModal isOpen={true} onClose={vi.fn()} onSuccess={vi.fn()} initialMode="login" />
    );

    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@domain.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••••••')).toBeInTheDocument();
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('Continue with 1-Click Demo Profile')).toBeInTheDocument();
  });

  it('handles switching between login and registration mode', () => {
    render(
      <AuthModal isOpen={true} onClose={vi.fn()} onSuccess={vi.fn()} initialMode="login" />
    );

    expect(screen.queryByPlaceholderText('e.g. Alex Mercer')).not.toBeInTheDocument();

    // Switch to Register
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));
    expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Alex Mercer')).toBeInTheDocument();

    // Switch back to Sign In
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
  });

  it('handles successful email login and triggers callbacks', async () => {
    const mockUser = { id: 'usr_1', email: 'test@example.com', full_name: 'Test User' };
    (api.login as any).mockResolvedValue({ success: true, token: 'mock_jwt', user: mockUser });

    const handleSuccess = vi.fn();
    const handleClose = vi.fn();

    const { container } = render(
      <AuthModal isOpen={true} onClose={handleClose} onSuccess={handleSuccess} initialMode="login" />
    );

    fireEvent.change(screen.getByPlaceholderText('you@domain.com'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••••••'), {
      target: { value: 'password123' }
    });

    const submitBtn = container.querySelector('button[type="submit"]')!;
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(handleSuccess).toHaveBeenCalledWith(mockUser);
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it('displays error notice when login fails', async () => {
    (api.login as any).mockRejectedValue(new Error('Invalid email or password'));

    const { container } = render(
      <AuthModal isOpen={true} onClose={vi.fn()} onSuccess={vi.fn()} initialMode="login" />
    );

    fireEvent.change(screen.getByPlaceholderText('you@domain.com'), {
      target: { value: 'bad@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••••••'), {
      target: { value: 'wrongpw' }
    });

    const submitBtn = container.querySelector('button[type="submit"]')!;
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });

  it('handles user registration submission', async () => {
    const mockUser = { id: 'usr_new', email: 'new@example.com', full_name: 'New User' };
    (api.register as any).mockResolvedValue({ success: true, token: 'mock_jwt', user: mockUser });

    const handleSuccess = vi.fn();
    const handleClose = vi.fn();

    render(
      <AuthModal isOpen={true} onClose={handleClose} onSuccess={handleSuccess} initialMode="register" />
    );

    fireEvent.change(screen.getByPlaceholderText('e.g. Alex Mercer'), {
      target: { value: 'New User' }
    });
    fireEvent.change(screen.getByPlaceholderText('you@domain.com'), {
      target: { value: 'new@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••••••'), {
      target: { value: 'securepassword123' }
    });

    fireEvent.submit(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(api.register).toHaveBeenCalledWith('new@example.com', 'securepassword123', 'New User');
      expect(handleSuccess).toHaveBeenCalledWith(mockUser);
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it('handles 1-click demo login', async () => {
    const mockDemoUser = { id: 'usr_demo', email: 'demo@workmatch.ai', full_name: 'Demo Freelancer' };
    (api.demoLogin as any).mockResolvedValue({ success: true, token: 'demo_token', user: mockDemoUser });

    const handleSuccess = vi.fn();
    const handleClose = vi.fn();

    render(
      <AuthModal isOpen={true} onClose={handleClose} onSuccess={handleSuccess} />
    );

    fireEvent.click(screen.getByText('Continue with 1-Click Demo Profile'));

    await waitFor(() => {
      expect(api.demoLogin).toHaveBeenCalled();
      expect(handleSuccess).toHaveBeenCalledWith(mockDemoUser);
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it('handles social authentication (Google & GitHub)', async () => {
    const mockUser = { id: 'usr_social', email: 'social@example.com', full_name: 'Social User' };
    (api.oauthLogin as any).mockResolvedValue({ success: true, token: 'oauth_token', user: mockUser });

    const handleSuccess = vi.fn();
    const handleClose = vi.fn();

    render(
      <AuthModal isOpen={true} onClose={handleClose} onSuccess={handleSuccess} />
    );

    fireEvent.click(screen.getByText('Google'));

    await waitFor(() => {
      expect(api.oauthLogin).toHaveBeenCalledWith('google');
      expect(handleSuccess).toHaveBeenCalledWith(mockUser);
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it('closes on X button click', () => {
    const handleClose = vi.fn();
    render(
      <AuthModal isOpen={true} onClose={handleClose} onSuccess={vi.fn()} />
    );

    fireEvent.click(screen.getByLabelText('Close'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
