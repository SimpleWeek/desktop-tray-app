import { BACKEND_BASE_URL } from '../config';
import { CALL_API } from '../constants/ActionTypes';

const api = store => next => action => {
    if (action.type !== CALL_API) {
      return next(action);
    }

    const token = store.getState().auth.token;
    const { doApiCall } = action;
    const [ REQUEST, SUCCESS, FAILED ] = action.statuses;

    next({ type: REQUEST });

    doApiCall(token && token).then((responseData) => {
      next({ type: SUCCESS, payload: responseData });
    }).catch((error) => {
      next({ type: FAILED, payload: error });

      if (error.statusCode && error.statusCode === 401) {
        console.log('401 error -> error=', error);
        //next(showFlashError({ident: 'login', text: error.message}));
        //next(unexpectedLogout());
      } else if (action.reportErrorToFlash) {
        console.log('report error to flash error=', error);
        //next(showFlashError({ident: FAILED, text: error.message}));
      }
    });
};

export default api;
