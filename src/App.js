import { Loading } from "@carbon/react";
import React, { Suspense, lazy } from "react";
import "./App.scss";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import {
    AuthProvider,
    TabContextProvider,
    ThemePreferenceProvider,
    UserManagementProvider,
} from "./sdk";

const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Home = lazy(() => import("./pages/Home"));
const Signin = lazy(() => import("./pages/signin"));
const Signup = lazy(() => import("./pages/signup"));
const Test = lazy(() => import("./pages/test"));
const AuthenticatedAppHeader = lazy(() => import("./components/Header2"));

function App() {
    return (
        <>
            <Suspense
                fallback={<Loading small/>}
            >
                <BrowserRouter>
                    <AuthProvider>
                        <ThemePreferenceProvider>
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
                                            element={<AuthenticatedAppHeader />}
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
                        </ThemePreferenceProvider>
                    </AuthProvider>
                </BrowserRouter>
            </Suspense>
        </>
    );
}

export default App;
