import React, { Component } from 'react'
import DataForm from './DataForm';
import firebase from '../../config/firebase'
import Meeting from './Meeting'

const firestore = firebase.firestore();
firestore.settings({ timestampsInSnapshots: true });


export default class UserData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dataForm: false,
            mainPage: false,
        };
    }

    componentDidMount() {
        firestore.collection("user").doc(this.props.user.uid).get()
            .then(snapshot => {
                console.log(snapshot.exists)
                if(snapshot.exists === true) {
                    this.setState({ mainPage: true, data: snapshot.data() })
                }
                else {
                    console.log("Data doesn't exist")
                    this.setState({ dataForm: true })
                }
            }).catch(error => {
                console.log(error)
            })
    }

    handleSubmit = () => {
        this.setState({
            mainPage: true,
            dataForm: false,
        })
    }

    render() {
        return (
            <div>
                {this.state.mainPage && <Meeting user={this.props.user} router={this.props.router}/>}
                {this.state.dataForm && <DataForm user={this.props.user} submit={this.handleSubmit}/>}
            </div>
        )
    }
}