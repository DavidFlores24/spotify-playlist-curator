import React from "react";

import { PlaylistItem } from "../index";

import styles from "./PlaylistSelector.css";

const sortPlaylists = playlistItems => {
  const one = [];
  const two = [];
  const three = [];

  for (let i = 0; i < playlistItems.length; i++) {
    if (i % 3 === 0) {
      three.push(playlistItems[i]);
    } else if (i % 2 === 0) {
      two.push(playlistItems[i]);
    } else {
      one.push(playlistItems[i]);
    }
  }

  return { one, two, three };
};

export const PlaylistSelector = props => {
  const { playlists, onToggle } = props;
  const playlistItems = playlists.map((playlist, index) => (
    <PlaylistItem
      name={playlist.name}
      key={index}
      onToggle={() => onToggle(index)}
    />
  ));

  const { one, two, three } = sortPlaylists(playlistItems);

  return (
    <div className={styles.selector}>
      <div className={styles.playlists}>
        <div className={styles.column}>{one}</div>
        <div className={styles.column}>{two}</div>
        <div className={styles.column}>{three}</div>
      </div>
    </div>
  );
};
