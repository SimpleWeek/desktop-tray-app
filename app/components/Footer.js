import React, { Component } from 'react';
const electron = require('electron');
const shell = electron.shell;

export default class Footer extends Component {
  openExternal(e, url) {
    e.preventDefault();
    shell.openExternal(url);
  }

  render() {
    return (
      <footer>
        <ul className="soc-list">
          <li><a onClick={(e) => this.openExternal(e, 'http://vk.com/simpleweekapp')} href="http://vk.com/simpleweekapp" className="vk" target="_blank"></a></li>
          <li><a onClick={(e) => this.openExternal(e, 'http://twitter.com/simpleweekapp')} href="http://twitter.com/simpleweekapp" className="tw" target="_blank"></a></li>
        </ul>
        <ul className="footer-menu">
          <li className="version">SimpleWeek v0.14.2</li>
        </ul>
      </footer>
    );
  }
}
