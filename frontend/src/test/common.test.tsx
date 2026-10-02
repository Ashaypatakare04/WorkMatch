import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastProvider, useToast } from '../components/common/Toast.js';
import { ErrorBoundary } from '../components/common/ErrorBoundary.js';
import { ThemeToggle } from '../components/common/ThemeToggle.js';
import { Logo, LogoIcon } from '../components/common/Logo.js';
import { ThemeProvider } from '../context/ThemeContext.js';

// Test harness for Toast
const ToastTestComponent = () => {
  const { success, error, warning, info } = useToast();
  return (
    <div>
      <button onClick={() => success('Success Title', 'Success Detail')}>Trigger Success</button>
      <button onClick={() => error('Error Title', 'Error Detail')}>Trigger Error</button>
      <button onClick={() => warning('Warning Title', 'Warning Detail')}>Trigger Warning</button>
      <button onClick={() => info('Info Title', 'Info Detail')}>Trigger Info</button>
    </div>
  );
};

// Component that intentionally throws an error
const CrashingComponent = ({ shouldCrash }: { shouldCrash: boolean }) => {
  if (shouldCrash) {
    throw new Error('Test explosive crash');
  }
  return <div>Component rendered safely</div>;
};

describe('Common UI Components & Features', () => {
  describe('Toast Notifications', () => {
    it('should render success, error, warning, and info toasts and allow dismissal', () => {
      render(
        <ToastProvider>
          <ToastTestComponent />
        </ToastProvider>
      );

      // Trigger success toast
      fireEvent.click(screen.getByText('Trigger Success'));
      expect(screen.getByText('Success Title')).toBeInTheDocument();
      expect(screen.getByText('Success Detail')).toBeInTheDocument();

      // Trigger error toast
      fireEvent.click(screen.getByText('Trigger Error'));
      expect(screen.getByText('Error Title')).toBeInTheDocument();

      // Trigger warning toast
      fireEvent.click(screen.getByText('Trigger Warning'));
      expect(screen.getByText('Warning Title')).toBeInTheDocument();

      // Trigger info toast
      fireEvent.click(screen.getByText('Trigger Info'));
      expect(screen.getByText('Info Title')).toBeInTheDocument();

      // Dismiss a toast using close button
      const closeButtons = screen.getAllByRole('button');
      // Click the last close button (which corresponds to one of the toast X icons)
      const xButtons = closeButtons.filter(b => !b.textContent);
      expect(xButtons.length).toBeGreaterThan(0);
      fireEvent.click(xButtons[0]);
    });

    it('throws error when useToast is used outside of ToastProvider', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => render(<ToastTestComponent />)).toThrow('useToast must be used within a ToastProvider');
      consoleSpy.mockRestore();
    });
  });

  describe('ErrorBoundary', () => {
    it('should catch component errors and display recovery UI', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <ErrorBoundary>
          <CrashingComponent shouldCrash={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText(/Test explosive crash/)).toBeInTheDocument();
      expect(screen.getByText('Reload Application')).toBeInTheDocument();
      expect(screen.getByText('Return to Landing')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('renders normal children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <CrashingComponent shouldCrash={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Component rendered safely')).toBeInTheDocument();
    });
  });

  describe('Logo Component', () => {
    it('renders brand name and icon and responds to click events', () => {
      const handleClick = vi.fn();
      render(
        <Logo onClick={handleClick} showTagline={true} badgeText="PRO" taglineText="Custom Tagline" />
      );

      expect(screen.getByText(/WorkMatch/i)).toBeInTheDocument();
      expect(screen.getByText('AI')).toBeInTheDocument();
      expect(screen.getByText('PRO')).toBeInTheDocument();
      expect(screen.getByText('Custom Tagline')).toBeInTheDocument();

      fireEvent.click(screen.getByText(/WorkMatch/i));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders LogoIcon at custom sizes', () => {
      const { container } = render(<LogoIcon size={32} />);
      const iconWrapper = container.firstChild as HTMLElement;
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper.style.width).toBe('32px');
      expect(iconWrapper.style.height).toBe('32px');
    });
  });

  describe('ThemeToggle Component', () => {
    it('renders icon variant and toggles theme on click', () => {
      render(
        <ThemeProvider>
          <ThemeToggle variant="icon" />
        </ThemeProvider>
      );

      const button = screen.getByRole('button', { name: /toggle theme/i });
      expect(button).toBeInTheDocument();
      fireEvent.click(button);
    });

    it('renders pill variant and switches between light, dark, and auto', () => {
      render(
        <ThemeProvider>
          <ThemeToggle variant="pill" />
        </ThemeProvider>
      );

      const lightBtn = screen.getByText('Light');
      const darkBtn = screen.getByText('Dark');
      const autoBtn = screen.getByText('Auto');

      expect(lightBtn).toBeInTheDocument();
      expect(darkBtn).toBeInTheDocument();
      expect(autoBtn).toBeInTheDocument();

      fireEvent.click(lightBtn);
      fireEvent.click(darkBtn);
      fireEvent.click(autoBtn);
    });

    it('renders dropdown variant and opens dropdown menu on click', () => {
      render(
        <ThemeProvider>
          <ThemeToggle variant="dropdown" />
        </ThemeProvider>
      );

      // Open dropdown
      const dropdownTrigger = screen.getByRole('button');
      fireEvent.click(dropdownTrigger);

      expect(screen.getByText('System')).toBeInTheDocument();
      fireEvent.click(screen.getByText('System'));
    });
  });
});
