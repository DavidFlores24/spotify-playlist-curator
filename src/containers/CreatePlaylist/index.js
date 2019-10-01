import React, { Component } from "react";

import { getFromSpotify, getCookie, postToSpotify } from "../../utils";
import { PlaylistItem, Playlist } from "../../components";

import styles from "./CreatePlaylist.css";

const token = getCookie("token");
const header = {
  Authorization: `Bearer ${token}`
};

export class CreatePlaylist extends Component {
  constructor() {
    super();

    this.state = {
      playlists: [],
      selectedPlaylists: [],
      newPlaylist: {
        duration: 600000,
        numberOfTracks: 0,
        name: "",
        tracks: []
      }
    };

    this.getPlaylists().then(playlists =>
      this.setState({ playlists: playlists })
    );
  }

  async getPlaylists() {
    return getFromSpotify("me/playlists", header).then(res => {
      return res ? res.items : []
    });
  }

  onToggle = playlistKey => {
    const playlistToAdd = this.state.playlists[playlistKey];

    const toggledPlaylists = this.state.selectedPlaylists;
    toggledPlaylists.push(playlistToAdd);

    this.setState({ selectedPlaylists: toggledPlaylists });
  };

  generatePlaylist = () => {
    const promises = [];
    this.state.selectedPlaylists.map(playlist =>
      promises.push(this.getPlaylistTracks(playlist))
    );

    this.setCandidateTracks(promises);
  };

  async getPlaylistTracks(playlist) {
    const { id } = playlist;

    return getFromSpotify(`playlists/${id}/tracks`, header).then(res => {
      return res ? { playlist, tracks: res.items.map(item => item.track) } : {};
    });
  }

  setCandidateTracks = playlistPromises => {
    Promise.all(playlistPromises).then(res => {
      const overshoot = 30000;
      let coveredTime = 0;
      const playlistTracks = [];

      while (this.state.newPlaylist.duration - overshoot > coveredTime) {
        res.forEach(playlist => {
          let { tracks } = playlist;

          tracks = tracks.filter(track => track !== null);
          tracks.sort((a, b) => b.popularity - a.popularity);

          // need to use a for loop to be able to break
          for (let i = 0; i < tracks.length; i++) {
            const track = tracks[i];
            const { duration_ms } = track;
            if (
              !playlistTracks.includes(track) &&
              coveredTime + duration_ms <=
              this.state.newPlaylist.duration + overshoot
            ) {
              playlistTracks.push(track);
              coveredTime += duration_ms;
              break;
            }
          }
        });
      }

      const newPlaylist = this.state.newPlaylist;
      newPlaylist.numberOfTracks = playlistTracks.length;
      newPlaylist.tracks = playlistTracks;

      this.setState({ newPlaylist: newPlaylist });
    });
  };

  addPlaylistToSpotify = () => {
    this.getUser().then(user => {
      const { id } = user;
      const { newPlaylist } = this.state;
      const { name, tracks } = newPlaylist;

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

  async getUser() {
    return getFromSpotify("me", header);
  }

  onBlur = e => {
    const playlistName = e.target.value;

    if (playlistName !== "") {
      const { newPlaylist } = this.state;
      newPlaylist.name = playlistName;

      this.setState({ newPlaylist: newPlaylist });
    }
  };

  render() {
    this.playlistItems = this.state.playlists.map((playlist, index) => (
      <PlaylistItem
        name={playlist.name}
        key={index}
        onToggle={() => this.onToggle(index)}
      ></PlaylistItem>
    ));

    const { name, tracks } = this.state.newPlaylist;

    return (
      <>
        <h1>Got the Playlists!</h1>
        <div className={styles.playlists}>{this.playlistItems}</div>
        <div className={styles.button} onClick={this.generatePlaylist}>
          Create new Playlist
        </div>
        <Playlist
          name={name}
          tracks={tracks}
          onBlur={this.onBlur}
          onClick={this.addPlaylistToSpotify}
        />
      </>
    );
  }
}
