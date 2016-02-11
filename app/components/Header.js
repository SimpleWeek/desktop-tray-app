import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

export default class Header extends Component {
  static propTypes = {
    onLogout: PropTypes.func.isRequired,
    onRefreshClick: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired
  };

  render() {
    const { isFetching } = this.props;
    const classes = cx('fa fa-refresh', {
      'fa-spin': isFetching
    });

    return (
      <header>
          <ul className="right-icons">
            <li onClick={this.props.onRefreshClick} ><i className={classes}></i></li>
            <li><i className="fa fa-cog"></i></li>
            <li onClick={this.props.onLogout} ><i className="fa fa-sign-out"></i></li>
          </ul>
          <ul className="header-menu">
            <li className="version">SimpleWeek</li>
          </ul>
      </header>
    );
  }
}
