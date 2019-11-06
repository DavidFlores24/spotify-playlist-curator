import { getCookie } from "../getCookie";
import { getFromSpotify } from "./getFromSpotify";

const token = getCookie("token");
const header = {
	Authorization: `Bearer ${token}`
};

export async function getPlaylistsFromSpotify() {
	return getFromSpotify("me/playlists", header).then(res => {
		return res ? res.items : [];
	});
}
