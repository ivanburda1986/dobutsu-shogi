import React from "react";
import { Route, Link, Routes } from "react-router-dom";
import { Header } from "./Header/Header";

import { LaunchScreen } from "./LaunchScreen/LaunchScreen";
import { PlayerSettingsScreen } from "./PlayerSettingsScreen/PlayerSettingsScreen";
import { RegisterScreen } from "./RegisterScreen/RegisterScreen";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="*" element={<LaunchScreen />} />
        <Route path="/" element={<LaunchScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/playerSettings" element={<PlayerSettingsScreen />} />
      </Routes>
    </>
  );
}
