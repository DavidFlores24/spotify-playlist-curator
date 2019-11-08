import React, { Component } from "react";
import { Button } from "../../components/index";

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
		let overlayClasses = [styles.overlay];

		if (this.state.hasError) {
			overlayClasses.push(styles.show);
		}

		return (
			<div className={overlayClasses.join(" ")}>
				<div className={styles.message}>
					<div>{this.state.errorInfo}</div>
				</div>
				<div className={styles.button}>
					<Button label={"Dismiss"} onClick={this.dismiss} />
				</div>
			</div>
		);
	}
}
