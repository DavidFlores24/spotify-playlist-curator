/*
    Get the tracks of the playlist passed to the function.

    @params:
    playlist: playlist object to get the tracks from

    returns:
    Promise with playlist tracks
*/
import { getCookie } from "../getCookie";
import { getFromSpotify } from "../spotifyUtils";

const token = getCookie("token");
const header = {
	Authorization: `Bearer ${token}`
};

export const getPlaylistTracks = playlist => {
	const { id } = playlist;

	return getFromSpotify(`playlists/${id}/tracks`, header).then(res => {
		return res ? { playlist, tracks: res.items.map(item => item.track) } : {};
	});
};
