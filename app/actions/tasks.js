import * as types from '../constants/ActionTypes'
import { BACKEND_BASE_URL } from '../config'

export function addTask(text) {
  return { type: types.ADD_TASK, text }
}

export function deleteTask(id) {
  return { type: types.DELETE_TASK, id }
}

export function editTask(id, text) {
  return { type: types.EDIT_TASK, id, text }
}

function changeStatus(id) {
  return { type: types.CHANGE_TASK_STATUS, id }
}


export function toggleTaskStasus(id) {
  return (dispatch, getState) => {
    dispatch(changeStatus(id));
    let task = getState().tasks.items.find(loopTask => loopTask.id === id);

    return dispatch(updateTask(task));
  }
}

export function invalidateTasks() {
  return {
    type: types.INVALIDATE_TASKS
  }
}

function requestTasks() {
  return {
    type: types.REQUEST_TASKS
  }
}

function receiveTasks(json) {
  return {
    type: types.RECEIVE_TASKS,
    items: json,
    fetchedAt: Date.now()
  }
}

function fetchTasks() {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;

    dispatch(requestTasks());

    return fetch(`${BACKEND_BASE_URL}/api/todos.json?day=today&access_token=${token}`)
      .then(response => response.json())
      .then(json => dispatch(receiveTasks(json)))
  }
}

function shouldFetchTasks(state) {
  const fetchedAt = state.fetchedAt;

  if (!fetchedAt) {
    return true;
  } else if (state.isFetching) {
    return false;
  } else {
    return posts.didInvalidate;
  }
}

export function fetchTasksIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchTasks(getState())) {
      return dispatch(fetchTasks());
    }
  }
}

export function updateTask(task) {
  return (dispatch, getState) => {
    const token = getState().auth.token;

    return fetch(BACKEND_BASE_URL + '/api/todos/' + task.id + '?access_token=' + token, {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(task)
    }).then(response => {
      console.log('response=', response);
      return response.json();
    }).then(jsonResponse => {
      console.log('json response=', jsonResponse);
    });
  }
}
