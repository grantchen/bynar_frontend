import React, { Suspense, lazy } from "react";
import "./App.scss";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import {
    AuthProvider,
    TabContextProvider,
    ThemePreferenceProvider,
    UserManagementProvider,
} from "./sdk";

import Home2 from "./pages/Home2";
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const MagicLinkAuth = lazy(() => import("./components/Auth/MagicLinkAuth"));
const Login = lazy(() => import("./pages/login"));
const Signin = lazy(() => import("./pages/signin"));
const Signup = lazy(() => import("./pages/signup"));
const AuthenticatedAppHeader = lazy(() => import("./components/HeaderAuthenticated"));

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
                                            path="/auth/login"
                                            element={<Login />}
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
