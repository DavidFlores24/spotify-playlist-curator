import React from "react";

import { PlaylistParameterSelector } from "../index";

import styles from "./PlaylistSection.css";

export const PlaylistSection = props => {
  return (
    <div className={styles.section}>
      <input
        className={styles.slider}
        type="range"
        min="3"
        max="60"
        onInput={e => props.onDurationChange(props.index, e.target.value)}
      />
      <div className={styles.parameters}>
        <PlaylistParameterSelector
          sectionIndex={props.index}
          onParamChange={props.onParamChange}
        />
      </div>
    </div>
  );
};
