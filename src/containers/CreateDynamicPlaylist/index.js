import React, { Component } from "react";

import { getPlaylistsFromSpotify as getPlaylists } from '../../utils/spotifyUtils';
import { generatePlaylistChunk, generateDynamicRecommendations } from '../../utils/dynamicGenerationUtils';

import {
  Button,
  PlaylistSection,
  PlaylistSelector,
  Playlist
} from "../../components";

import styles from "./DynamicPlaylist.css";

export class CreateDynamicPlaylist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeStep: "sections",
      playlistSections: [],
      playlistChunks: [],
      playlists: [],
      selectedPlaylists: [],
      isSelectionInvalid: false,

      newPlaylist: {
        name: '',
        tracks: []
      },
    };

    getPlaylists().then(playlists => this.setState({ playlists: playlists }));

    this.createPlaylist = this.createPlaylist.bind(this);
    this.addRecommendations = this.addRecommendations.bind(this);
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

  goToStep = step => {console.log(`going to ${step}`); this.setState({ activeStep: step })};
  
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
    let chunks = [];

    for (let i = 0; i < sections.length; i++) {
      const includedTracks = chunks.map(chunk => chunk.tracks.map(track => track.id)).flat();

      const section = sections[i];
      const { duration, params } = section;

      const chunk = await generatePlaylistChunk(duration * 60000, i, this.state.selectedPlaylists, params, includedTracks);
      chunks.push(chunk);
    }

    const tracks = chunks.map(chunk => chunk.tracks).flat();
    const newPlaylist = {...this.state.newPlaylist};
    newPlaylist.tracks = tracks

    this.setState({ playlistChunks: chunks, newPlaylist: newPlaylist });
    await this.addRecommendations();
    this.goToStep('playlist-review');
  }

  async addRecommendations() {
    const chunks = [...this.state.playlistChunks];
    const newPlaylist = { ...this.state.newPlaylist };
    const { tracks } = newPlaylist;

    for(const track of tracks) {
      const chunk = chunks.find(chunk => chunk.tracks.includes(track));
      track.replacementId = chunk.sectionIndex;

      if(!chunk.recommendations) {
        const playlistSections = [...this.state.playlistSections];
        const { params } = playlistSections[chunk.sectionIndex];

        const recommendations = await generateDynamicRecommendations(chunk.tracks, track.duration_ms, params);
        recommendations.forEach(recommendation => recommendation.replacementId = chunk.sectionIndex);
        chunk.recommendations = { id: chunk.sectionIndex, tracks: recommendations };
      }
    }

    this.setState({ playlistChunks: chunks, newPlaylist: newPlaylist });
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

    const recommendations = this.state.playlistChunks.map(chunk => chunk.recommendations)
      .filter(recommendation => recommendation);
    const replacementTracks = recommendations.map(recommendation => recommendation.tracks).flat();

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
        {
          this.state.activeStep === 'playlist-review' &&
          <div className={styles.newPlaylist}>
            <Playlist tracks={this.state.newPlaylist.tracks } replacementTracks={replacementTracks} show/>
          </div>
        }
      </div>
    );
  }
}
