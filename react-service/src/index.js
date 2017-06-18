import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router-dom'

import Bootstrap from 'bootstrap/dist/css/bootstrap.min.css'

import Routes from './routes'


ReactDOM.render(
  <Routes history={browserHistory} />,
  document.getElementById('root')
);
