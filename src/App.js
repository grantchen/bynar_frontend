import { CommonHeader } from './Components/Header/Header';
import React, {Suspense} from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './index.scss'
import { DataTables } from './Components/DataTable/DataTable';
import { TearSheets } from './Components/TearSheet/TearSheets';
import { SidePanels } from './Components/SidePanel/SidePanels';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import { AuthProvider } from './sdk/context/AuthContext';
import { UserList } from './pages/UserList/UserList';
import { AddUser } from './pages/AddUser/AddUser';
const Dashboard = React.lazy(() => import('./Components/Dashboard/Dashboard'));
const Signup = React.lazy(() => import('./pages/signup/signup'));
const Signin = React.lazy(() => import('./pages/signin/signin'));


function App() {
  window.LOG_LEVEL = 'DEBUG' 


  return (
    <div className="app">
    <Suspense fallback="loading">
      <BrowserRouter>
      <AuthProvider>
        <Routes>
        <Route exact path="/signup" element={<Signup />} /> 
          <Route path='/' element={<CommonHeader />}>
            <Route exact path="/dashboard" element={<Dashboard />} />    {/*A nested route!*/}
            <Route exact path="/datatable" element={<DataTables />} />
            <Route exact path="/userlist" element={<UserList />} /> 
            {/* <Route exact path="/sidepanel" element={<SidePanels />} />
            <Route exact path="/tearsheet" element={<TearSheets />} />  */}
          </Route>
          <Route exact path="/signin" element={<Signin />} /> 
          <Route exact path="/forgotpassword" element={<ForgotPassword />} /> 
          <Route exact path="/adduser" element={<AddUser/>} /> 
        </Routes>
        </AuthProvider>
      </BrowserRouter>
      </Suspense>
    </div>
  );
}

export default App;

