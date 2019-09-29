import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import { Home } from "./containers/Home";
import { Login } from "./containers/Login";
import { CreatePlaylist } from "./containers/CreatePlaylist";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/home" component={Home} />
          <Route path="/create-playlist" component={CreatePlaylist} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
