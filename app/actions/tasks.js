import {
  ADD_TASK,
  DELETE_TASK,
  DELETE_TASK_REQUEST,
  DELETE_TASK_SUCCESS,
  DELETE_TASK_FAILED,
  EDIT_TASK,
  CHANGE_TASK_STATUS,
  INVALIDATE_TASKS,
  REQUEST_TASKS,
  REQUEST_TASKS_SUCCESS,
  REQUEST_TASKS_FAILED,
  UPDATE_TASK_REQUEST,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_FAILED,
  UPDATE_SCHEDULE,
  CALL_API
} from '../constants/ActionTypes';
import { STATUS_COMPLETED } from '../constants/TaskStatuses';
import { doPut, doGet, doDelete } from '../utils/apiUtils';
import { getTimeToSchedule } from '../utils/time';
import moment from 'moment-timezone';
import { showNotification } from '../utils/notifications';
import _ from 'lodash';

export function addTask(text) {
  return { type: ADD_TASK, text };
}

export function deleteTaskItem(id) {
  return {
    type: DELETE_TASK,
    payload: id
  };
}

export function deleteTask(id) {
  return (dispatch, getState) => {
    dispatch(deleteTaskItem(id));
    dispatch({
      type: CALL_API,
      statuses: [DELETE_TASK_REQUEST, DELETE_TASK_SUCCESS, DELETE_TASK_FAILED],
      doApiCall: (accessToken) => {
        return doDelete(`/api/todos/${id}`, accessToken)
          .then((response) => {
            dispatch(scheduleTasks(getState().tasks.items));
            return response;
          });
      }
    });
  };
}

export function editTask(id, text) {
  return { type: EDIT_TASK, id, text };
}

export function changeStatus(id) {
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

function updateSchedule(taskScheduleMap) {
  return {
    type: UPDATE_SCHEDULE,
    payload: taskScheduleMap
  };
}

export function scheduleTasks(tasks) {
  return (dispatch, getState) => {
    let taskScheduleMap = getState().tasks.schedule;
    // clear all timeout IDs
    _.forOwn(taskScheduleMap, (scheduleData) => {
      clearTimeout(scheduleData.timeoutId);
    });
    taskScheduleMap = {};

    tasks.forEach(function (task) {
      if (task.status === STATUS_COMPLETED) {
        return;
      }
      const time = getTimeToSchedule(task.text);
      if (time) {
        const deltaSeconds = moment(time, 'HH:mm').unix() - moment().unix();

        if (deltaSeconds >= 0) {
          const timeoutId = setTimeout(() => showNotification('Reminder', task.text), deltaSeconds * 1000);

          taskScheduleMap[task.id] = {
            timeoutId,
            scheduledFor: time
          };
        }
      }
    });

    return dispatch(updateSchedule(taskScheduleMap));
  };
}

function fetchTasks() {
  return dispatch => {
    dispatch({
      type: CALL_API,
      statuses: [REQUEST_TASKS, REQUEST_TASKS_SUCCESS, REQUEST_TASKS_FAILED],
      doApiCall: (accessToken) => {
        return doGet('/api/todos', { day: 'today' }, accessToken)
          .then((tasks) => {
            dispatch(scheduleTasks(tasks));
            return tasks;
          });
      }
    });
  };
}

export function shouldFetchTasks(state) {
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
  return (dispatch, getState) => {
    dispatch({
      type: CALL_API,
      statuses: [UPDATE_TASK_REQUEST, UPDATE_TASK_SUCCESS, UPDATE_TASK_FAILED],
      doApiCall: (accessToken) => {
        var url = `/api/todos/${ task.id }`;
        return doPut(url, task, accessToken).
          then(response => {
            dispatch(scheduleTasks(getState().tasks.items));
            return response;
          });
      }
    });
  };
}
