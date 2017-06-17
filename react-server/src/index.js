
// import { browserHistory } from 'react-router';
//

//
// // import './index.css';
//


// const root = document.getElementById('root')
// const appDiv = document.getElementById('app')

// console.log(appDiv)
// ReactDOM.render(<App />, root);


import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, browserHistory } from 'react-router-dom'
// import App from './components/App';

import Routes from './routes';


ReactDOM.render(
  <Routes history={browserHistory} />,
  document.getElementById('root')
);


// ReactDOM.render((
//      <BrowserRouter>
//           <Route path="/" component={App}/>
//      </BrowserRouter>
//      ),
//      document.getElementById('root')
// );
