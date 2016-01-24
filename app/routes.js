import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import TasksPage from './containers/TasksPage';
import LoginPage from './containers/LoginPage';
import { store } from './index';

function requireAuth(nextState, replaceState) {
  const state = store.getState();
  const isLoggedIn = Boolean(state.auth.token);

  if (!isLoggedIn) {
    replaceState({
      nextPathname: nextState.location.pathname
    }, '/login')
  }
}

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="/login" component={LoginPage} />
    <Route path="/counter" component={CounterPage} />
    <Route path="/tasks" component={TasksPage} onEnter={requireAuth} />
  </Route>
);
