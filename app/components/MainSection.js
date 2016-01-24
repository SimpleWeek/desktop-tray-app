import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import cx from 'classnames';
import styles from './MainSection.module.css';

class MainSection extends Component {
  static propTypes = {
    addTask: PropTypes.func.isRequired,
    deleteTask: PropTypes.func.isRequired,
    editTask: PropTypes.func.isRequired,
    toggleTaskStasus: PropTypes.func.isRequired,
    invalidateTasks: PropTypes.func.isRequired,
    fetchTasksIfNeeded: PropTypes.func.isRequired,
    tasks: PropTypes.object.isRequired
  };

  componentDidMount() {
    const { fetchTasksIfNeeded } = this.props;
    fetchTasksIfNeeded();
  }

  handleRefreshClick(e) {
    e.preventDefault();

    const { invalidateTasks, fetchTasksIfNeeded } = this.props;
    invalidateTasks();
    fetchTasksIfNeeded();
  }

  renderTask(task) {
    const { toggleTaskStasus } = this.props;
    const classNames = cx({
      [styles.completed]: task.status === 2
    });

    let text = task.transformedText;

    if (task.recurring && task.parentRecurringId > 0) {
      text = task.parentRecurring.transformedText;
    }

    return (
      <li key={task.id}
          onClick={() => toggleTaskStasus(task.id)}
          className={classNames}>
        <div dangerouslySetInnerHTML={{__html: text}} />
      </li>
    );
  }

  render() {
    const { tasks } = this.props;
    return (
      <div>
        <div>
          <Link to="/">
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
        {!tasks.isFetching &&
        <a href='#'
           onClick={this.handleRefreshClick.bind(this)}>
          Refresh
        </a>
        }
        {tasks.isFetching &&
        <h2>Loading...</h2>
        }
        {tasks.items.map(this.renderTask.bind(this))}
      </div>
    );
  }
}

export default MainSection;
