import React from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom';

import App from './components/App.js';
import Chat from './components/Chat.js';
import User from './components/User.js';


const Routes = (props) => (
  <BrowserRouter {...props}>
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/chat" component={Chat} />
      <Route path="/game" component={Game} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
