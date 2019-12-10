import React, { Component } from "react";

import { PlaylistParameter } from "../index";

import styles from "./PlaylistParameterSelector.css";

const params = [
  { name: "acousticness", range: { min: 0.0, max: 1.0 } },
  { name: "danceability", range: { min: 0.0, max: 1.0 } },
  { name: "energy", range: { min: 0.0, max: 1.0 } },
  { name: "instrumentalness", range: { min: 0.0, max: 1.0 } },
  { name: "loudness", range: { min: -60.0, max: 0.0 } },
  { name: "tempo", range: { min: 20, max: 180 } }
];

export class PlaylistParameterSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedParams: [],
      sectionIndex: props.sectionIndex
    };

    this.onParamChange = props.onParamChange;
  }

  handleClick = paramIndex => {
    const selectedParams = [...this.state.selectedParams];
    let param = selectedParams.find(x => x.paramIndex === paramIndex);

    if (param) {
      selectedParams.splice(selectedParams.indexOf(param), 1);
      param.isActive = false;
    } else {
      const newParam = params[paramIndex];

      param = {
        paramIndex,
        name: newParam.name,
        value: newParam.range.min,
        isActive: true
      };
      selectedParams.push(param);
    }

    this.onParamChange(this.state.sectionIndex, param);
    this.setState({ selectedParams: selectedParams });
  };

  handleInput = (paramIndex, value) => {
    const selectedParams = [...this.state.selectedParams];
    const param = selectedParams.find(x => x.paramIndex === paramIndex);

    if (!param) return;

    param.value = value;
    this.onParamChange(this.state.sectionIndex, param);
    this.setState({ selectedParams: selectedParams });
  };

  isElementActive = paramIndex =>
    this.state.selectedParams.find(param => param.paramIndex === paramIndex) !==
    undefined;

  render() {
    const paramItems = params.map((param, index) => (
      <PlaylistParameter
        key={index}
        index={index}
        sectionIndex={this.state.sectionIndex}
        range={param.range}
        onInput={this.handleInput}
        onClick={this.handleClick}
        isActive={this.isElementActive(index)}
      >
        {param.name}
      </PlaylistParameter>
    ));

    return <div className={styles.selector}>{paramItems}</div>;
  }
}
