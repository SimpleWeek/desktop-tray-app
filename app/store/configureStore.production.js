import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import createHashHistory from 'history/lib/createHashHistory';
import { syncHistory } from 'redux-simple-router';
import api from '../middleware/api';

const history = createHashHistory();
const reduxRouterMiddleware = syncHistory(history);

const finalCreateStore = compose(
  applyMiddleware(thunk, reduxRouterMiddleware, api)
)(createStore);

export default function configureStore(initialState) {
  return finalCreateStore(rootReducer, initialState);
}
