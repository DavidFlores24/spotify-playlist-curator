import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import { Home } from "./containers/Home";
import { Login } from "./containers/Login";
import { CreatePlaylist } from "./containers/CreatePlaylist";

import styles from "./App.css";

function App() {
  return (
    <div className={styles.app}>
      <BrowserRouter>
        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/create-playlist" component={CreatePlaylist} />
          <Route path='/' component={Login} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
