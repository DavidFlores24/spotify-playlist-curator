import { getCookie } from "../getCookie";
import { getFromSpotify } from ".";

const token = getCookie("token");
const header = {
	Authorization: `Bearer ${token}`
};

export async function getSpotifyUser() {
	return getFromSpotify("me", header);
}
