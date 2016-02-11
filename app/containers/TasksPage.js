import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MainSection from '../components/MainSection';
import * as TasksActions from '../actions/tasks';
import * as AuthActions from '../actions/auth';

class TasksApp extends Component {
  static propTypes = {
    tasks: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  render() {
    const { tasks, dispatch } = this.props;
    const boundActionCreators = bindActionCreators({
      ...AuthActions,
      ...TasksActions
    }, dispatch);

    return (
      <div>
        <MainSection tasks={tasks} {...boundActionCreators} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tasks: state.tasks
  };
}

export default connect(mapStateToProps)(TasksApp);
