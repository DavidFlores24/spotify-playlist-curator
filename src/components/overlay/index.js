import React from "react";
import { Header } from "../index";

import styles from "./overlay.css";

export const overlay = props => {
	let overlayClasses = [styles.overlay];

	if (props.show) {
		overlayClasses.push(styles.show);
	}

	return (
		<div className={overlayClasses.join(" ")}>
			<div className={styles.message}>
				<Header label={props.message} />
			</div>
		</div>
	);
};
