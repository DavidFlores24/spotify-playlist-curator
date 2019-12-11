import { getPlaylistTracks } from '../playlistGenerationUtils';
import { getTracksFeatures } from './index';

export async function generatePlaylistChunk(duration, sectionIndex, playlists = [], params = []) {
    if (playlists === []) {
        return { sectionIndex, tracks: [] };
    }

    const trackPromises = playlists.map(playlist => getPlaylistTracks(playlist.id));
    const playlistTracks = await Promise.all(trackPromises);
    const tracksFeatures = await getTracksFeatures(playlistTracks);

    const candidateTracks = getFeaturedTracks(tracksFeatures, params);
    const sortedPlaylists = sortPlaylists(playlists, candidateTracks);
    return { sectionIndex, tracks: createChunk(sortedPlaylists, duration) };
}

const getFeaturedTracks = (tracks, params) => {
    let candidateTracks = [];
    for (const track of tracks) {
        if (track.audioFeature && hasCorrectFeatures(track, params)) {
            candidateTracks.push(track.track);
        }
    }
    return candidateTracks;
}

const hasCorrectFeatures = (trackFeature, params) =>  
    params.every(param => 
        trackFeature.audioFeature[param.name] >= (param.value - param.value * 0.1) ||
        trackFeature.audioFeature[param.name] <= (param.value + param.value * 0.1)
    );

const sortPlaylists = (playlists, candidateTracks) => playlists.map(playlist => {
        const tracks = candidateTracks.filter(candidate => candidate.playlist === playlist.id);
        return { playlist: playlist.id, tracks }
    });

const createChunk = (playlists, duration) => {
    const includedTracks = [];
    const chunkTracks = [];
    const overshoot = 30000;
    let coveredTime = 0;
    let numberOfRetries = 0;

    while (duration - overshoot > coveredTime && numberOfRetries < 5) {
        playlists.forEach(candidate => {
            let tracks = candidate.tracks.map(track => track.track);
            if (tracks) {
                tracks.sort((a, b) => b.popularity - a.popularity);

                for (let i = 0; i < tracks.length; i++) {
                    const track = tracks[i];
                    const { id, duration_ms } = track;

                    if (
                    !includedTracks.includes(id) &&
                    coveredTime + duration_ms <= duration + overshoot
                    ) {
                        chunkTracks.push(track);
                        includedTracks.push(id);
                        coveredTime += duration_ms;
                        break;
                    }
                }
                numberOfRetries++;
            }
        });
    }

    return chunkTracks;
}
