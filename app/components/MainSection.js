import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import Header from './Header';
import Footer from './Footer';

class MainSection extends Component {
  static propTypes = {
    addTask: PropTypes.func.isRequired,
    deleteTask: PropTypes.func.isRequired,
    editTask: PropTypes.func.isRequired,
    toggleTaskStasus: PropTypes.func.isRequired,
    invalidateTasks: PropTypes.func.isRequired,
    fetchTasksIfNeeded: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
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
    const liClassNames = cx('todo-view', 'draggable', {
      recurring: task.recurring
    });
    const pClassNames = cx('todo-text', {
      through: task.status === 2,
      'repeat_week': task.recurring
    });

    let text = task.transformedText;

    if (task.recurring && task.parentRecurringId > 0) {
      text = task.parentRecurring.transformedText;
    }

    return (
      <li key={task.id}
        onClick={() => toggleTaskStasus(task.id)}
        className={liClassNames}
      >
        <div className="todo-wrapper">
          <div className="text-wrap long">
            <p className={pClassNames} dangerouslySetInnerHTML={{ __html: text }}/>
          </div>
          {task.description && <span className="description-dott">·</span>}
        </div>
      </li>
    );
  }

  render() {
    const { tasks } = this.props;
    return (
      <div>
        <Header isFetching={tasks.isFetching}
          onLogout={this.props.logout}
          onRefreshClick={(e) => this.handleRefreshClick(e)}
        />
        <div className="content-calendar">
          <div className="top-wrap">
            <div id="calendar" className="calendar-scroll-wrap clear-fix">
              <section className="current">
                <div className="list-todo">
                  <ul>
                    {tasks.items.map(this.renderTask.bind(this))}
                  </ul>
                </div>
                <div className="rules"></div>
              </section>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default MainSection;
