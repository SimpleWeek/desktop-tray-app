import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MainSection from '../components/MainSection';
import * as TasksActions from '../actions/tasks';

class TasksApp extends Component {
  static propTypes = {
    tasks: PropTypes.object.isRequired
  };

  render() {
    const { tasks, dispatch } = this.props;
    let boundActionCreators = bindActionCreators(TasksActions, dispatch);

    return (
      <div>
        <MainSection tasks={tasks} {...boundActionCreators} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    tasks: state.tasks
  };
}

export default connect(mapStateToProps)(TasksApp);
