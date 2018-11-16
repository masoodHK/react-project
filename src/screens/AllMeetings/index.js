import React, { Component } from 'react'
import './AllMeetings.css'
import Button from "../../Components/Button";
import AddToCalender from 'react-add-to-calendar';
import firebase from '../../config/firebase'
import * as moment from 'moment';

const firestore = firebase.firestore();

export default class index extends Component {
  state = {
    doneMeetings: [],
    acceptedMeetings: [],
    requests: [],
    requestsID: [],
    pending: [],
    complicated: [],
    rejected: [],
    d: true,
    r: false,
    a: false,
    p: false,
    c: false
  }
  sortMeetings = meeting => {
    const { doneMeetings, acceptedMeetings, rejected, pending, complicated } = this.state
    switch (meeting.status) {
      case "done":
        doneMeetings.push(meeting)
        break
      case "accepted":
        acceptedMeetings.push(meeting)
        break
      case "rejected":
        rejected.push(meeting)
        break
      case "pending":
        pending.push(meeting)
        break
      case "complicated":
        complicated.push(meeting)
        break
      default: break
    }
    return { doneMeetings, acceptedMeetings, rejected, pending, complicated }
  }

  componentDidMount = () => {
    const meetings = firestore.collection('user').doc(firebase.auth().currentUser.uid).collection('meetings');
    const requests = firestore.collection('user').doc(firebase.auth().currentUser.uid).collection('requests');
    let meetingSorted = {}
    let req = [];
    let reqID = []
    meetings.get().then(snapshot => {
      snapshot.forEach(meeting => {
        meetingSorted = this.sortMeetings(meeting.data())
      })
    });
    requests.get().then(snapshot => {
      snapshot.forEach(request => {
        req.push(request.data())
        reqID.push(request.id)
      })
    });
    this.setState({ ...meetingSorted, request: req, requestsID: reqID })
  }

  action = (type, request, requestID = null) => {
    switch (type) {
      case "accept":
        firestore.collection('user').doc(firebase.auth().currentUser.uid).collection('meetings').doc().set({
          meetingWith: firebase.auth().currentUser.displayName,
          setBy: request.requestSentBy,
          setterID: request.setterID,
          userID: firebase.auth().currentUser.uid,
          date: request.date,
          time: request.time,
          location: request.location,
          status: "accepted",
          userDisplayPic: request.userDisplayPic,
          senderDisplayPic: request.senderDisplayPic,
        }).then(() => {
          firestore.collection('user').doc(firebase.auth().currentUser.uid).collection('meetings').doc().update({
            status: "accepted"
          })
        })
        break
      case "reject":
        firestore
          .collection('user')
          .doc(firebase.auth().currentUser.uid)
          .collection('requests')
          .doc(requestID)
          .delete().then(() => {
            firestore.collection('user').doc(firebase.auth().currentUser.uid).collection('meetings').doc().update({
              status: "rejected"
            })
          })
        break
      default: break
    }
  }

  render() {
    const { doneMeetings, acceptedMeetings, rejected, requestsID, pending, complicated, requests, r, a, c, p, d } = this.state
    return (
      <div>
        <Button onClick={() => this.setState({ d: true })}>Show done Meetings</Button>
        <Button onClick={() => this.setState({ r: true })}>Show rejected Meetings</Button>
        <Button onClick={() => this.setState({ a: true })}>Show accepted Meetings</Button>
        <Button onClick={() => this.setState({ c: true })}>Complicated Meetings</Button>
        <Button onClick={() => this.setState({ p: true })}>Pending</Button>
        {d && <div>
          <h3>Done Meetings</h3>
          {doneMeetings.map((meeting, index) => {
            return (
              <div className="meeting" key={index}>
                <h1>Meeting with {meeting.meetingWith}</h1>
                <img src={meeting.userDisplayPic} alt="user" />
                <img src={meeting.senderDisplayPic} alt="user" />
                <p>
                  Location: {meeting.location} Date: {meeting.date} Time: {meeting.time}
                </p>
              </div>
            )
          })}
        </div>}
        {a && <div>
          {acceptedMeetings.map(meeting => {
            return (
              <div className="meeting" key={index}>
                <h1>Meeting with {meeting.meetingWith}</h1>
                <img src={meeting.userDisplayPic} alt="user" />
                <img src={meeting.senderDisplayPic} alt="user" />
                <p>
                  Location: {meeting.location} Date: {meeting.date} Time: {meeting.time}
                </p>
                <AddToCalender event={{
                  title: `Meeting with: ${meeting.meetingWith}`,
                  description: `Meeting with: ${meeting.meetingWith} on ${meeting.date} in ${meeting.location}`,
                  location: meeting.location,
                  startTime: moment(meeting.date + "" + meeting.time).format("mm-dd-yyyy HH:mm A"),
                  endTime: moment(meeting.date + "" + meeting.time).format("mm-dd-yyyy HH:mm A")
                }} />
              </div>
            )
          })}
        </div>}
        {r && <div>
          {rejected.map(meeting => {
            return (
              <div className="meeting" key={index}>
                <h1>Meeting with {meeting.meetingWith}</h1>
                <img src={meeting.userDisplayPic} alt="user" />
                <img src={meeting.senderDisplayPic} alt="user" />
                <p>
                  Location: {meeting.location} Date: {meeting.date} Time: {meeting.time}
                </p>
              </div>
            )
          })}
        </div>}
        {p && pending.map(meeting => {
          return (
            <div className="meeting" key={index}>
              <h1>Meeting with {meeting.meetingWith}</h1>
              <img src={meeting.userDisplayPic} alt="user" />
              <img src={meeting.senderDisplayPic} alt="user" />
              <p>
                Location: {meeting.location} Date: {meeting.date} Time: {meeting.time}
              </p>
            </div>
          )
        })}
        {c && complicated.map(meeting => {
          return (
            <div className="meeting" key={index}>
              <h1>Meeting with {meeting.meetingWith}</h1>
              <img src={meeting.userDisplayPic} alt="user" />
              <img src={meeting.senderDisplayPic} alt="user" />
              <p>
                Location: {meeting.location} Date: {meeting.date} Time: {meeting.time}
              </p>
            </div>
          )
        })}
        <h3>All Requests</h3>
        {requests.map((requests, index) => {
          return (<div className="meeting" key={index}>
            <h1>Meeting with {requests.requestSentBy}</h1>
            <img src={requests.userDisplayPic} alt="user" />
            <img src={requests.senderDisplayPic} alt="user" />
            <p>
              Location: {requests.location} Date: {requests.date} Time: {requests.time}
            </p>

            <Button onClick={() => this.action("accept", requests)}>Accept</Button>
            <Button onClick={() => this.action("reject", requests, requestsID[index])}>Reject</Button>
          </div>)
        })}
        <Button onClick={() => this.props.history.push('/dashboard')}>Back</Button>
      </div>
    )
  }
}
