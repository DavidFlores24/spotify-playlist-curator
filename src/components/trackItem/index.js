import React from "react";

import { ReplacementsModal } from "../index";

import classes from "./trackItem.css";

export const trackItem = props => {
	return (
		<div className={classes.item}>
			{props.name}
			<ReplacementsModal replacementTracks={props.replacementTracks} />
		</div>
	);
};
