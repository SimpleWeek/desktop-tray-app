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
      <div className="acc-menu open">
        <form className="fos_user_profile_edit" onSubmit={(evt) => this.handleSubmit(evt)}>
          <div className="form-row">
            <div className="username">
              <input
                className="username"
                type="text"
                name="emailOrLogin"
                placeholder="Email or login"
                valueLink={this.linkState('emailOrLogin')}
              />
            </div>
            <div className="email">
              <input
                className="email"
                type="password"
                name="password"
                placeholder="Password"
                valueLink={this.linkState('password')}
              />
            </div>
          </div>
          <button className="btn-save" disabled={isLoginFetching}>Login{isLoginFetching && '...'}</button>
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
