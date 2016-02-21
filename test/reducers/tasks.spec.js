import { expect } from 'chai';
import tasks from '../../app/reducers/tasks';
import { DELETE_TASK, CHANGE_TASK_STATUS, REQUEST_TASKS, REQUEST_TASKS_SUCCESS, INVALIDATE_TASKS, LOGOUT_REQUEST } from '../../app/constants/ActionTypes';

describe('reducers', () => {
  describe('tasks', () => {
    const defaultState = {
      fetchedAt: undefined,
      isFetching: false,
      didInvalidate: false,
      items: [],
      schedule: {}
    };

    it('should handle initial state', () => {
      expect(tasks(undefined, {})).to.eql(Object.assign({}, defaultState, {
        fetchedAt: undefined,
        isFetching: false,
        didInvalidate: false,
        items: []
      }));
    });

    it('should handle DELETE_TASK', () => {
      const state = Object.assign({}, defaultState, {
        fetchedAt: undefined,
        isFetching: false,
        didInvalidate: false,
        items: [{ id: 1 }, { id: 2 }]
      });

      expect(tasks(state, { type: DELETE_TASK, id: 1 })).to.eql(Object.assign({}, defaultState, {
        fetchedAt: undefined,
        isFetching: false,
        didInvalidate: false,
        items: [{ id: 2 }]
      }));
    });

    it('should handle CHANGE_TASK_STATUS', () => {
      const state = Object.assign({}, defaultState, {
        fetchedAt: undefined,
        isFetching: false,
        didInvalidate: false,
        items: [{ id: 1, status: 1 }]
      });

      var resultState = tasks(state, { type: CHANGE_TASK_STATUS, id: 1 });

      expect(resultState).to.eql(Object.assign({}, defaultState, {
        fetchedAt: undefined,
        isFetching: false,
        didInvalidate: false,
        items: [{ id: 1, status: 2 }]
      }));

      resultState = tasks(resultState, { type: CHANGE_TASK_STATUS, id: 1 });

      expect(resultState).to.eql(Object.assign({}, defaultState, {
        fetchedAt: undefined,
        isFetching: false,
        didInvalidate: false,
        items: [{ id: 1, status: 1 }]
      }));
    });

    it('should handle INVALIDATE_TASKS', () => {
      const state = Object.assign({}, defaultState, {
        fetchedAt: 123,
        isFetching: false,
        didInvalidate: false,
        items: [{ id: 1, status: 1 }]
      });

      expect(tasks(state, { type: INVALIDATE_TASKS })).to.eql(Object.assign({}, defaultState, {
        fetchedAt: 123,
        isFetching: false,
        didInvalidate: true,
        items: [{ id: 1, status: 1 }]
      }));
    });

    it('should handle REQUEST_TASKS', () => {
      const state = Object.assign({}, defaultState, {
        fetchedAt: undefined,
        isFetching: false,
        didInvalidate: false,
        items: [{ id: 1, status: 1 }]
      });

      expect(tasks(state, { type: REQUEST_TASKS })).to.eql(Object.assign({}, defaultState, {
        fetchedAt: undefined,
        isFetching: true,
        didInvalidate: false,
        items: [{ id: 1, status: 1 }]
      }));
    });

    it('should handle REQUEST_TASKS_SUCCESS', () => {
      const state = Object.assign({}, defaultState, {
        fetchedAt: 123,
        isFetching: true,
        didInvalidate: false,
        items: [{ id: 1, status: 1 }]
      });

      const date = Date.now();

      expect(tasks(state, { type: REQUEST_TASKS_SUCCESS, payload: [{ id: 2, status: 2 }], receivedAt: date })).to.eql(Object.assign({}, defaultState, {
        fetchedAt: date,
        isFetching: false,
        didInvalidate: false,
        items: [{ id: 2, status: 2 }]
      }));
    });

    it('should handle LOGOUT_REQUEST', () => {
      const state = Object.assign({}, defaultState, {
        fetchedAt: 123,
        isFetching: false,
        didInvalidate: false,
        items: [{ id: 1, status: 1 }]
      });

      expect(tasks(state, { type: LOGOUT_REQUEST })).to.eql(Object.assign({}, defaultState, {
        fetchedAt: undefined,
        isFetching: false,
        didInvalidate: false,
        items: []
      }));
    });
  });
});
