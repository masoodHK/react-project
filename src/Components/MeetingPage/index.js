import React, { Component } from 'react'
import firebase from '../../config/firebase';
import Cards, { Card } from 'react-swipe-deck'
import Swal2 from 'sweetalert2';
import placeholder from '../../assets/placeholder.png'
import Button from '../Button/Button'

import './MeetingPage.css'

const firestore = firebase.firestore();
firestore.settings({ timestampsInSnapshots: true });

export default class MeetingPage extends Component {

    action = (method, name=null, userID=null) => {
        console.log(userID)
        switch (method) {
            case "swipe right":
                Swal2({
                    title: "Are you sure?",
                    text: "You wanna set meeting with " + name + "?",
                    showCancelButton: true,
                    confirmButtonText: "Set Meeting",
                    cancelButtonText: "Cancel"
                }).then(res => {
                    if(res.value) {
                        this.props.history.push({
                            pathname:'/set-location',
                            state: {
                                name,
                                userID
                            }
                        });
                    }
                })
                break
            default:
                console.log(method)
                break;
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dataID: []
        }
    }

    compare = (arr1, arr2) => {
        for (var i = 0; i < arr1.length; i++) {
            if (arr2[i] !== arr1[i]) return false;
        }
        return true;
    }

    componentDidMount = () => {
        const { data, dataID } = this.state
        let userData = {}
        firestore.collection('user').get()
            .then(users => {
                users.forEach(user => {
                    if(user.data().displayName === firebase.auth().currentUser.displayName) {
                        userData = user.data();
                    }
                    else {
                        data.push(user.data());
                        console.log(user.id)
                        dataID.push(user.id);
                    }
                })                
                const filteredData = data.filter(user => (this.compare(user.typeOfDrinks.sort(), userData.typeOfDrinks.sort()) || (this.compare(user.timeInMinutes.sort(), userData.timeInMinutes.sort()))))
                console.log(filteredData)
                this.setState({data: filteredData})
            })
            .catch(err => {
                console.log(err);
            })
    }
    
    render() {
        const { data,dataID } = this.state
        console.log(this.props)
        return (
            <div id="cards">
                <Cards size={[450, 550]} cardSize={[450, 550]} onEnd={() => this.action('end')} className="meeting-card">
                    {data.map((item, index) =>
                    <Card key={dataID[index]} className="meeting-card"
                        onSwipeLeft={() => this.action('swipe left')}
                        onSwipeRight={() => this.action('swipe right')}>
                        <img src={item.imageUrls ? item.imageUrls[0]: placeholder} alt="Display"/>
                        <div id="bottom">
                            <Button className="card-button" onClick={() => this.action('swipe left')}>Reject</Button>
                            <div className="info">
                                <h2>{item.displayName}</h2>
                                <p>{item.nickname}</p>
                            </div>
                            <Button className="card-button" onClick={() => this.action('swipe right', item.displayName, dataID[index])}>Accept</Button>
                        </div>
                    </Card>
                    )}
                </Cards>
            </div>
        )
    }
}
