import React, { Component } from "react";
import { ErrorOverlay } from "../../components/index";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: ""
    };

    this.dismiss = this.dismiss.bind(this);
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      hasError: true,
      error: error,
      errorInfo: errorInfo
    });

    // TODO: log the error somewhere in the db
  }

  dismiss() {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: ""
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorOverlay
          show={true}
          message={this.state.error.message}
          dismiss={this.dismiss}
        />
      );
    } else {
      return this.props.children;
    }
  }
}
