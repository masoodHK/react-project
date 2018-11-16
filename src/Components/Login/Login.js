import React, { Component } from "react";
import Button from "../Button";
import firebase from "../../config/firebase";
import { connect } from "react-redux";
import { authActions } from "../../store/actions";

class Login extends Component {
  login = () => {
    firebase
      .auth()
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(data => {
        console.log(data, this.props.history);
        this.props.updateUser(data.user);
        this.props.history.push("/dashboard");
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    console.log(this.props);
    return (
      <div className="Login">
        <h1>Login</h1>
        <Button className="Facebook" onClick={this.login}>
          Login via Facebook
        </Button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log(state.userReducer);
  return {
    user: state.userReducer.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateUser: user => dispatch(authActions.updateUser(user))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
