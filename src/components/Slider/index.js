import React from 'react';

import styles from './Slider.css';

export const Slider = props => {
    const { min, max, onInput, id, step } = props;

    const changeValue = newValue => {
        const span = document.querySelector(`#${id} .${styles.text}`);
        span.innerHTML = newValue;
    }

    const handleInput = e => {
        onInput(e);
        changeValue(e.target.value);
    }

    return (
        <div className={styles.slider} id={id}>
            <span>{props.children}</span>
            <input
                type="range"
                min={min}
                max={max}
                step={step || 1.0}
                className={styles.input}
                onInput={e => handleInput(e)}
            />
            <div className={styles.text}></div>
        </div>
    )
}