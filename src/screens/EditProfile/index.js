import React, { Component } from 'react';
import { connect } from "react-redux";
import { authActions } from "../../store/actions";
import './EditProfile.css';
import firebase from '../../config/firebase'
import Button from "../../Components/Button";
const firestore = firebase.firestore();

class EditProfile extends Component {
    state = {
        user: {
            displayName: "",
            email: "",
            nickname: "",
            phoneNumber: 0,
            typeOfDrinks: [],
            timeInMinutes: []
        }
    }

    collectUserData = () => {
        firestore.collection("user").doc(this.props.user.uid).get().then(snapshot => {
            this.setState({ user: { ...this.props.user, ...snapshot.data() } })
        })
    }

    componentDidMount() {
        this.collectUserData()
    }
    handleEvent = (event) => {
        const { name, value } = event.target
        const { user } = this.state;
        user[name] = value
        this.setState({ user })
    }

    handleOption = (option_type, answer, event) => {
        const { typeOfDrinks, timeInMinutes } = this.state.user;
        switch (option_type) {
            case "beverages":
                if(event.target.checked === true) {
                    typeOfDrinks.push(answer)
                    console.log(typeOfDrinks);
                    this.setState({typeOfDrinks})
                }
                else {
                    let updatedList = typeOfDrinks.filter(drinks => drinks !== answer);
                    console.log(updatedList);
                    this.setState({typeOfDrinks: updatedList});
                }
                break;
            case "time":
                if(event.target.checked === true) {
                    timeInMinutes.push(answer)
                    console.log(timeInMinutes);
                    this.setState({timeInMinutes});
                }
                else {
                    let updatedList = timeInMinutes.filter(time => time !== answer);
                    this.setState({timeInMinutes: updatedList});
                }
                break;
            default:
                break
        }
    }

    save = () => {
        this.props.updateUser(this.state.user);
        firestore.collection('user').doc(firebase.auth().currentUser.uid).update(this.state.user).then(() => {
            this.props.history.go('/dashboard')
        })
    }
    render() {
        const { user } = this.state
        return (
            <div id="form">
                <h1>Edit Profile</h1>
                <label>
                    Display Name
                    <input
                        value={user.displayName}
                        name="displayName"
                        onChange={event => this.handleEvent(event)} />
                </label>
                <label>
                    Email
                    <input
                        value={user.email}
                        name="email"
                        onChange={event => this.handleEvent(event)} />
                </label>
                <label>
                    NickName
                    <input
                        value={user.nickname}
                        name="nickname"
                        onChange={event => this.handleEvent(event)} />
                </label>
                <label>
                    Phone Number
                    <input
                        value={user.phoneNumber}
                        name="phoneNumber"
                        onChange={event => this.handleEvent(event)} />
                </label>
                <p>Preferences</p>
                <div className="drinks">
                    <div className="option">
                        <label>
                            <input type="checkbox" value="coffee" onChange={event => this.handleOption("beverages", "coffee", event)} />
                            <span><i className="fas fa-coffee"></i> Coffee</span>
                        </label>
                    </div>
                    <div className="option">
                        <label>
                            <input type="checkbox" value="tea" onChange={event => this.handleOption("beverages", "tea", event)} />
                            <span><i className="fas fa-coffee"></i> Tea</span>
                        </label>
                    </div>
                    <div className="option">
                        <label>
                            <input type="checkbox" value="juice" onChange={event => this.handleOption("beverages", "juice", event)} />
                            <span><i className="fas fa-coffee"></i> Juice</span>
                        </label>
                    </div>
                </div>
                <div className="timeLenghts">
                    <div className="option">
                        <label>
                            <input type="checkbox" value="30" onChange={event => this.handleOption("time", 30, event)} />
                            <span><i className="far fa-clock"></i> 30 minute</span>
                        </label>
                    </div>
                    <div className="option">
                        <label>
                            <input type="checkbox" value="60" onChange={event => this.handleOption("time", 60, event)} />
                            <span><i className="far fa-clock"></i> 60 minute</span>
                        </label>
                    </div>
                    <div className="option">
                        <label>
                            <input type="checkbox" value="90" onChange={event => this.handleOption("time", 120, event)} />
                            <span><i className="far fa-clock"></i> 120 minute</span>
                        </label>
                    </div>
                </div>
                <Button onClick={this.save}>Save Profile</Button>
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
export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)