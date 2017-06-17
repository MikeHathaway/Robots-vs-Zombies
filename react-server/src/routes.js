import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import App from './components/App.js';
import Chat from './components/Chat.js';


const Routes = (props) => (
  <BrowserRouter {...props}>
    <div>
      <Route path="/" component={App} />
      <Route path="/chat" component={Chat} />
    </div>  
  </BrowserRouter>
);

export default Routes;
