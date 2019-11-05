import React from "react";

import { ReplacementTrack } from "../index";

import classes from "./replacementsModal.css";

export const replacementsModal = props => {
	const { replacementTracks, originalTrack } = props;
	const { playlistId } = originalTrack;

	const tracks = replacementTracks.map(({ name, artists, id }, index) => {
		const artistNames = artists.map(artist => artist.name);

		return (
			<ReplacementTrack
				name={name}
				artists={artistNames}
				key={index}
				onClick={() => props.onSwitch(originalTrack, id, playlistId)}
			/>
		);
	});

	return (
		<div className={classes.replacements}>
			<ul>{tracks}</ul>
		</div>
	);
};
