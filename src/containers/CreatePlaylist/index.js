import React, { Component } from "react";

import { getPlaylistsFromSpotify as getPlaylists } from "../../utils/spotifyUtils";

import {
  generatePlaylist,
  generateRecommendations
} from "../../utils/playlistGenerationUtils";

import { Button, Header, Playlist, PlaylistSelector } from "../../components";

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

      isSelectionInvalid: false
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
    if (this.state.selectedPlaylists.length === 0) {
      this.setState({ isSelectionInvalid: true });
      return;
    }

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
    const {
      isSelectionInvalid,
      playlists,
      newPlaylist,
      showNewPlaylist
    } = this.state;

    return (
      <div className={styles.createPlaylistPage}>
        <div className={styles.selector}>
          <div className={styles.header}>
            <Header label={"Select your Playlists to inspire the Curator"} />
          </div>

          <h3>How long should the playlist last?</h3>

          <div className={styles.duration} id="durationSlider">
            <input
              type="range"
              min="10"
              max="120"
              className={styles.slider}
              onInput={this.setPlaylistDuration}
            />
            <div id="durationSpan"></div>
            <span>minutes</span>
          </div>

          <PlaylistSelector playlists={playlists} onToggle={this.onToggle} />
          <div className={styles.button}>
            <Button
              onClick={this.createPlaylist}
              label="Create new Playlist"
              hasError={isSelectionInvalid}
            />
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
