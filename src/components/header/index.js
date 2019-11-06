import React from 'react';

import styles from './header.css';

export const header = props => {
    return (
        <div className={styles.header}>{props.label}</div>
    )
}