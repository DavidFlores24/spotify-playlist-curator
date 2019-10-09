import { getCookie } from "../getCookie";
import { getFromSpotify } from "../spotifyUtils";

const token = getCookie("token");
const header = {
	Authorization: `Bearer ${token}`
};

export async function getUser() {
	return getFromSpotify("me", header);
}
