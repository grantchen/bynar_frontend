import { Loading } from "@carbon/react";
import React, { Suspense, lazy } from "react";
import "./App.scss";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import {
    AuthProvider,
    TabContextProvider,
    ThemePreferenceProvider,
    UserManagementProvider,
    CardManagementProvider,
} from "./sdk";

const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const MagicLinkAuth = lazy(() => import("./components/Auth/MagicLinkAuth"));
const Home = lazy(() => import("./pages/Home"));
const Home2 = lazy(() => import("./pages/Home2"));
const Signin = lazy(() => import("./pages/signin"));
const Signup = lazy(() => import("./pages/signup"));
const AuthenticatedAppHeader = lazy(() => import("./components/HeaderAuthenticated"));

function App() {
    return (
        <>
            <Suspense
                fallback={<Loading small />}
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
                                            element={<AuthenticatedAppHeader />}
                                        >
                                            <Route
                                                exact
                                                path="dashboard"
                                                element={<Dashboard />}
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
