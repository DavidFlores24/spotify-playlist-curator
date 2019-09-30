import React from "react";

import { TrackItem } from "../index";

import styles from "./playlist.css";

export const playlist = props => {
	const tracks = props.tracks.map((track, index) => (
		<TrackItem name={track.name} key={index} />
	));

	return (
		<>
			<div className={styles.playlist}>
				<div className={styles.name}>{props.name}</div>
				<div className={styles.tracks}>{tracks}</div>
			</div>
			<div className={styles.button}>Add Playlist to Spotify</div>
		</>
	);
};
