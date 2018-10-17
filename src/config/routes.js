import React from 'react'
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from '../Components/Login/Login'
import Dashboard from '../Components/Dashboard/Dashboard'

const Routes = () => <Router>
    <div>
        <Route exact path="/" component={Login}/>
        <Route path='/dashboard' component={Dashboard} />
    </div>
</Router>

export default Routes