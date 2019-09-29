import React, { Component } from "react";
import "fetch";
import { stringify } from "qs";

import classes from "./login.css";

const client_id = "c53dddffc9054b819be83e2a53a9c148";
const secretKey = "285cd151d5244adc89c0d55bc702bf67";
const redirect_uri = "http://localhost:3000/home";

export class Login extends Component {
  state = {};

  requestAuthorisation = () => {
    const baseUri = "https://accounts.spotify.com/authorize";

    const scope = [
      "playlist-read-collaborative",
      "playlist-modify-private",
      "playlist-modify-public",
      "playlist-read-private"
    ].join(" ");

    const query = {
      client_id,
      response_type: "token",
      redirect_uri,
      scope
    };

    const uri = `${baseUri}?${stringify(query)}`;
    window.location.replace(uri);
  };

  render() {
    return (
      <div className={classes.button} onClick={this.requestAuthorisation}>
        Connect with Spotify
      </div>
    );
  }
}
