import "./App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuthContext } from "@asgardeo/auth-react";
import { TokenExchangePlugin } from "@asgardeo/token-exchange-plugin";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import ScheduleFormPage from "./pages/ScheduleFormPage";

import NoPage from "./pages/NoPage";
import Login from "./pages/Login";
import ViewActualVisit from "./pages/ViewActualVisit";

const authConfig = {
  baseUrl: "https://api.asgardeo.io/t/choreoplayground",
  clientID: "6vE_N4bvOzAYf2qzQJAxZdRuoKka",
  scope: [
    "openid",
    "profile",
    "urn:choreoplayground:yasithavisitapivisit420:resident",
  ],
  signInRedirectURL: "https://" + window.location.host,
  signOutRedirectURL: "https://" + window.location.host,
};

function App() {
  return (
    <AuthProvider config={authConfig}>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/schedule" element={<ScheduleFormPage />} />
            <Route path="/visit/actual/:id" element={<ViewActualVisit />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
