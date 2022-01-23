import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Link, Routes } from "react-router-dom";
import { Header } from "./Header/Header";

import { LaunchScreen } from "./LaunchScreen/LaunchScreen";
import { LoginScreen } from "./LoginScreen/LoginScreen";
import { Profile } from "./Profile/Profile";
import { RegisterScreen } from "./RegisterScreen/RegisterScreen";
import sharedStyles from "./sharedStyles.module.css";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="*" element={<LaunchScreen />} />
        <Route path="/" element={<LaunchScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}
