import { createStore, applyMiddleware, compose } from 'redux';
import { persistState } from 'redux-devtools';
import thunk from 'redux-thunk';
import api from '../middleware/api';
import rootReducer from '../reducers';
import devTools from 'remote-redux-devtools';
import createHashHistory from 'history/lib/createHashHistory';
import { syncHistory } from 'redux-simple-router';

const history = createHashHistory();
const reduxRouterMiddleware = syncHistory(history);

const finalCreateStore = compose(
  applyMiddleware(thunk, reduxRouterMiddleware, api),
  devTools({
    name: 'Electron',
    hostname: 'localhost',
    port: 5678
  }),
  persistState(
    window.location.href.match(
      /[?&]debug_session=([^&]+)\b/
    )
  )
)(createStore);

export default function configureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState);

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers'))
    );
  }

  return store;
}
