import { InlineLoading } from "@carbon/react";
import React, { Suspense } from "react";
import "./App.scss";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CommonHeader } from "./components/Header";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import Home from "./pages/Home";
import Signin from "./pages/signin";
import Signup from "./pages/signup";
import { AuthProvider, TabContextProvider } from "./sdk";

function App() {
  return (
    <Suspense
      fallback={
        <div className="loader-page">
          <InlineLoading description="Loading..." />
        </div>
      }
    >
      <BrowserRouter>
        <AuthProvider>
          <TabContextProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route exact path="/signin" element={<Signin />} />
              <Route exact path="/signup" element={<Signup />} />
              <Route path="/home/" element={<CommonHeader />}>
                <Route exact path="dashboard" element={<Dashboard />} />
              </Route>
            </Routes>
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
      </BrowserRouter>
    </Suspense>
  );
}

export default App;

const headerData = [
  {
    header: "Name",
    key: "name",
  },
  {
    header: "Protocol",
    key: "protocol",
  },
  {
    header: "Port",
    key: "port",
  },
  {
    header: "Rule",
    key: "rule",
  },
  {
    header: "Attached Groups",
    key: "attached_groups",
  },
  {
    header: "Status",
    key: "status",
  },
];

const rowData = [
  {
    attached_groups: "Kevins VM Groups",
    id: "a",
    name: "Load Balancer 3",
    port: 3000,
    protocol: "HTTP",
    rule: "Round robin",
    status: "Disabled",
  },
  {
    attached_groups: "Maureens VM Groups",
    id: "b",
    name: "Load Balancer 1",
    port: 443,
    protocol: "HTTP",
    rule: "Round robin",
    status: "Starting",
  },
  {
    attached_groups: "Andrews VM Groups",
    id: "c",
    name: "Load Balancer 2",
    port: 80,
    protocol: "HTTP",
    rule: "DNS delegation",
    status: "Active",
  },
  {
    attached_groups: "Marcs VM Groups",
    id: "d",
    name: "Load Balancer 6",
    port: 3000,
    protocol: "HTTP",
    rule: "Round robin",
    status: "Disabled",
  },
  {
    attached_groups: "Mels VM Groups",
    id: "e",
    name: "Load Balancer 4",
    port: 443,
    protocol: "HTTP",
    rule: "Round robin",
    status: "Starting",
  },
  {
    attached_groups: "Ronjas VM Groups",
    id: "f",
    name: "Load Balancer 5",
    port: 80,
    protocol: "HTTP",
    rule: "DNS delegation",
    status: "Active",
  },
];
