import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsView } from '../components/settings/SettingsView.js';
import { ThemeProvider } from '../context/ThemeContext.js';

describe('SettingsView Component', () => {
  it('renders theme selector and changes themes', () => {
    render(
      <ThemeProvider>
        <SettingsView />
      </ThemeProvider>
    );

    expect(screen.getByText('Dispatch & Engine Preferences')).toBeInTheDocument();
    expect(screen.getByText('Interface Appearance & Color Scheme')).toBeInTheDocument();

    const lightBtn = screen.getByRole('button', { name: /light mode/i });
    const darkBtn = screen.getByRole('button', { name: /dark mode/i });
    const autoBtn = screen.getByRole('button', { name: /system auto/i });

    expect(lightBtn).toBeInTheDocument();
    expect(darkBtn).toBeInTheDocument();
    expect(autoBtn).toBeInTheDocument();

    fireEvent.click(lightBtn);
    fireEvent.click(darkBtn);
  });

  it('renders notification dispatch channels checkboxes', () => {
    render(
      <ThemeProvider>
        <SettingsView />
      </ThemeProvider>
    );

    expect(screen.getByText('In-Browser & Desktop PWA')).toBeInTheDocument();
    expect(screen.getByText('Email Dispatch Digest')).toBeInTheDocument();
    expect(screen.getByText('Telegram Bot Webhook')).toBeInTheDocument();
    expect(screen.getByText('Discord Webhook')).toBeInTheDocument();

    const emailCheckbox = screen.getByRole('checkbox', { name: /email dispatch digest/i });
    fireEvent.click(emailCheckbox);
    expect(emailCheckbox).toBeChecked();
  });
});
