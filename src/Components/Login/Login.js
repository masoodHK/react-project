import React, { Component } from 'react'
import Button from '../Button/Button'
import firebase from '../../config/firebase';

export default class Login extends Component {
    login = () => {
        firebase.auth().signInWithPopup(new firebase.auth.FacebookAuthProvider())
          .then(data => {
            console.log(data, this.props.history)
            this.props.history.replace('/dashboard')
          }).catch(error => {
            console.log(error)
          })
    }

    render() {
        console.log(this.props)
        return (
            <div className="Login">
                <h1>Login</h1>
                <Button className="Facebook" onClick={()=> this.login()}>Login via Facebook</Button>
            </div>
        )
    }
}