import { getCookie } from "../getCookie";
import { getFromSpotify } from "./index";

const token = getCookie("token");
const header = {
	Authorization: `Bearer ${token}`
};

export async function getTrackFromSpotify(id) {
	const track = await getFromSpotify(`tracks/${id}`, header);
	return track;
}
