import React from "react";

import { Button } from "../index";

import styles from "./errorOverlay.css";

export const errorOverlay = props => {
  let overlayClasses = [styles.overlay];

  if (props.show) {
    overlayClasses.push(styles.show);
  }

  return (
    <div className={overlayClasses.join(" ")}>
      <div className={styles.modal}>
        <h3>Oops! Something went wrong</h3>
        <div className={styles.message}>{props.message}</div>
        <div className={styles.button}>
          <Button label={"Dismiss"} onClick={props.dismiss} />
        </div>
      </div>
    </div>
  );
};
