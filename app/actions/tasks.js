import {
  ADD_TASK,
  DELETE_TASK,
  EDIT_TASK,
  CHANGE_TASK_STATUS,
  INVALIDATE_TASKS,
  REQUEST_TASKS,
  REQUEST_TASKS_SUCCESS,
  REQUEST_TASKS_FAILED,
  UPDATE_TASK_REQUEST,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_FAILED,
  CALL_API
} from '../constants/ActionTypes';
import { BACKEND_BASE_URL } from '../config';
import { doPut, doGet } from '../utils/apiUtils';

export function addTask(text) {
  return { type: ADD_TASK, text };
}

export function deleteTask(id) {
  return { type: DELETE_TASK, id };
}

export function editTask(id, text) {
  return { type: EDIT_TASK, id, text };
}

function changeStatus(id) {
  return { type: CHANGE_TASK_STATUS, id };
}

export function toggleTaskStasus(id) {
  return (dispatch, getState) => {
    dispatch(changeStatus(id));
    const task = getState().tasks.items.find(loopTask => loopTask.id === id);

    return dispatch(updateTask(task));
  };
}

export function invalidateTasks() {
  return {
    type: INVALIDATE_TASKS
  };
}

function fetchTasks() {
  return {
    type: CALL_API,
    statuses: [REQUEST_TASKS, REQUEST_TASKS_SUCCESS, REQUEST_TASKS_FAILED],
    doApiCall: (accessToken) => {
      return doGet('/api/todos', { day: 'today' }, accessToken)
    }
  }
}

function shouldFetchTasks(state) {
  const fetchedAt = state.fetchedAt;

  if (!fetchedAt) {
    return true;
  } else if (state.isFetching) {
    return false;
  }

  return state.didInvalidate;
}

export function fetchTasksIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchTasks(getState())) {
      return dispatch(fetchTasks());
    }
  };
}

export function updateTask(task) {
  return {
    type: CALL_API,
    statuses: [UPDATE_TASK_REQUEST, UPDATE_TASK_SUCCESS, UPDATE_TASK_FAILED],
    doApiCall: (accessToken) => {
      var url = `/api/todos/${ task.id }`;
      return doPut(url, task, accessToken);
    }
  }
}
