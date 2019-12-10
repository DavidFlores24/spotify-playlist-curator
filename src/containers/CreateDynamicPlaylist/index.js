import React, { Component } from "react";

import { getPlaylistsFromSpotify as getPlaylists } from '../../utils/spotifyUtils';
import { generatePlaylistChunk } from '../../utils/dynamicGenerationUtils';

import {
  Button,
  PlaylistSection,
  PlaylistSelector
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
      ],

      playlists: [],
      selectedPlaylists: [],

      isSelectionInvalid: false
    };

    getPlaylists().then(playlists => this.setState({ playlists: playlists }));

    this.createPlaylist = this.createPlaylist.bind(this);
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
      params.splice(params.indexOf(existingParam), 1);
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
      sectionIndex: sections.length,
      duration: 0,
      params: []
    });

    this.setState({ playlistSections: sections });
  };

  removeSection = () => {
    const sections = [...this.state.playlistSections];
    sections.pop();
    this.setState({ playlistSections: sections });
  }

  goToStep = step =>
    this.setState({ activeStep: step });
  
  handleToggle = playlistKey => {
    const playlistToAdd = this.state.playlists[playlistKey];

    const toggledPlaylists = this.state.selectedPlaylists;
    toggledPlaylists.push(playlistToAdd);

    this.setState({ selectedPlaylists: toggledPlaylists });
  }

  async createPlaylist() {
    if(this.state.selectedPlaylists.length === 0) {
      this.setState({ isSelectionInvalid: false });
      return;
    }

    const sections = [...this.state.playlistSections];
    sections.map(section => {
      const { duration, params } = section;
      generatePlaylistChunk(duration, this.state.selectedPlaylists, params);
    });
  }

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
        { 
          this.state.activeStep === 'sections' &&
          <div className={styles.sections}>
            {sectionItems}
            <div className={styles.buttons}>
              <div className={styles.button}>
                <Button label="Add New Section" onClick={this.addNewSection} />
              </div>
              <div className={styles.button}>
                <Button label='Remove Section' onClick={this.removeSection} />
              </div>
              <div className={styles.createButton}>
                <Button label='Next' onClick={() => this.goToStep('playlists')} />
              </div>
            </div>
          </div>
        }
        { 
          this.state.activeStep === 'playlists' && 
          <div className={styles.playlists}>
            <PlaylistSelector playlists={this.state.playlists} onToggle={this.handleToggle} />
            <div className={styles.newPlaylist}>
              <Button label='Create Playlist' onClick={this.createPlaylist} />
            </div>
          </div>
        }
      </div>
    );
  }
}
