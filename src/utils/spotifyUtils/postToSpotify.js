import "fetch";
import { stringify } from "qs";

const baseUri = "https://api.spotify.com/v1";

export async function postToSpotify(
  endpoint,
  header = {},
  queryParams = {},
  data = {}
) {
  const uri = `${baseUri}/${endpoint}${stringify(queryParams, {
    addQueryPrefix: true
  })}`;

  const postHeader = {
    ...header,
    "Content-Type": "application/json"
  };

  const response = await fetch(uri, {
    method: "POST",
    headers: postHeader,
    body: JSON.stringify(data)
  });

  if (response.status === 201) {
    return response.json();
  }
}
