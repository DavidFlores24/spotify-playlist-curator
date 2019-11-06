/*
    Resolve the tracks promises, sort them and return the most popular ones from each Playlist

    @params:
    playlistPromises: array of promises which resolution contains an object of { playlist, tracks }
    newPlaylistDuration: time in ms which the new playlist should last

    returns:
    array with sorted tracks
*/

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

		while (newPlaylistDuration - overshoot > coveredTime) {
			res.forEach(playlist => {
				let { tracks } = playlist;
				const { playlist: playlistId } = playlist;

				tracks = tracks.filter(track => track !== null);
				tracks.sort((a, b) => b.popularity - a.popularity);

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
						break;
					}
				}
			});
		}

		return playlistTracks;
	});

	return playlistTracks;
}
