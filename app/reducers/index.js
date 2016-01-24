import { combineReducers } from 'redux';
import counter from './counter';
import tasks from './tasks';
import auth from './auth';
import { routeReducer } from 'redux-simple-router';

const rootReducer = combineReducers({
  routing: routeReducer,
  counter,
  tasks,
  auth
});

export default rootReducer;
