import React, { Component } from "react";

import {
	getPlaylistsFromSpotify as getPlaylists,
	getTrackFromSpotify as getTrack
} from "../../utils/spotifyUtils";
import {
	generatePlaylist,
	addPlaylistToSpotify as addPlaylist
} from "../../utils/playlistGenerationUtils";
import { getCookie } from "../../utils";
import { Button, Header, PlaylistItem, Playlist } from "../../components";

import styles from "./CreatePlaylist.css";

export class CreatePlaylist extends Component {
	constructor() {
		super();

		this.state = {
			playlists: [],
			selectedPlaylists: [],
			showNewPlaylist: false,
			newPlaylist: {
				duration: 600000,
				numberOfTracks: 0,
				name: "",
				tracks: []
			}
		};

		getPlaylists().then(playlists => this.setState({ playlists: playlists }));
	}

	onToggle = playlistKey => {
		const playlistToAdd = this.state.playlists[playlistKey];

		const toggledPlaylists = this.state.selectedPlaylists;
		toggledPlaylists.push(playlistToAdd);

		this.setState({ selectedPlaylists: toggledPlaylists });
	};

	onBlur = e => {
		const playlistName = e.target.value;

		if (playlistName !== "") {
			const { newPlaylist } = this.state;
			newPlaylist.name = playlistName;

			this.setState({ newPlaylist: newPlaylist });
		}
	};

	sortPlaylists = () => {
		this.one = [];
		this.two = [];
		this.three = [];

		for (let i = 0; i < this.playlistItems.length; i++) {
			if (i % 3 === 0) {
				this.three.push(this.playlistItems[i]);
			} else if (i % 2 === 0) {
				this.two.push(this.playlistItems[i]);
			} else {
				this.one.push(this.playlistItems[i]);
			}
		}
	};

	setPlaylistDuration = e => {
		const { newPlaylist } = this.state;
		const { value } = e.target;

		const duration = value * 60000;
		newPlaylist.duration = duration;

		this.setState({
			newPlaylist: newPlaylist
		});

		document.getElementById("durationSpan").innerText = value;
	};

	createPlaylist = () => {
		generatePlaylist(
			this.state.selectedPlaylists,
			this.state.newPlaylist.duration
		).then(res => {
			const { newPlaylist } = this.state;
			const { tracks, numberOfTracks } = res;

			newPlaylist.tracks = tracks;
			newPlaylist.numberOfTracks = numberOfTracks;

			this.setState({
				newPlaylist: newPlaylist,
				showNewPlaylist: true
			});
		});
	};

	switchTrack = (track, trackIndex, newTrackId, playlistId) => {
		const { track: originalTrack } = track;
		getTrack(newTrackId).then(res => {
			const newTrack = res;
			const newPlaylist = this.state.newPlaylist;
			const { tracks } = newPlaylist;

			tracks[trackIndex] = { playlistId, track: newTrack };
			newPlaylist.tracks = tracks;

			this.makeOriginalTrackReplacement(originalTrack, newTrackId, playlistId);
			this.setState({
				newPlaylist: newPlaylist
			});
		});
	};

	makeOriginalTrackReplacement = (track, newTrackId, playlistId) => {
		let replacementTracks = JSON.parse(getCookie(`playlist_${playlistId}`));
		replacementTracks = replacementTracks.filter(({ id }) => id !== newTrackId);

		const { name, artists, id } = track;
		replacementTracks.push({
			name,
			artists,
			id
		});

		document.cookie = `playlist_${playlistId}=${JSON.stringify(
			replacementTracks
		)}`;
	};

	addPlaylistToSpotify = () => {
		addPlaylist(this.state.newPlaylist);
	};

	render() {
		this.playlistItems = this.state.playlists.map((playlist, index) => (
			<PlaylistItem
				name={playlist.name}
				key={index}
				onToggle={() => this.onToggle(index)}
			></PlaylistItem>
		));
		this.sortPlaylists();

		const { name, tracks } = this.state.newPlaylist;

		return (
			<>
				<div className={styles.selector}>
					<div className={styles.header}>
						<Header label={"Select your Playlists to inspire the Curator"} />
					</div>

					{/* TODO Add Small header component */}
					<h3>How long should the playlist last?</h3>

					<div className={styles.duration} id="durationSlider">
						<input
							type="range"
							min="10"
							max="120"
							className={styles.slider}
							onInput={e => this.setPlaylistDuration(e)}
						/>
						<div id="durationSpan"></div>
						<span>minutes</span>
					</div>

					<div className={styles.playlists}>
						<div className={styles.column}>{this.one}</div>

						<div className={styles.column}>{this.two}</div>

						<div className={styles.column}>{this.three}</div>
					</div>
					<div className={styles.button}>
						<Button onClick={this.createPlaylist} label="Create new Playlist" />
					</div>
				</div>

				{this.state.showNewPlaylist && (
					<Playlist
						name={name}
						tracks={tracks}
						onBlur={this.onBlur}
						onClick={this.addPlaylistToSpotify}
						onSwitchTrack={this.switchTrack}
					/>
				)}
			</>
		);
	}

	componentDidMount() {
		const duration = this.state.newPlaylist.duration / 60000;

		document.getElementById("durationSpan").innerText = duration;
		document.getElementById("durationSlider").value = duration;
	}
}
