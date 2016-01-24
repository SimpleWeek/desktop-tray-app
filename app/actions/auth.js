import * as types from '../constants/ActionTypes';
import { routeActions } from 'redux-simple-router';
import { OAUTH2_CLIENT_ID, OAUTH2_CLIENT_SECRET, BACKEND_BASE_URL } from '../config';

function loginRequest() {
  return {
    type: types.LOGIN_REQUEST
  };
}

function loginSuccess(authData) {
  return {
    type: types.LOGIN_SUCCESS,
    token: authData.access_token
  };
}

function loginSuccessRedirect(json) {
  return dispatch => {
    dispatch(loginSuccess(json));

    return dispatch(routeActions.push('/tasks'));
  };
}

export function loginAsync(emailOrLogin, password) {
  return dispatch => {
    dispatch(loginRequest());

    var url = BACKEND_BASE_URL + '/oauth/v2/token?client_id=' + OAUTH2_CLIENT_ID + '&client_secret=' + OAUTH2_CLIENT_SECRET + '&grant_type=password&username=' + emailOrLogin + '&password=' + password;

    return fetch(url)
      .then(response => response.json())
      .then(json => dispatch(loginSuccessRedirect(json)));
  };
}
