import React from "react";

import { getCookie } from "../../utils";
import { TrackItem, Header, Button } from "../index";

import styles from "./playlist.css";

export const playlist = props => {
	const tracks = props.tracks.map((track, index) => {
		const playlistCookie = getCookie(`playlist_${track.playlistId}`);
		const replacementTracks =
			playlistCookie === "" ? [] : JSON.parse(playlistCookie);

		return (
			<TrackItem
				track={track}
				key={index}
				index={index}
				replacementTracks={replacementTracks}
				onSwitch={props.onSwitchTrack}
				showRecommendations={() => props.showRecommendations(index)}
				shouldShowRecommendations={props.switchingTrackIndex === index}
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
