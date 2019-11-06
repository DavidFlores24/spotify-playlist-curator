/*
    Generate new Playlist based on array of playlists passed to the function.
    
    @params: playlists: array of Playlist objects that will be used to generate a new playlist
    
    returns: new Playlist object
*/

import { getPlaylistTracks } from "./getPlaylistTracks";
import { getCandidateTracks } from "./getCandidateTracks";

export async function generatePlaylist(playlists = [], newPlaylistDuration) {
	if (playlists === []) {
		return;
	}

	const promises = [];
	playlists.map(playlist => promises.push(getPlaylistTracks(playlist.id)));

	const tracks = await getCandidateTracks(promises, newPlaylistDuration);

	return {
		numberOfTracks: tracks.length,
		tracks
	};
}
