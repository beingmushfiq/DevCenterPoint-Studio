import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

/**
 * Global render-error boundary.
 * Prevents an unhandled component error from blanking the entire page.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error?.message || 'An unexpected error occurred.' };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[DevCenterPoint] Unhandled UI error:', error, info.componentStack);
  }

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-canvas)] text-[var(--text-ink)]">
        <div className="max-w-md w-full text-center editorial-card rounded-2xl p-8 sm:p-10 shadow-lg">
          <div className="mx-auto w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center mb-5">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight mb-2">
            Something went wrong
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] font-normal leading-relaxed mb-6">
            The page encountered an unexpected state. Reloading will reset the application.
          </p>

          {this.state.message && (
            <pre className="mb-6 text-left text-[11px] font-mono text-[var(--text-muted)] bg-[var(--bg-subtle)] border hairline-border rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">
              {this.state.message}
            </pre>
          )}

          <button
            type="button"
            onClick={this.handleReload}
            className="editorial-btn-primary inline-flex items-center gap-2 px-4 py-2 text-xs font-bold cursor-pointer rounded-lg"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Page</span>
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
