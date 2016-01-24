import * as types from '../constants/ActionTypes'

const initialState = {
  fetchedAt: undefined,
  isFetching: false,
  didInvalidate: false,
  items: [{id: 1, text: 'test task from reducer', status: 1}]
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
          todo.id !== action.id
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
            status: todo.status === 1 ? 2 : 1
          });
        })
      });

    case types.REQUEST_TASKS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      });

    case types.RECEIVE_TASKS:
      return Object.assign({}, state, {
        items: action.items,
        fetchedAt: action.fetchedAt,
        isFetching: false,
        didInvalidate: false
      });

    case types.INVALIDATE_TASKS:
      return Object.assign({}, state, {
        didInvalidate: true
      });

    default:
      return state
  }
}
