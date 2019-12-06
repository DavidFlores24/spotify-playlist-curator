import React from "react";

import { PlaylistParameterSelector, Slider } from "../index";

import styles from "./PlaylistSection.css";

export const PlaylistSection = props => {
  return (
    <div className={styles.section}>
      <div className={styles.label}>Section Duration</div>
      <div className={styles.durationSlider}>
        <Slider 
          min='3' 
          max='60' 
          onInput={e => props.onDurationChange(props.index, e.target.value)}
          id='duration'>
        </Slider>
      </div>
      <div className={styles.parameters}>
        <PlaylistParameterSelector
          sectionIndex={props.index}
          onParamChange={props.onParamChange}
        />
      </div>
    </div>
  );
};
