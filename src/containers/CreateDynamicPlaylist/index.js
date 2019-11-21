import React, { Component } from "react";

import {
  Button,
  Header,
  PlaylistSelector,
  PlaylistSection
} from "../../components";

import styles from "./DynamicPlaylist.css";

export class CreateDynamicPlaylist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeStep: "sections",

      playlistSections: [
        {
          sectionIndex: 0,
          duration: 0,
          params: []
        }
      ]
    };
  }

  handleDurationChange = (sectionIndex, value) => {
    const playlistSections = [...this.state.playlistSections];
    const section = playlistSections.find(
      playlistSection => playlistSection.sectionIndex === sectionIndex
    );

    section.duration = value;
    this.setState({ playlistSections: playlistSections });
  };

  handleParamChange = (sectionIndex, param) => {
    const playlistSections = [...this.state.playlistSections];
    const section = playlistSections.find(
      playlistSection => playlistSection.sectionIndex === sectionIndex
    );

    if (!section) return;

    const { params } = section;
    const { name, value, isActive } = param;
    const existingParam = params.find(x => x.name === name);

    if (!isActive) {
      params.splice(params.indexOf(existingParam));
    } else {
      if (existingParam) {
        existingParam.value = value;
      } else {
        params.push(param);
      }
    }

    this.setState({ playlistSections: playlistSections });
  };

  addNewSection = () => {
    const sections = [...this.state.playlistSections];
    sections.push({
      sectionIndex: sections.length + 1,
      duration: 0,
      params: []
    });

    this.setState({ playlistSections: sections });
  };

  render() {
    const sectionItems = this.state.playlistSections.map((section, index) => (
      <PlaylistSection
        key={index}
        index={index}
        onDurationChange={this.handleDurationChange}
        onParamChange={this.handleParamChange}
      />
    ));

    return (
      <div className={styles.page}>
        <div className={styles.sections}>{sectionItems}</div>
        <div className={styles.buttons}>
          <Button label="Add New Section" onClick={this.addNewSection} />
        </div>
      </div>
    );
  }
}
