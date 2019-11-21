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
      selectedParams: []
    };
  }

  handleClick = paramIndex => {
    const selectedParams = this.state.selectedParams;

    if (selectedParams.find(x => x.paramIndex === paramIndex)) {
      selectedParams.splice(paramIndex);
    } else {
      const param = params[paramIndex];

      selectedParams.push({
        paramIndex,
        name: param.name,
        value: param.range.min
      });
    }

    this.setState({ selectedParams: selectedParams });
  };

  handleInput = (paramIndex, value) => {
    const selectedParams = [...this.state.selectedParams];
    const param = selectedParams.find(x => x.paramIndex === paramIndex);

    if (!param) return;

    param.value = value;
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
        range={param.range}
        onInput={this.handleInput}
        onClick={this.handleClick}
        isActive={this.isElementActive(index)}
      >
        {param.name}
      </PlaylistParameter>
    ));

    return <div>{paramItems}</div>;
  }
}
