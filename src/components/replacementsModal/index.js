import React from "react";

import { ReplacementTrack } from "../index";

import classes from "./replacementsModal.css";

export const replacementsModal = props => {
	const { replacementTracks, originalTrack, trackKey } = props;
	const { playlistId } = originalTrack;

	const tracks = replacementTracks.map(({ name, artists, id }, index) => {
		const artistNames = artists.map(artist => artist.name);

		return (
			<ReplacementTrack
				name={name}
				artists={artistNames}
				key={index}
				onClick={() => props.onSwitch(originalTrack, trackKey, id, playlistId)}
			/>
		);
	});

	let divClasses = [classes.replacements];
	if (props.shouldShow) {
		divClasses.push(classes.show);
	}

	return (
		<div className={divClasses.join(" ")}>
			<ul>{tracks}</ul>
		</div>
	);
};
