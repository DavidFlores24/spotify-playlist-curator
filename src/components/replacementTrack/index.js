import React from "react";

import classes from "./replacementTrack.css";

export const replacementTrack = props => {
	const { name, artists } = props;
	return (
		<div className={classes.replacement} onClick={props.onClick}>
			{`${name} - ${artists.join(", ")}`}
		</div>
	);
};
