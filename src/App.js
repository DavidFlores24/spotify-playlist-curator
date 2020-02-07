import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import { Home } from "./containers/Home";
import { Login } from "./containers/Login";
import { CreatePlaylist } from "./containers/CreatePlaylist";
import { CreateDynamicPlaylist } from "./containers/CreateDynamicPlaylist";

import styles from "./App.css";

function App() {
  return (
    <div className={styles.app}>
      <BrowserRouter>
        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/create-playlist" component={CreatePlaylist} />
          <Route
            path="/create-dynamic-playlist"
            component={CreateDynamicPlaylist}
          />
          <Route path="/" component={Login} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
