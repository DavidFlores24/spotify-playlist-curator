import React, { Component } from "react";

import { getFromSpotify, getCookie } from "../../utils";

export class CreatePlaylist extends Component {
  constructor() {
    super();

    this.state = {
      playlists: []
    };

    this.getPlaylists().then(playlists =>
      this.setState({ playlists: playlists })
    );
  }

  async getPlaylists() {
    const token = getCookie("token");
    const header = {
      Authorization: `Bearer ${token}`
    };
    return getFromSpotify("me/playlists", header).then(res => {
      return res.items;
    });
  }

  render() {
    const playlists = this.state.playlists.map((playlist, index) => {
      return <li key={index}>{playlist.name}</li>;
    });

    return (
      <>
        <h1>Got the Playlists!</h1>
        <ul>{playlists}</ul>
      </>
    );
  }
}
