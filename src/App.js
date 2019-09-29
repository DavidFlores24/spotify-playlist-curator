import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import { Home } from "./containers/Home";
import { Login } from "./containers/Login";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/home" component={Home} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
