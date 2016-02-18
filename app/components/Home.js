import React, { Component } from 'react';
import { Link } from 'react-router';


export default class Home extends Component {
  render() {
    return (
      <div className="padding main-page content-bg scroll-content ionic-scroll scroll-content-false  has-header">
        <div className="logo"></div>
        <div className="slogan">
          <p>Personal task manager</p>
        </div>
        <Link className="button button-block button-stable" to="/tasks">Sign In</Link>
        <Link className="button button-block button-stable" to="/login">Sign Up</Link>
      </div>
    );
  }
}
