import React from 'react';
import ReactDOM from 'react-dom';
// import { browserHistory } from 'react-router';

import App from './components/App.js';

// import Routes from './routes';
//
// // import './index.css';
//
// ReactDOM.render(
//   <Routes history={browserHistory} />,
//   document.getElementById('root')
// );
const root = document.getElementById('root')
const appDiv = document.getElementById('app')

console.log(appDiv)
ReactDOM.render(<App />, appDiv);
