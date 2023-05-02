import { CommonHeader } from './Components/Header/Header';
import React, { Suspense ,lazy} from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import './index.scss'
import '../src/pages/UserList/UserList.scss'
import { DataTables } from './Components/DataTable/DataTable';
import { TearSheets } from './Components/TearSheet/TearSheets';
import { SidePanels } from './Components/SidePanel/SidePanels';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import { AuthProvider } from './sdk/context/AuthContext';
import { UserList } from './pages/UserList/UserList';
import { AddUser } from './pages/AddUser/AddUser';
import { DataLoader } from './Components/Loader/DataLoder';
import Home from './Components/Home/Home';
import { TabContextProvider } from './sdk/context/TabContext';
const Dashboard = lazy(() => import('./Components/Dashboard/Dashboard'));
const Signup = lazy(() => import('./pages/signup/signup'));
const Signin = lazy(() => import('./pages/signin/signin'));


function App() {
  return (
    <div className="app">
      <Suspense fallback={<div className='loader-page'>
        <DataLoader />
      </div>}>
        <BrowserRouter>
          <AuthProvider>
          <TabContextProvider>
            <Routes>
              <Route path='/' element={<Home />}/>
              <Route exact path="/signup" element={<Signup />} />
              <Route path='/home/' element={<CommonHeader />}>
                <Route exact path="dashboard" element={<Dashboard/>} />    
                <Route exact path="datatable" element={<DataTables />} />
                <Route exact path="userlist" element={<UserList />} /> 

              </Route>
            <Route exact path="/userlist" element={<UserList />} />
              <Route exact path="/signin" element={<Signin />} />
              <Route exact path="/forgotpassword" element={<ForgotPassword />} />
              <Route exact path="/adduser" element={<AddUser/>} />
            </Routes>
            </TabContextProvider>
          </AuthProvider>
        </BrowserRouter>
      </Suspense>
    </div>
  );
}

export default App;


