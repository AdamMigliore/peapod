/*
 * Copyright (C) 2020 Alix Routhier-Lalonde, Adam Di Re, Ricky Liu
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { BrowserRouter, Route, Switch } from "react-router-dom";
import './App.css';
import { Login } from "./subpages/Login";
import {Dashboard} from "./subpages/Dashboard"
import {NotFoundPage} from "./subpages/NotFoundPage"

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/login" exact component={Login} />
        <Route component={NotFoundPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
