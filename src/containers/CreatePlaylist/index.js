import React, { Component } from "react";

import { getFromSpotify, getCookie } from "../../utils";
import { PlaylistItem } from "../../components";

import styles from "./CreatePlaylist.css";

export class CreatePlaylist extends Component {
	constructor() {
		super();

		this.state = {
			playlists: [],
			selectedPlaylists: []
		};

		this.getPlaylists().then(playlists =>
			this.setState({ playlists: playlists })
		);
	}

	async getPlaylists() {
		const token = getCookie("token");
		const header = {
			Authorization: `Bearer ${token}`
		};
		return getFromSpotify("me/playlists", header).then(res => {
			return res.items;
		});
	}

	onToggle = playlistKey => {
		const playlistToAdd = this.state.playlists[playlistKey];

		console.log(playlistToAdd);

		const toggledPlaylists = this.state.selectedPlaylists;
		toggledPlaylists.push(playlistToAdd);

		this.setState({ selectedPlaylists: toggledPlaylists });
	};

	render() {
		this.playlistItems = this.state.playlists.map((playlist, index) => (
			<PlaylistItem
				name={playlist.name}
				key={index}
				onToggle={() => this.onToggle(index)}
			></PlaylistItem>
		));

		return (
			<>
				<h1>Got the Playlists!</h1>
				<div className={styles.playlists}>{this.playlistItems}</div>
				<div className={styles.button}>Create new Playlist</div>
			</>
		);
	}
}
