import React from 'react';

import styles from './button.css';

export const button = props => {
    return (
        <a
            className={styles.button}
            onClick={props.onClick}
            href={props.href}>
            {props.label}
        </a>
    )
}