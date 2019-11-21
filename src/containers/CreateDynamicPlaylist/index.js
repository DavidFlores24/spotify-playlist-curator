import React, { Component } from "react";

import {
  Header,
  PlaylistSelector,
  PlaylistParameterSelector
} from "../../components";

import styles from "./DynamicPlaylist.css";

export class CreateDynamicPlaylist extends Component {
  render() {
    return (
      <div className={styles.page}>
        <div className={styles.selector}>
          <div className={styles.header}>
            <Header label="Select your Playlists to inspire the Curator" />
          </div>

          <h3>How long should the playlist last?</h3>

          <div className={styles.duration} id="durationSlider">
            <input type="range" min="10" max="120" className={styles.slider} />
          </div>
          <div id="durationSpan"></div>
          <span>minutes</span>
        </div>
        <PlaylistParameterSelector />
        {/* <PlaylistSelector playlists={} onToggle={} />
        <div className={styles.button}>
          <Button
            onClick={}
            label="Create new Playlist"
            hasError={}
          />
        </div> */}
      </div>
    );
  }
}
