import React, { Component } from "react";

import { getCookie } from "../../utils";
import { getTrackFromSpotify as getTrack } from "../../utils/spotifyUtils";
import { addPlaylistToSpotify as addPlaylist } from "../../utils/playlistGenerationUtils";

import { TrackItem, Header, Button, Overlay } from "../index";

import styles from "./playlist.css";

export class Playlist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tracks: [],
      name: "",

      show: false,
      showOverlay: false,
      isSwitching: false,

      hasError: false,
      error: null,

      incorrectName: false
    };
  }

  switchTrack = (track, trackIndex, newTrackId, playlistId) => {
    const { track: originalTrack } = track;

    getTrack(newTrackId).then(res => {
      const newTrack = res;
      const tracks = this.state.tracks;

      tracks[trackIndex] = { playlistId, track: newTrack };

      this.makeOriginalTrackReplacement(originalTrack, newTrackId, playlistId);
      this.setState({
        tracks: tracks,
        isSwitching: false,
        switchingTrackIndex: null
      });
    });
  };

  makeOriginalTrackReplacement = (track, newTrackId, playlistId) => {
    let replacementTracks = JSON.parse(getCookie(`playlist_${playlistId}`));
    replacementTracks = replacementTracks.filter(({ id }) => id !== newTrackId);

    const { name, artists, id } = track;
    replacementTracks.push({
      name,
      artists,
      id
    });

    document.cookie = `playlist_${playlistId}=${JSON.stringify(
      replacementTracks
    )}`;
  };

  showRecommendations = trackIndex => {
    this.setState({
      isSwitching: true,
      switchingTrackIndex: trackIndex
    });
  };

  createTrackItems = tracks => {
    return tracks.map((track, index) => {
      const playlistCookie = getCookie(`playlist_${track.playlistId}`);
      const replacementTracks =
        playlistCookie === "" ? [] : JSON.parse(playlistCookie);

      return (
        <TrackItem
          key={index}
          track={track}
          index={index}
          replacementTracks={replacementTracks}
          onSwitch={this.switchTrack}
          showRecommendations={this.showRecommendations}
          shouldShowRecommendations={this.state.switchingTrackIndex === index}
        />
      );
    });
  };

  addPlaylistToSpotify = () => {
    try {
      addPlaylist({ name: this.state.name, tracks: this.state.tracks });
    } catch (error) {
      this.setState({
        hasError: true,
        error: error
      });
    }

    this.setState({ showOverlay: true });
    setTimeout(() => this.setState({ showOverlay: false }), 5000);
  };

  setPlaylistName = e => {
    const name = e.target.value;
    this.setState({ name: name });
  };

  validateName = e => this.setState({ incorrectName: e.target.value === "" });

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.tracks !== prevState.tracks ||
      nextProps.show !== prevState.show
    ) {
      return { tracks: nextProps.tracks, show: nextProps.show };
    } else {
      return null;
    }
  }

  componentDidUpdate(prevProps) {
    const { show, tracks } = prevProps;

    if (this.state.show !== show || this.state.tracks !== tracks) {
      this.setState({
        tracks: tracks,
        show: show
      });
    }
  }

  render() {
    if (this.state.hasError) {
      throw new Error(this.state.error);
    }

    const trackItems = this.createTrackItems(this.state.tracks);

    let playlistClasses = [styles.playlist];
    if (this.state.show) {
      playlistClasses.push(styles.show);
    }

    let inputClasses = [styles.name];
    let nameErrorClasses = [styles.nameError];
    if (this.state.incorrectName) {
      inputClasses.push(styles.invalid);
      nameErrorClasses.push(styles.showError);
    }

    return (
      <>
        <Overlay
          message="Your new Playlist is now on your Spotify Library! Go check it out."
          show={this.state.showOverlay}
        />
        <div className={playlistClasses.join(" ")}>
          <div className={styles.header}>
            <Header label="Your New Playlist" />
          </div>
          <div>
            <input
              type="text"
              className={inputClasses.join(" ")}
              placeholder="Playlist name"
              onChange={this.setPlaylistName}
              onBlur={this.validateName}
            />
            <div className={nameErrorClasses.join(" ")}>
              Give your Playlist a name
            </div>
          </div>
          <div className={styles.tracks}>{trackItems}</div>
          <div className={styles.button}>
            <Button
              label="Add Playlist to Spotify"
              onClick={this.addPlaylistToSpotify}
            />
          </div>
        </div>
      </>
    );
  }
}
