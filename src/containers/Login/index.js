import React, { Component } from "react";
import "fetch";
import { stringify } from "qs";

import { Button } from '../../components';

import styles from "./login.css";

const client_id = "c53dddffc9054b819be83e2a53a9c148";
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
      <div className={styles.page}>
        <div className={styles.button}>
          <Button onClick={this.requestAuthorisation} label='Connect with Spotify' />
        </div>
      </div>
    );
  }
}
