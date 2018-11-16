import React from 'react'
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from '../Components/Login/Login'
import Dashboard from '../Components/Dashboard/Dashboard'
import MeetingPage from '../Components/MeetingPage'
import PlaceSearch from '../screens/PlaceSearch'
import EditProfile from '../screens/EditProfile'
import AllMeetings from '../screens/AllMeetings'
const Routes = () => <Router>
    <div>
        <Route exact path="/" component={Login}/>
        <Route path='/dashboard' component={Dashboard} />
        <Route path='/meetings' component={MeetingPage} />
        <Route path='/set-location' component={PlaceSearch} />
        <Route path='/edit-profile' component={EditProfile} />
        <Route path='/all-meetings' component={AllMeetings} />
    </div>
</Router>

export default Routes