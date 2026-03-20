import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-zinc-50 rounded-3xl border border-zinc-200 text-center">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h2 className="text-xl font-bold text-zinc-900 mb-2">Something went wrong</h2>
          <p className="text-zinc-500 max-w-md mb-6">
            We encountered an error while rendering this component. This has been logged for our team.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-zinc-900 text-white px-6 py-2 rounded-xl font-semibold hover:bg-zinc-800 transition-colors"
          >
            Try again
          </button>
          {this.state.error && (
            <pre className="mt-8 p-4 bg-zinc-100 rounded-xl text-[10px] text-zinc-400 text-left overflow-auto max-w-full">
              {this.state.error.message}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
