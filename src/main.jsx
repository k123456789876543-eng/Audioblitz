import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("AuraBoost render crash:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", background: "#05050f", color: "#fff", fontFamily: "system-ui", padding: 24 }}>
          <h1 style={{ fontSize: 18, marginBottom: 12 }}>App failed to render</h1>
          <p style={{ color: "#b8b8c4", marginBottom: 8 }}>
            Open browser DevTools → Console and share the first red error line.
          </p>
          <pre style={{ whiteSpace: "pre-wrap", color: "#ffb4b4", fontSize: 12 }}>
            {String(this.state.error)}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
