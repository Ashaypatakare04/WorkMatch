import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React render error in WorkMatch AI:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.hash = 'dashboard';
    window.location.reload();
  };

  private handleGoLanding = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.hash = 'landing';
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#07090e] text-slate-100 flex items-center justify-center p-4">
          <div className="glass-card border border-rose-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 mx-auto mb-4 flex items-center justify-center">
              <AlertOctagon className="w-7 h-7 text-rose-400" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold font-display text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
              WorkMatch AI encountered an unexpected rendering error. Your data and settings are preserved in the system.
            </p>

            {this.state.error && (
              <div className="bg-surface-950 border border-white/[0.08] rounded-xl p-3 text-left mb-6 overflow-hidden">
                <p className="text-[11px] font-mono text-rose-300 break-words font-semibold">
                  {this.state.error.name}: {this.state.error.message}
                </p>
                {this.state.errorInfo?.componentStack && (
                  <pre className="text-[10px] font-mono text-slate-500 mt-2 max-h-32 overflow-y-auto whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-surface-950 text-xs font-bold shadow-md shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>
              <button
                onClick={this.handleGoLanding}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-surface-900 hover:bg-surface-800 text-slate-300 border border-white/[0.1] text-xs font-medium active:scale-95 transition"
              >
                <Home className="w-4 h-4" />
                <span>Return to Landing</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
