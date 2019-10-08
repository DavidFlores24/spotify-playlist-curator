import React from "react";

import classes from "./playlistItem.css";

export const PlaylistItem = props => {
	return (
		<div className={classes.item}>
			<div className={classes.label}>{props.name}</div>
			<input type='checkbox' onClick={props.onToggle} className={classes.switch}></input>
		</div>
	);
};
