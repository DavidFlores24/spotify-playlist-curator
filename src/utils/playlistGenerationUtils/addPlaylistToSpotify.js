import { getSpotifyUser, postToSpotify } from "../spotifyUtils";
import { getCookie } from "../getCookie";

const token = getCookie("token");
const header = {
  Authorization: `Bearer ${token}`
};

export const addPlaylistToSpotify = playlistToAdd => {
  validate(playlistToAdd);

  getSpotifyUser().then(user => {
    const { id } = user;
    const { name, tracks } = playlistToAdd;

    const playlist = {
      collaborative: false,
      name,
      public: true
    };

    postToSpotify(`users/${id}/playlists`, header, {}, playlist).then(res => {
      const { id } = res;
      const uris = tracks.map(track => track.uri);

      postToSpotify(`playlists/${id}/tracks`, header, {}, { uris });
    });
  });
};

const validate = ({ name, tracks }) => {
  if (!name || name === "") {
    throw new Error("Please give your Playlist a name.");
  }

  if (!tracks || tracks.length === 0) {
    throw new Error("No tracks are being added to your Playlist.");
  }
};
