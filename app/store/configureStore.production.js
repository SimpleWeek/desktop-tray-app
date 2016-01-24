import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import createHashHistory from 'history/lib/createHashHistory';
import { syncHistory } from 'redux-simple-router';

const history = createHashHistory();
const reduxRouterMiddleware = syncHistory(history);


const finalCreateStore = compose(
  applyMiddleware(thunk, reduxRouterMiddleware)
)(createStore);

export default function configureStore(initialState) {
  return finalCreateStore(rootReducer, initialState);
}
