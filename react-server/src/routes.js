import React from 'react';
import { Router, Route } from 'react-router';

import App from './components/App.js';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={App} />
  </Router>
);

export default Routes;
