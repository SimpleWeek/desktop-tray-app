import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import configureStore from './store/configureStore';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import TasksPage from './containers/TasksPage';
import LoginPage from './containers/LoginPage';
import './app.css';

const store = configureStore();

function requireAuth(nextState, replaceState) {
  const state = store.getState();
  const isLoggedIn = Boolean(state.auth.token);

  if (!isLoggedIn) {
    replaceState({
      nextPathname: nextState.location.pathname
    }, '/login');
  }
}

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="/login" component={LoginPage} />
    <Route path="/counter" component={CounterPage} />
    <Route path="/tasks" component={TasksPage} onEnter={requireAuth} />
  </Route>
);

render(
  <Provider store={store}>
    <Router>
      {routes}
    </Router>
  </Provider>,
  document.getElementById('root')
);

if (process.env.NODE_ENV !== 'production') {
  // Use require because imports can't be conditional.
  // In production, you should ensure process.env.NODE_ENV
  // is envified so that Uglify can eliminate this
  // module and its dependencies as dead code.
  // require('./createDevToolsWindow')(store);
}
