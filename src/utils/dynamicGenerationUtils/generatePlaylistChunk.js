import { getPlaylistTracks } from '../playlistGenerationUtils';
import { getTracksFeatures } from './index';

export async function generatePlaylistChunk(duration, sectionIndex, playlists = [], params = [], includedTracks = []) {
    if (playlists === []) {
        return { sectionIndex, tracks: [] };
    }

    const trackPromises = playlists.map(playlist => getPlaylistTracks(playlist.id));
    const playlistTracks = await Promise.all(trackPromises);
    let tracksFeatures = await getTracksFeatures(playlistTracks);
    tracksFeatures = tracksFeatures.filter(trackFeature => !includedTracks.includes(trackFeature.track.track.id));

    let threshold = 0.1;
    let candidateTracks = getFeaturedTracks(tracksFeatures, params, threshold);
    let sortedPlaylists = sortPlaylists(playlists, candidateTracks);
    let chunk = createChunk(sortedPlaylists, duration);

    while(chunk.coveredTime < duration - 30000 && threshold < 0.5) {
        threshold += 0.1;
        candidateTracks = getFeaturedTracks(tracksFeatures, params, threshold);
        sortedPlaylists = sortPlaylists(playlists, candidateTracks);
        chunk = createChunk(sortedPlaylists, duration);
    }
    
    return { sectionIndex, tracks: chunk.tracks };
}

const getFeaturedTracks = (tracks, params, threshold) => {
    let candidateTracks = [];
    for (const track of tracks) {
        if (track.audioFeature && hasCorrectFeatures(track, params, threshold)) {
            candidateTracks.push(track.track);
        }
    }
    return candidateTracks;
}

const hasCorrectFeatures = (trackFeature, params, threshold) =>  
    params.every(param => 
        trackFeature.audioFeature[param.name] >= (param.value - param.value * threshold) ||
        trackFeature.audioFeature[param.name] <= (param.value + param.value * threshold)
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
            }
        });
        numberOfRetries++;
    }

    return { tracks: chunkTracks, coveredTime };
}
