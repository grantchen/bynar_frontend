import { InlineLoading } from "@carbon/react";
import React, { Suspense } from "react";
import "./App.scss";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CommonHeader } from "./components/Header";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import Home from "./pages/Home";
import Signin from "./pages/signin";
import Signup from "./pages/signup";
import Test from "./pages/test";
import {
    AuthProvider,
    TabContextProvider,
    ThemePreferenceProvider,
    UserManagementProvider,
} from "./sdk";

function App() {
    return (
        <>
            <Suspense
                fallback={
                    <div className="loader-page">
                        <InlineLoading description="Loading..." />
                    </div>
                }
            >
                <BrowserRouter>
                    <ThemePreferenceProvider>
                        <AuthProvider>
                            <TabContextProvider>
                                <UserManagementProvider>
                                    <Routes>
                                        <Route path="/" element={<Home />} />
                                        <Route
                                            path="/test"
                                            element={<Test />}
                                        />
                                        <Route
                                            exact
                                            path="/signin"
                                            element={<Signin />}
                                        />
                                        <Route
                                            exact
                                            path="/signup"
                                            element={<Signup />}
                                        />
                                        <Route
                                            path="/home/"
                                            element={<CommonHeader />}
                                        >
                                            <Route
                                                exact
                                                path="dashboard"
                                                element={<Dashboard />}
                                            />
                                        </Route>
                                    </Routes>
                                </UserManagementProvider>
                            </TabContextProvider>
                            {/* <Routes>
            <Route path="/" element={<Home />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route path="/home/" element={<CommonHeader />}>
              <Route exact path="dashboard" element={<Dashboard />} />
              <Route exact path="datatable" element={<DataTables />} />
              <Route exact path="userlist" element={<UserList />} />
            </Route>
            <Route exact path="/signin" element={<Signin />} />
            <Route exact path="/forgotpassword" element={<ForgotPassword />} />
            <Route exact path="/adduser" element={<AddUser />} />
          </Routes> */}
                        </AuthProvider>
                    </ThemePreferenceProvider>
                </BrowserRouter>
            </Suspense>
        </>
    );
}

export default App;
