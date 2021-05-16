import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import App2 from './App2';

import './styles/global.scss';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path="/" component={App} exact={true} />
        <Route path="/app2" component={App2} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

