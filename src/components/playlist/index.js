import React from "react";

import { TrackItem } from "../index";

import styles from "./playlist.css";

export const playlist = props => {
  const tracks = props.tracks.map((track, index) => (
    <TrackItem name={track.name} key={index} />
  ));

  return (
    <>
      <div className={styles.playlist}>
        <input
          type="text"
          className={styles.name}
          placeholder="playlist name"
          onBlur={props.onBlur}
        />
        <div className={styles.tracks}>{tracks}</div>
      </div>
      <div className={styles.button} onClick={props.onClick}>
        Add Playlist to Spotify
      </div>
    </>
  );
};
