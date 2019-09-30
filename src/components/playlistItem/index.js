import React, { Component } from "react";

import classes from "./playlistItem.css";

export const PlaylistItem = props => {
	return (
		<div className={classes.item}>
			<div className={classes.label}>{props.name}</div>
			<label className={classes.switch}>
				<input type="checkbox" onClick={props.onToggle} />
				<span className={classes.round}></span>
			</label>
		</div>
	);
};
