import React, { Component } from 'react'
import { AlertTriangle } from 'lucide-react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo)
    this.setState({ errorInfo })
    
    // You could also log to an error tracking service like Sentry here
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-red-700 mb-2">Something went wrong</h2>
          <p className="text-red-600 mb-4">
            We're sorry, but an error occurred while rendering this component.
          </p>
          {this.props.resetErrorBoundary && (
            <button
              onClick={this.props.resetErrorBoundary}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Try again
            </button>
          )}
          {this.state.error && process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-4 bg-red-100 rounded-md text-left overflow-auto max-h-64">
              <p className="font-mono text-sm text-red-800 whitespace-pre-wrap">
                {this.state.error.toString()}
              </p>
              {this.state.errorInfo && (
                <details className="mt-2">
                  <summary className="text-sm font-medium text-red-800 cursor-pointer">
                    Component Stack
                  </summary>
                  <p className="mt-2 font-mono text-xs text-red-800 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </p>
                </details>
              )}
            </div>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

