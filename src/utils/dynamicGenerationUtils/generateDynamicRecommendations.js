import { getRecommendedTracks } from '../spotifyUtils';

export async function generateDynamicRecommendations(sectionTracks, duration, params) {
    let queryParams = [];
    queryParams = params.map(({ name, value }) => {
        queryParams[`max_${name}`] = value + value * 0.1;
        queryParams[`min_${name}`] = value - value * 0.1;
    });

    const popularTracks = sectionTracks.sort((a, b) => b.popularity - a.popularity).slice(0, 5);
    const recommendations = await getRecommendedTracks(popularTracks, duration, 5, queryParams);

    return recommendations.tracks;
}