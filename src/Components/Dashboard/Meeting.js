import React, { Component } from 'react'
import firebase from '../../config/firebase';
import Button from '../Button/Button'

const firestore = firebase.firestore();
firestore.settings({timestampsInSnapshots: true});

export default class Meeting extends Component {
    constructor(props){
        super(props);

        this.state = {
            meetings: []
        }
    }
    
    componentDidMount() {
        let { meetings } = this.state
        firestore.collection("user").doc(this.props.user.uid).collection("meetings").get()
            .then(meetingSnapshot => {
                if(meetingSnapshot.empty) {
                    this.setState({meetings: []})
                }
                else{
                    meetingSnapshot.forEach(meeting => {
                        console.log(meeting.data());
                        meetings.push(meeting.data());
                    })
                    this.setState({ meetings })
                }
            })
    }

    setMeeting() {
        this.props.history.push("/meetings")
    }

    render() {
        const { meetings } = this.state
        console.log(this.props)
        return (
            <div id="meetings">
                {meetings.length === 0 ? <div id="message">
                    <h1>You have no meetings!!!</h1>
                </div>:
                meetings.map(meeting => {
                    return  <div className="meeting">
                        <h1>Meeting with {meeting.meetingWith}</h1>
                        <p>Location: {meeting.location} Date: {meeting.date}</p>
                    </div>
                })}

                <Button className="meeting-button" onClick={() => this.props.router.history.push('/meetings')}>Set a new Meeting</Button>
            </div>
        )
    }
}