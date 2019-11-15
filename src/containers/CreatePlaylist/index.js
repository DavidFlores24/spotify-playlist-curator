import React, { Component } from "react";

import { getPlaylistsFromSpotify as getPlaylists } from "../../utils/spotifyUtils";

import {
  generatePlaylist,
  addPlaylistToSpotify as addPlaylist,
  generateRecommendations
} from "../../utils/playlistGenerationUtils";

import { getCookie } from "../../utils";

import {
  Button,
  Header,
  PlaylistItem,
  Playlist,
  Overlay
} from "../../components";

import { ErrorBoundary } from "../../hoc";

import styles from "./CreatePlaylist.css";

export class CreatePlaylist extends Component {
  constructor() {
    super();

    this.state = {
      playlists: [],
      selectedPlaylists: [],
      showNewPlaylist: false,

      newPlaylist: {
        duration: 600000,
        tracks: []
      },

      isSwitching: false,
      switchingTrackIndex: null,

      showOverlay: false,

      hasError: false,
      error: null
    };

    this.playlistRef = React.createRef();
    this.createPlaylist = this.createPlaylist.bind(this);

    getPlaylists().then(playlists => this.setState({ playlists: playlists }));
  }

  onToggle = playlistKey => {
    const playlistToAdd = this.state.playlists[playlistKey];

    const toggledPlaylists = this.state.selectedPlaylists;
    toggledPlaylists.push(playlistToAdd);

    this.setState({ selectedPlaylists: toggledPlaylists });
  };

  sortPlaylists = () => {
    this.one = [];
    this.two = [];
    this.three = [];

    for (let i = 0; i < this.playlistItems.length; i++) {
      if (i % 3 === 0) {
        this.three.push(this.playlistItems[i]);
      } else if (i % 2 === 0) {
        this.two.push(this.playlistItems[i]);
      } else {
        this.one.push(this.playlistItems[i]);
      }
    }
  };

  setPlaylistDuration = e => {
    const { newPlaylist } = this.state;
    const { value } = e.target;

    const duration = value * 60000;
    newPlaylist.duration = duration;

    this.setState({
      newPlaylist: newPlaylist
    });

    document.getElementById("durationSpan").innerText = value;
  };

  async createPlaylist() {
    const newPlaylist = { ...this.state.newPlaylist };
    const playlist = await generatePlaylist(
      [...this.state.selectedPlaylists],
      newPlaylist.duration
    );

    const { tracks } = playlist;
    tracks.map(track => generateRecommendations(track));
    newPlaylist.tracks = tracks;

    this.setState({
      newPlaylist: newPlaylist,
      showNewPlaylist: true
    });

    window.scrollTo(0, this.playlistRef.current.offsetTop);
  }

  render() {
    const { playlists, newPlaylist, showNewPlaylist } = this.state;

    this.playlistItems = playlists.map((playlist, index) => (
      <PlaylistItem
        name={playlist.name}
        key={index}
        onToggle={() => this.onToggle(index)}
      ></PlaylistItem>
    ));
    this.sortPlaylists();

    return (
      <div className={styles.createPlaylistPage}>
        <div className={styles.selector}>
          <div className={styles.header}>
            <Header label={"Select your Playlists to inspire the Curator"} />
          </div>

          {/* TODO Add Small header component */}
          <h3>How long should the playlist last?</h3>

          <div className={styles.duration} id="durationSlider">
            <input
              type="range"
              min="10"
              max="120"
              className={styles.slider}
              onInput={e => this.setPlaylistDuration(e)}
            />
            <div id="durationSpan"></div>
            <span>minutes</span>
          </div>

          <div className={styles.playlists}>
            <div className={styles.column}>{this.one}</div>

            <div className={styles.column}>{this.two}</div>

            <div className={styles.column}>{this.three}</div>
          </div>
          <div className={styles.button}>
            <Button onClick={this.createPlaylist} label="Create new Playlist" />
          </div>
        </div>
        <div ref={this.playlistRef}>
          <ErrorBoundary>
            <Playlist tracks={newPlaylist.tracks} show={showNewPlaylist} />
          </ErrorBoundary>
        </div>
      </div>
    );
  }

  componentDidMount() {
    const duration = this.state.newPlaylist.duration / 60000;

    document.getElementById("durationSpan").innerText = duration;
    document.getElementById("durationSlider").value = duration;
  }
}
