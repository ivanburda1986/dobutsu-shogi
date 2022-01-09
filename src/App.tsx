import React from "react";
import { Route, Link, Routes } from "react-router-dom";

import { LaunchScreen } from "./LaunchScreen/LaunchScreen";
import { PlayerSettingsScreen } from "./PlayerSettingsScreen/PlayerSettingsScreen";
import { RegisterScreen } from "./RegisterScreen/RegisterScreen";

export default function App() {
  return (
    <Routes>
      <Route path="*" element={<LaunchScreen />} />
      <Route path="/" element={<LaunchScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/playerSettings" element={<PlayerSettingsScreen />} />
    </Routes>
  );
}
