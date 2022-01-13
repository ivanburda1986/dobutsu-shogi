import React from "react";
import { Route, Link, Routes } from "react-router-dom";
import { Header } from "./Header/Header";

import { LaunchScreen } from "./LaunchScreen/LaunchScreen";
import { LoginScreen } from "./LoginScreen/LoginScreen";
import { PlayerSettingsScreen } from "./PlayerSettingsScreen/PlayerSettingsScreen";
import { RegisterScreen } from "./RegisterScreen/RegisterScreen";
import sharedStyles from "./sharedStyles.module.css";

export default function App() {
  return (
    <>
      <Header />
      <div className={sharedStyles.container}>
        <Routes>
          <Route path="*" element={<LaunchScreen />} />
          <Route path="/" element={<LaunchScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/playerSettings" element={<PlayerSettingsScreen />} />
        </Routes>
      </div>
    </>
  );
}
