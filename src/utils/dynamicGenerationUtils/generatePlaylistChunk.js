import { getPlaylistTracks } from '../playlistGenerationUtils';
import { getTracksFeatures } from './index';

export async function generatePlaylistChunk(duration, playlists = [], params = []) {
    if (playlists === []) {
        return;
    }

    const trackPromises = playlists.map(playlist => getPlaylistTracks(playlist.id));
    const playlistTracks = await Promise.all(trackPromises);
    const tracksFeatures = await getTracksFeatures(playlistTracks);

    const candidateTracks = [];
    for (const trackFeature of tracksFeatures) {
        if (hasCorrectFeatures(trackFeature, params)) {
            candidateTracks.push(trackFeature.track);
        }
    }
}

const hasCorrectFeatures = (trackFeature, params) =>  
    params.every(param => 
        trackFeature.audioFeature[param.name] >= (param.value - param.value * 0.1) ||
        trackFeature.audioFeature[param.name] <= (param.value + param.value * 0.1)
    );
