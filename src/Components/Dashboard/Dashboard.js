import React, { Component } from 'react'
import firebase from '../../config/firebase'
import './Dashboard.css';
import UserData from './UserData';
import Button from '../Button'


const auth = firebase.auth();
const firestore = firebase.firestore();

firestore.settings({ timestampsInSnapshots: true })

export default class Dashboard extends Component {
    state = {
        isLoggedIn: false, user: {}
    }

    validateUser = () => {
        auth.onAuthStateChanged(user => {
            if(user && !this.state.isLoggedIn === true) {
                console.log(user)
                this.setState({ isLoggedIn: true, user })
            }
            else {
                this.props.history.push("/");
            }
        });
    }

    componentDidMount() {
        console.log(this.props);
        this.validateUser();
    }
    
    render() {
        console.log(this.props)
        return (
            <div>
                {this.state.isLoggedIn && <UserData user={this.state.user} router={this.props}/>}
                <Button onClick={() => this.props.history.push("/edit-profile")}>Edit Profile</Button>
                <Button onClick={() => this.props.history.push("/all-meetings")}>All Meetings</Button>
            </div>
        )
    }
}