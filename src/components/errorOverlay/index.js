import React from "react";

import { Button } from "../index";

import styles from "./errorOverlay.css";

export const errorOverlay = props => {
	let overlayClasses = [styles.overlay];

	return (
		<div className={overlayClasses.join(" ")}>
			<div className={styles.message}>
				<div>{props.message}</div>
			</div>
			<div className={styles.button}>
				<Button label={"Dismiss"} onClick={props.dismiss} />
			</div>
		</div>
	);
};
