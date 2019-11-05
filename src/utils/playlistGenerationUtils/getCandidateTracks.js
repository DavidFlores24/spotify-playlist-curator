/*
    Resolve the tracks promises, sort them and return the most popular ones from each Playlist

    @params:
    playlistPromises: array of promises which resolution contains an object of { playlist, tracks }
    newPlaylistDuration: time in ms which the new playlist should last

    returns:
    array with sorted tracks
*/

import { getCookie } from "../index";

export async function getCandidateTracks(
	playlistPromises,
	newPlaylistDuration
) {
	let playlistTracks = [];

	playlistTracks = await Promise.all(playlistPromises).then(res => {
		const overshoot = 30000;
		let coveredTime = 0;
		const playlistTracks = [];
		const includedTracks = [];

		let replacementTracks = [];

		while (newPlaylistDuration - overshoot > coveredTime) {
			res.forEach(playlist => {
				let { tracks } = playlist;
				const { id: playlistId } = playlist.playlist;

				tracks = tracks.filter(track => track !== null);
				tracks.sort((a, b) => b.popularity - a.popularity);

				let playlistReplacements = [];
				const playlistCookie = JSON.parse(
					getCookie(`playlist_${playlistId}`) || "[]"
				);

				// need to use a for loop to be able to break
				for (let i = 0; i < tracks.length; i++) {
					const track = tracks[i];
					const { id, duration_ms } = track;
					if (
						!includedTracks.includes(id) &&
						coveredTime + duration_ms <= newPlaylistDuration + overshoot
					) {
						playlistTracks.push({ playlistId, track });
						includedTracks.push(id);
						coveredTime += duration_ms;

						if (replacementTracks.includes(id)) {
							playlistReplacements = playlistReplacements.filter(
								track => track.id !== id
							);

							replacementTracks = replacementTracks.filter(
								replacementTrackId => replacementTrackId !== id
							);
						}

						break;
					} else if (
						playlistReplacements.length <= 5 &&
						playlistCookie.length === 0
					) {
						// save up to 5 tracks to as replacement options per playlist
						const { name, artists, id } = track;

						if (!replacementTracks.includes(id)) {
							const replacementTrack = { name, artists, id };

							playlistReplacements.push(replacementTrack);
							replacementTracks.push(id);
						}
					}
				}

				document.cookie = `playlist_${playlistId}=${JSON.stringify(
					playlistReplacements
				)}`;
			});
		}

		return playlistTracks;
	});

	return playlistTracks;
}
