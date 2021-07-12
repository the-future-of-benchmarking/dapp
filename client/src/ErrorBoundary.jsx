import { Message } from "primereact/message";
import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: "" };
    }
  
    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }
  
    componentDidCatch(error, errorInfo) {
      console.error("Boundary",error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        
        return <Message severity="error" text={this.state.error}></Message>;
      }
  
      return this.props.children; 
    }
  }
  export default ErrorBoundary;