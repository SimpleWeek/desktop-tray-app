import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AuthActions from '../actions/auth';

class LoginPage extends Component {
  static propTypes = {
    isLoginFetching: PropTypes.bool.isRequired,
    loginAsync: PropTypes.func.isRequired
  };

  state = {
    emailOrLogin: null,
    password: null
  };

  handleSubmit(event) {
    event.preventDefault();

    this.props.loginAsync(this.state.emailOrLogin, this.state.password);
  }

  linkState(prop) {
    return {
      value: this.state[prop],
      requestChange: (value) => this.setState({ [prop]: value })
    };
  }

  render() {
    const { isLoginFetching } = this.props;

    return (
      <div>
        {isLoginFetching && 'Logging in...'}
        <form className="loginForm" onSubmit={(evt) => this.handleSubmit(evt)}>
          <input
            className="loginData"
            type="text"
            name="emailOrLogin"
            placeholder="Email or login"
            valueLink={this.linkState('emailOrLogin')}
          />
          <input
            className="loginData"
            type="password"
            name="password"
            placeholder="Password"
            valueLink={this.linkState('password')}
          />
          <button disabled={isLoginFetching}>Login</button>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state.auth;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AuthActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
