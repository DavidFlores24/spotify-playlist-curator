import React from "react";

import classes from "./trackItem.css";

export const trackItem = props => {
	return <div className={classes.item}>{props.name}</div>;
};
