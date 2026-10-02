import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlatformsView } from '../components/platforms/PlatformsView.js';
import { mockPlatforms } from './fixtures.js';

describe('PlatformsView Component & Marketplace Adapters', () => {
  it('renders all platform connectors and their declared capabilities', () => {
    const handleConnect = vi.fn();
    const handleDisconnect = vi.fn();

    render(
      <PlatformsView
        platforms={mockPlatforms}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />
    );

    expect(screen.getByText('Connected Work Platforms')).toBeInTheDocument();
    expect(screen.getByText('Upwork')).toBeInTheDocument();
    expect(screen.getByText('Fiverr')).toBeInTheDocument();
    expect(screen.getByText('Freelancer')).toBeInTheDocument();

    // Verify capability declarations
    expect(screen.getAllByText('Opportunity Search').length).toBe(3);
    expect(screen.getAllByText('Deep Parsing & Skills').length).toBe(3);
  });

  it('handles platform disconnection', () => {
    const handleDisconnect = vi.fn();

    render(
      <PlatformsView
        platforms={mockPlatforms}
        onConnect={vi.fn()}
        onDisconnect={handleDisconnect}
      />
    );

    // Disconnect Upwork
    const disconnectBtns = screen.getAllByRole('button', { name: /disconnect/i });
    fireEvent.click(disconnectBtns[0]);
    expect(handleDisconnect).toHaveBeenCalledWith('upwork');
  });

  it('opens connect modal, fills credentials, and triggers connection', () => {
    const handleConnect = vi.fn();

    render(
      <PlatformsView
        platforms={mockPlatforms}
        onConnect={handleConnect}
        onDisconnect={vi.fn()}
      />
    );

    // Connect Freelancer (currently disconnected)
    const connectBtn = screen.getAllByRole('button', { name: /^connect$/i })[0];
    fireEvent.click(connectBtn);

    expect(screen.getByText('Connect Freelancer')).toBeInTheDocument();

    // Enter Client ID and secret
    const clientIdInput = screen.getByPlaceholderText(/Optional \(blank defaults to Simulation Mode\)/i);
    fireEvent.change(clientIdInput, { target: { value: 'test_client_id_123' } });

    const clientSecretInput = screen.getByPlaceholderText(/Optional encrypted secret/i);
    fireEvent.change(clientSecretInput, { target: { value: 'secret_abc' } });

    // Submit
    fireEvent.click(screen.getByText('Save & Connect'));
    expect(handleConnect).toHaveBeenCalledWith('freelancer', {
      client_id: 'test_client_id_123',
      client_secret: 'secret_abc'
    });
  });
});
