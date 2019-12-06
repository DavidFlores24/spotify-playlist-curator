import React from "react";

import { Slider } from '../index';

import styles from "./PlaylistParameter.css";

export const PlaylistParameter = props => {
  const classes = [styles.parameter];
  const sliderClasses = [styles.slider];

  if (props.isActive) {
    classes.push(styles.active);
  }

  const sliderStep =
    props.range.min === 0.0 && props.range.max === 1.0 ? 0.1 : 1;

  return (
    <div className={classes.join(" ")}>
      <div className={styles.name} onClick={() => props.onClick(props.index)}>
        {props.children}
      </div>
      <div className={sliderClasses.join(' ')}>
        <Slider
          min={props.range.min}
          max={props.range.max}
          step={sliderStep}
          onInput={e => props.onInput(props.index, e.target.value)}
          id={props.children.toLowerCase()}>
        </Slider>
      </div>
    </div>
  );
};
