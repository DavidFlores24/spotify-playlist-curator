import React from "react";

import styles from "./button.css";

export const button = props => {
  const classes = [styles.button];
  if (props.hasError) {
    classes.push(styles.error);
  }

  return (
    <a className={classes.join(" ")} onClick={props.onClick} href={props.href}>
      {props.label}
    </a>
  );
};
