import React, { Component } from 'react';
import './app.scss';
import { Routes, Route } from 'react-router-dom';
import { Content, Theme } from '@carbon/react';

import CarbonHeader from './components/CarbonHeader';
import LandingPage from './content/LandingPage';
import Dashboard from './content/Dashboard';
import Profile from './pages/Profile';
import UserList from './pages/UserList';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import PrivateRoute from './components/Utils/PrivateRoute';
import PublicRoute from './components/Utils/PublicRoute';
import AuthRoute from './components/Utils/AuthRoute';
import { Account } from './components/Accounts';
import AuthHeader from './components/AuthHeader';

class App extends Component {
  render() {
    return (
        <div className='app-container' >

            <>
                <Account>
                    <Routes>
                        <Route exact path="/" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
                        <Route path="/profile" element={<PrivateRoute><Profile/></PrivateRoute>} />
                        <Route path="/userlist" element={<PrivateRoute><UserList/></PrivateRoute>} />

                        <Route path="/signin" element={<><Theme><AuthHeader isSignIn={true} /></Theme><Signin/></>} />
                        <Route path="/signup" element={<><Theme><AuthHeader isSignIn={false} /></Theme><Signup/></>} />
                    </Routes>
                </Account>
            </>
        </div>
        
    );
  }
}

export default App;
