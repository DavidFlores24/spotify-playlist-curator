import { getCookie } from "../getCookie";
import { getFromSpotify } from './index';

const token = getCookie("token");
const header = {
	Authorization: `Bearer ${token}`
};

export async function getAudioFeatures(trackIds) {
    const ids = trackIds.join(',');
    return getFromSpotify('audio-features', header, { ids });
}