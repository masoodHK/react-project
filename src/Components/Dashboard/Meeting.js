import React, { Component } from "react";
import firebase from "../../config/firebase";
import Button from "../Button";
import swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import Ratings from '../../Components/Ratings'
import * as moment from 'moment'

const firestore = firebase.firestore();
firestore.settings({ timestampsInSnapshots: true });
const ReactSWAL = withReactContent(swal);

export default class Meeting extends Component {
	constructor(props) {
		super(props);

		this.state = {
			meetings: [],
			ratings: 0
		};
	}

	setRating = (i) => {
		this.setState({ ratings: i })
	}

	componentDidMount() {
		let { meetings } = this.state;
		const meetingFirestore = firestore
			.collection("user")
			.doc(this.props.user.uid)
			.collection("meetings")
		meetingFirestore
			.get()
			.then(meetingSnapshot => {
				if (meetingSnapshot.empty) {
					this.setState({ meetings: [] });
				} else {
					meetingSnapshot.forEach(meeting => {
						console.log(meeting.id);
						if (meeting.data().date === moment().format("MM-DD-YYYY") && meeting.data().time === moment().format("HH:mm A")) {
							swal({
								title: `Your meeting with ${meeting.data().meetingWith} is done. Did it happened?`,
								text: "Can you confirm it",
								showCancelButton: true,
								confirmButtonText: "Yes it happened",
								cancelButtonText: "No it did not happen",
							}).then(res => {
								if (res.value === true) {
									console.log(res.value);
									ReactSWAL.fire({
										title: `Rate your meeting with ${meeting.data().meetingWith}`,
										html: <Ratings setRatings={this.setRating} />,
									}).then(() => {
										meetingFirestore.doc(meeting.id).update({
											ratings: this.state.ratings,
											status: "done"
										})
									});
								}
							})
						}
						else {
							meetings.push(meeting.data());
						}
					});
					this.setState({ meetings });
				}
			});
	}

	setMeeting() {
		this.props.history.push("/meetings");
	}

	render() {
		const { meetings } = this.state;
		console.log(this.props);
		return (
			<div id="meetings">
				{meetings.length === 0 ? (
					<div id="message">
						<h1>You have no meetings!!!</h1>
					</div>
				) : (
						meetings.map((meeting, index) => {
							return (
								<div className="meeting" key={index}>
									<h1>Meeting with {meeting.meetingWith}</h1>
									<p>
										Location: {meeting.location} Date: {meeting.date}
									</p>
									<p>
										Status: {meeting.status}
									</p>
								</div>
							);
						})
					)}

				<Button
					className="meeting-button"
					onClick={() => this.props.router.history.push("/meetings")}
				>
					Set a new Meeting
        		</Button>
			</div>
		);
	}
}
