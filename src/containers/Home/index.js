import React, { Component } from "react";
import { parse } from "qs";

import { Button, Header } from "../../components";

import styles from "./Home.css";

export class Home extends Component {
	constructor() {
		super();
		this.saveToken();
	}

	saveToken = () => {
		let queryParams = parse(window.location.hash.substring(1), {
			ignoreQueryPrefix: true
		});

		const { access_token } = queryParams;
		document.cookie = `token=${access_token}`;

		//TODO: add expired in #cba doing it right now
	};

	render() {
		return (
			<>
				<div className={styles.page}>
					<Header label="Spotify Playlist Curator" />
					<div className={styles.buttons}>
						<div className={styles.button}>
							<Button href="/create-playlist" label="Create New Playlist" />
							<div className={styles.description}>
								Create an entirely new playlist using your Spotify library.
								<br />
								<br />
								Change the length of the playlist, add new tracks and see it in
								your Spotify app.
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
}
