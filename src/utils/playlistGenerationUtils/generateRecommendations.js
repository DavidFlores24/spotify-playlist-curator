import { getCookie } from "../index";
import { getRecommendedTracks } from "../spotifyUtils";
import { getPlaylistTracks } from "../playlistGenerationUtils";

export async function generateRecommendations(track) {
	const { playlistId, track: originalTrack } = track;
	const { duration_ms } = originalTrack;

	const playlistCookie = getCookie(`playlist_${playlistId}`);
	if (playlistCookie !== "" && JSON.parse(playlistCookie).length > 0) {
		return;
	}

	getPlaylistTracks(playlistId).then(res => {
		const { tracks } = res;
		const playlistTracks = tracks.filter(track => track !== null);
		playlistTracks.sort((a, b) => b.popularity - a.popularity);

		getRecommendedTracks(playlistTracks.slice(0, 5), duration_ms, 5).then(
			res => {
				const { tracks } = res;
				const recommendedTracks = tracks.map(({ name, artists, id }) => {
					return {
						name,
						artists,
						id
					};
				});

				document.cookie = `playlist_${playlistId}=${JSON.stringify(
					recommendedTracks
				)}`;
			}
		);
	});
}
