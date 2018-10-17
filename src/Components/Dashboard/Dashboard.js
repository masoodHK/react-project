import React, { Component } from 'react'
import firebase from '../../config/firebase'
import './Dashboard.css';
import Button from '../Button/Button'
import placeholder from '../../assets/placeholder.png';
import Map from '../Map';

const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

firestore.settings({ timestampsInSnapshots: true })

class DataForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nickname: "",
            phoneNumber: "",
            typeOfDrinks: [],
            timeInMinutes: [],
            images: [placeholder, placeholder, placeholder],
            imageNames: [],
            location: {},
            section_1: true,
            section_2: false,
            section_3: false,
            section_4: false,
            MAX_IMAGES: 3,
            counter: 0,
        };
    }

    handleLocation = (position) => {
        console.log(position)
        this.setState({location: position.position})
    }

    handleUpload = (event) => {
        let {images, counter, MAX_IMAGES, imageNames} = this.state;
        console.log(event.target.files)
        let file = event.target.files[0];
        const reader = new FileReader()
        let url;
        reader.onloadend = () => {
            url = reader.result;
            console.log(url);
            if((counter + 1) > MAX_IMAGES) {
                return null
            }
            else {
                images[counter] = url;
                counter = counter + 1;
                console.log(counter)
                this.setState({images, counter, imageNames: imageNames < 3 ? [file.name, ...imageNames]:[...imageNames]})
            }  
        }
        reader.readAsDataURL(file)
        console.log(reader)
    }

    handleOption(option_type, answer, event) {
        const { typeOfDrinks, timeInMinutes } = this.state;
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

    submit = () => {
        const {
            images,
            imageNames,
            location,
            nickname,
            phoneNumber,
            timeInMinutes,
            typeOfDrinks,
        } = this.state
        let imageUrls = [];
        images.forEach((image, index) => {
            storage.ref(`images/${imageNames[index]}`).putString(image, "data_url")
                .then(snapshot => {
                    console.log(snapshot.state);
                    storage.ref(`images/${imageNames[index]}`).getDownloadURL()
                    .then(url => {
                        console.log(url);
                        imageUrls.push(url)
                        console.log(imageUrls, index);
                        if((index + 1) === images.length) {
                            let info = {
                                location,
                                nickname,
                                phoneNumber,
                                typeOfDrinks,
                                timeInMinutes
                            }
                            firestore.collection("user").doc(this.props.user.uid).set(info)
                                .then(res => {
                                    console.log("Data inserted", res);
                                    this.props.submit()
                                })
                                .catch(err=> {
                                    console.log(err)
                                })
                        }
                    })
                })
        });
        
    }

    render() {
        const {
            nickname,
            phoneNumber,
            section_1,
            section_2,
            section_3,
            section_4,
            images
        } = this.state;

        return (
            <div className="form">
                {section_1 && <div id="section-1">
                    <p>Enter your Nickname and Phone Number</p>
                    <label>
                        Nickname
                        <input value={nickname} type="text" onChange={(event) => this.setState({ nickname: event.target.value })}/>
                    </label>
                    <label>
                        Phone Number
                        <input value={phoneNumber} type="number" onChange={(event) => this.setState({ phoneNumber: event.target.value })}/>
                    </label>
                    <Button onClick={() => this.setState({ section_1: false, section_2: true})}>Next</Button>
                </div>}
                {section_2 && <div id="section-2">
                    <p>Enter your Pictures</p>
                    <div className="images">
                        {images.map((image, index) => {
                            return (<div key={index} className="image">
                                <img src={image} alt="Profile Pic"/>
                            </div>)
                        })}
                    </div>
                    <input className="fileInput" 
                        type="file" 
                        onChange={(e)=> this.handleUpload(e)} multiple />
                    <Button onClick={() => this.setState({ section_2: false, section_3: true})}>Next</Button>
                </div>}
                {section_3 && <div id="section-3">
                    <p>Enter your Desired Beverages and Duration</p>
                        <div className="drinks">
                            <div className="option">
                                <label>
                                    <input type="checkbox" onChange={event => this.handleOption("beverages", "coffee", event)}/>
                                    <span><i className="fas fa-coffee"></i> Coffee</span>
                                </label>
                            </div>
                            <div className="option">
                                <label>
                                    <input type="checkbox" onChange={event => this.handleOption("beverages", "tea", event)}/>
                                    <span><i className="fas fa-coffee"></i> Tea</span>
                                </label>
                            </div>
                            <div className="option">
                                <label>
                                    <input type="checkbox" onChange={event => this.handleOption("beverages", "juice", event)}/>
                                    <span><i className="fas fa-coffee"></i> Juice</span>
                                </label>
                            </div>
                        </div>
                        <div className="timeLenghts">
                            <div className="option">
                                <label>
                                    <input type="checkbox" onChange={event => this.handleOption("time", 30, event)}/>
                                    <span><i className="far fa-clock"></i> 30 minute</span>
                                </label>
                            </div>
                            <div className="option">
                                <label>
                                    <input type="checkbox" onChange={event => this.handleOption("time", 60, event)}/>
                                    <span><i className="far fa-clock"></i> 60 minute</span>
                                </label>
                            </div>
                            <div className="option">
                                <label>
                                    <input type="checkbox" onChange={event => this.handleOption("time", 120, event)}/>
                                    <span><i className="far fa-clock"></i> 120 minute</span>
                                </label>
                            </div>
                        </div>
                        <Button onClick={() => this.setState({ section_3: false, section_4: true})}>Next</Button>
                    </div>}
                    {section_4 && <div id="section-4">
                        <Map handle={this.handleLocation} />
                        <Button onClick={this.submit}>Submit</Button>
                    </div>}
            </div>
        )
    }
}

class UserData extends Component {
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
                if(snapshot.docs) {
                    const data = snapshot.docs;
                    console.log(data)
                    this.setState({ mainPage: true, data })
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
                {this.state.mainPage && <p>{this.props.user.displayName}</p>}
                {this.state.dataForm && <DataForm user={this.props.user} submit={this.handleSubmit}/>}
            </div>
        )
    }
}

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
                this.props.history.go("/");
            }
        });
    }

    componentDidMount() {
        console.log(this.props);
        this.validateUser();
    }
    
    render() {
        return (
            <div>
                {this.state.isLoggedIn && <UserData user={this.state.user}/>}
            </div>
        )
    }
}