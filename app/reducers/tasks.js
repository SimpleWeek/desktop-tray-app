import * as types from '../constants/ActionTypes';
import { STATUS_ACTIVE, STATUS_COMPLETED } from '../constants/TaskStatuses';

const initialState = {
  fetchedAt: undefined,
  isFetching: false,
  didInvalidate: false,
  items: [],
  schedule: {}
};

export default function tasks(state = initialState, action) {
  switch (action.type) {
    case types.ADD_TASK:
      return Object.assign({}, state, {
        items: [
          {
            id: 999,
            status: 1,
            text: action.text
          },
          ...state
        ]
      });

    case types.DELETE_TASK:
      return Object.assign({}, state, {
        items: state.items.filter(todo =>
          todo.id !== action.payload
        )
      });

    case types.EDIT_TASK:
      return Object.assign({}, state, {
        items: state.items.map(todo =>
          todo.id === action.id ?
            Object.assign({}, todo, { text: action.text }) :
            todo
          )
      });

    case types.CHANGE_TASK_STATUS:
      return Object.assign({}, state, {
        items: state.items.map(todo => {
          if (todo.id !== action.id) {
            return todo;
          }
          return Object.assign({}, todo, {
            status: todo.status === STATUS_ACTIVE ? STATUS_COMPLETED : STATUS_ACTIVE
          });
        })
      });

    case types.REQUEST_TASKS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      });

    case types.REQUEST_TASKS_SUCCESS:
      return Object.assign({}, state, {
        items: action.payload,
        fetchedAt: action.receivedAt,
        isFetching: false,
        didInvalidate: false
      });

    case types.INVALIDATE_TASKS:
      return Object.assign({}, state, {
        didInvalidate: true
      });

    case types.LOGOUT_REQUEST:
      return Object.assign({}, state, {
        items: [],
        fetchedAt: undefined
      });

    case types.UPDATE_SCHEDULE:
      return Object.assign({}, state, {
        schedule: action.payload
      });

    default:
      return state;
  }
}
