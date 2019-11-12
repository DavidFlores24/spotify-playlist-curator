import React, { Component } from "react";
import { ErrorOverlay } from "../../components/index";

import styles from "./ErrorBoundary.css";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: ""
    };
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
          message={this.state.error.message}
          dismiss={this.dismiss}
        />
      );
    } else {
      return this.props.children;
    }
  }
}
