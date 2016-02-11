import * as types from '../constants/ActionTypes';

const defaultAuth = { isLoginFetching: false, isLogoutFetching: false, token: null };

export default function auth(state = defaultAuth, action) {
  switch (action.type) {
    case types.LOGIN_REQUEST:
      return { ...defaultAuth, isLoginFetching: true };
    case types.LOGIN_SUCCESS:
      return { ...defaultAuth, token: action.token };
    case types.LOGIN_FAILED:
      return defaultAuth;
    case types.LOGOUT_REQUEST:
      return { ...state, token: null };
    case types.LOGOUT_SUCCESS:
      return defaultAuth;
    case types.LOGOUT_FAILED:
      return { ...state, isLogoutFetching: false };
    default:
      return state;
  }
}
