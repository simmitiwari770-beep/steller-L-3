import React from 'react';

class ErrorDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', background: '#0a0a0a', color: '#ff4444', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1 style={{ color: '#fff' }}>⚠️ Application Error</h1>
          <p>The application crashed during startup. See logs below:</p>
          <pre style={{ background: '#000', padding: '20px', borderRadius: '8px', overflow: 'auto', border: '1px solid #333' }}>
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorDisplay;
