/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import { spy } from 'sinon';
import * as actions from '../../app/actions/tasks';
import { CHANGE_TASK_STATUS } from '../../app/constants/ActionTypes';


describe('tasks actions', () => {
  it('changeStatus should create changeStatus action', () => {
    expect(actions.changeStatus(1)).to.deep.equal({ type: CHANGE_TASK_STATUS, id: 1 });
  });

  it('toggleTaskStatus should create changeStatus actionand updateTask action', () => {
    const fn = actions.toggleTaskStasus(2);

    expect(fn).to.be.a('function');

    const dispatch = spy();
    const getState = () => ({ tasks: { items: [{ id: 2 }] } });

    fn(dispatch, getState);

    expect(dispatch.calledWith({ type: CHANGE_TASK_STATUS, id: 2 })).to.be.true;
  });

  it('shouldFetchTasks should fetch task only if it is required', () => {
    let shouldFetch = actions.shouldFetchTasks({ fetchedAt: undefined, isFetching: true, didInvalidate: false });
    expect(shouldFetch).to.be.true;

    shouldFetch = actions.shouldFetchTasks({ fetchedAt: 123123123, isFetching: true, didInvalidate: false });
    expect(shouldFetch).to.be.false;

    shouldFetch = actions.shouldFetchTasks({ fetchedAt: 123123123, isFetching: false, didInvalidate: false });
    expect(shouldFetch).to.be.false;

    shouldFetch = actions.shouldFetchTasks({ fetchedAt: 123123123, isFetching: false, didInvalidate: true });
    expect(shouldFetch).to.be.true;
  });
});
