import React from "react";

import { ReplacementsModal } from "../index";

import classes from "./trackItem.css";

export const trackItem = props => {
	const { track } = props;
	return (
		<div className={classes.item}>
			<div className={classes.track}>
				<div className={classes.trackName}>{track.name || track.track.name}</div>
				{/*TODO: add switch component
				onClick = open Modal*/}
				<div className={classes.replace} onClick={props.showRecommendations}>
					Switch this Track
				</div>
			</div>
			<ReplacementsModal
				originalTrack={track}
				replacementTracks={props.replacementTracks}
				onSwitch={props.onSwitch}
				trackKey={props.index}
				shouldShow={props.shouldShowRecommendations}
			/>
		</div>
	);
};
