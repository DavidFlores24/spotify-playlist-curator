import { getCookie } from "../index";
import { getFromSpotify } from "./index";

const token = getCookie("token");
const header = {
	Authorization: `Bearer ${token}`
};

export async function getRecommendedTracks(baseTracks, baseDuration, limit) {
	const seeds = baseTracks.map(track => track.id);

	const queryParams = {
		limit,
		max_duration: baseDuration + 30000,
		min_duration: baseDuration - 30000,
		seed_tracks: seeds.join(",")
	};

	const recommendations = await getFromSpotify(
		"recommendations",
		header,
		queryParams
	);

	return recommendations;
}
