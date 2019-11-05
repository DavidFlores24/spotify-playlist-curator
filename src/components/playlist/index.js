import React from "react";

import { getCookie } from "../../utils";
import { TrackItem, Header, Button } from "../index";

import styles from "./playlist.css";

export const playlist = props => {
	const tracks = props.tracks.map((track, index) => {
		console.log(track);
		const replacementTracks = JSON.parse(
			getCookie(`playlist_${track.playlistId}`)
		);
		return (
			<TrackItem
				track={track}
				key={index}
				replacementTracks={replacementTracks}
				onSwitch={props.onSwitchTrack}
			/>
		);
	});

	return (
		<div className={styles.playlist}>
			<div className={styles.header}>
				<Header label="Your New Playlist" />
			</div>
			<input
				type="text"
				className={styles.name}
				placeholder="Playlist name"
				onBlur={props.onBlur}
			/>
			<div className={styles.tracks}>{tracks}</div>
			<div className={styles.button}>
				<Button label="Add Playlist to Spotify" onClick={props.onClick} />
			</div>
		</div>
	);
};
