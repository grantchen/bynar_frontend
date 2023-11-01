import React, { Suspense, lazy } from "react";
import "./App.scss";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import {
    AuthProvider,
    TabContextProvider,
    ThemePreferenceProvider,
    UserManagementProvider,
} from "./sdk";

// not use lazy load for no lazy loading like refreshing page
import Home2 from "./pages/Home2";
import Dashboard from "./pages/Dashboard/Dashboard";
import AuthenticatedAppHeader from "./components/HeaderAuthenticated";
import MagicLinkAuth from "./components/Auth/MagicLinkAuth";
import Signin from "./pages/signin";
import Signup from "./pages/signup";

function App() {
    return (
        <>
            <Suspense
                fallback={<div style={{ visibility: 'hidden' }}>Loading...</div>}
            >
                <BrowserRouter>
                    <AuthProvider>
                        <ThemePreferenceProvider>
                            <TabContextProvider>
                                <UserManagementProvider>
                                    {/* <CardManagementProvider> */}
                                    <Routes>
                                        <Route
                                            path="/"
                                            // TODO
                                            element={<Home2 />}
                                        />
                                        <Route
                                            path="/auth/magic-link"
                                            element={<MagicLinkAuth />}
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
                                            element={
                                                <AuthenticatedAppHeader />
                                            }
                                        >
                                            <Route
                                                exact
                                                path="dashboard"
                                                element={
                                                    <Dashboard />
                                            }
                                            />
                                        </Route>
                                    </Routes>
                                    {/* </CardManagementProvider> */}
                                </UserManagementProvider>
                            </TabContextProvider>
                        </ThemePreferenceProvider>
                    </AuthProvider>
                </BrowserRouter>
            </Suspense>
        </>
    );
}

export default App;
