import React from "react";

import { ReplacementsModal } from "../index";

import classes from "./trackItem.css";

export const trackItem = props => {
	const { track } = props;
	return (
		<div className={classes.item}>
			<div className={classes.track}>
				<div className={classes.trackName}>{track.track.name}</div>
				{/*TODO: add switch component
				onClick = open Modal*/}
				<div className={classes.replace} onClick={() => {}}>
					Switch this Track
				</div>
			</div>
			<ReplacementsModal
				originalTrack={track}
				replacementTracks={props.replacementTracks}
				onSwitch={props.onSwitch}
			/>
		</div>
	);
};
