import { getAudioFeatures } from '../spotifyUtils';

export async function getTracksFeatures(playlists) {
    let trackIds = [];
    let tracks = [];

    playlists.map(playlist => {
        let playlistTracks = playlist.tracks.map(track => { return { track, playlist: playlist.playlist }});
        tracks.push(playlistTracks);

        playlistTracks = playlistTracks.filter(track => track !== null);
        trackIds.push(playlistTracks.map(track => track.track.id));
    });
    trackIds = trackIds.flat();
    tracks = tracks.flat();

    let audioFeatures = [];
    while (trackIds.length > 0) {
        const queryIds = trackIds.splice(0, 100);
        const features = await getAudioFeatures(queryIds);
        audioFeatures.push(features);
    }

    audioFeatures = audioFeatures.map(feature => feature.audio_features);
    audioFeatures = audioFeatures.flat();

    const features = [];
    tracks.map(track => {
        const audioFeature = audioFeatures.find(feature => feature.track_href === track.track.href);
        features.push({ track, audioFeature });
    })
    
    return features;
}