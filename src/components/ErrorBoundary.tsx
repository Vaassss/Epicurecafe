import { Component, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Safe environment check
const isDevelopment = typeof import.meta !== 'undefined' && 
                      import.meta.env !== undefined && 
                      import.meta.env.DEV === true;

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log error to console in development
    if (isDevelopment) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    
    // In production, you could send to error tracking service
    // Example: Sentry.captureException(error);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#1a2f2a] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gradient-to-br from-[#243832] to-[#1a2f2a] border-2 border-[#a8c5a0]/30 rounded-3xl p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-400" />
            </div>
            
            <h1 className="text-2xl text-[#d4e4d0] mb-3">
              Oops! Something went wrong
            </h1>
            
            <p className="text-[#a8c5a0]/70 mb-6">
              We're sorry for the inconvenience. The application encountered an unexpected error.
            </p>
            
            {isDevelopment && this.state.error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-left">
                <p className="text-red-400 text-xs font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            
            <div className="flex gap-3">
              <Button
                onClick={this.handleReset}
                className="flex-1 bg-gradient-to-r from-[#a8c5a0] to-[#8fb088] text-[#1a2f2a]"
              >
                Restart App
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="flex-1 border-[#a8c5a0]/30 text-[#a8c5a0]"
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}