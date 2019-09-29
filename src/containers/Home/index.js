import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { parse } from "qs";

export class Home extends Component {
  constructor() {
    super();
    this.saveToken();
  }

  saveToken = () => {
    let queryParams = parse(window.location.hash.substring(1), {
      ignoreQueryPrefix: true
    });

    const { access_token } = queryParams;
    document.cookie = `token=${access_token}`;

    //TODO: add expired in #cba doing it right now
  };

  render() {
    return (
      <>
        <h1>Authorised Spotify!</h1>
        <NavLink to="/create-playlist" exact={true}>
          Create Playlist
        </NavLink>
      </>
    );
  }
}
