import React from 'react';
import { AlertCircle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ Error capturado por ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-12 h-12 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Error Inesperado
                </h1>
                <p className="text-gray-600 mb-4">
                  La aplicación encontró un error inesperado. Por favor, recarga la página.
                </p>
                
                {this.state.error && (
                  <div className="bg-red-50 rounded-lg p-4 mb-4">
                    <p className="text-sm font-mono text-red-800">
                      {this.state.error.toString()}
                    </p>
                  </div>
                )}
                
                <button
                  onClick={() => window.location.reload()}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  🔄 Recargar Página
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


