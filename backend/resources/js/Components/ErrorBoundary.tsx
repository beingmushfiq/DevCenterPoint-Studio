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
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-white">
        <div className="max-w-md w-full text-center liquid-glass rounded-3xl p-8 sm:p-10 ring-1 ring-black/5 dark:ring-white/10 shadow-2xl">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center mb-5">
            <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight mb-2">
            Something went wrong
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 font-medium leading-relaxed mb-6">
            The page hit an unexpected error while rendering. Reloading usually resolves it. If it
            keeps happening, please reach out and we will look into it.
          </p>

          {this.state.message && (
            <pre className="mb-6 text-left text-[11px] font-mono text-slate-500 dark:text-neutral-500 bg-white/60 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl p-3 overflow-x-auto whitespace-pre-wrap">
              {this.state.message}
            </pre>
          )}

          <button
            type="button"
            onClick={this.handleReload}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
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
