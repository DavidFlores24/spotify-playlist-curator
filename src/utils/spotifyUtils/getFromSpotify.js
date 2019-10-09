import "fetch";
import { stringify } from "qs";

const baseUri = "https://api.spotify.com/v1";

export async function getFromSpotify(endpoint, header = {}, queryParams = {}) {
  const uri = `${baseUri}/${endpoint}${stringify(queryParams, {
    addQueryPrefix: true
  })}`;

  const response = await fetch(uri, {
    method: "GET",
    headers: header
  });

  if (response.status === 200) {
    return response.json();
  }
}
