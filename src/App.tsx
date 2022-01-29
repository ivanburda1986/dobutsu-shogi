import React from "react";
import { Route, Link, Routes } from "react-router-dom";
import { Header } from "./Header/Header";
import { LaunchScreen } from "./LaunchScreen/LaunchScreen";
import { LoginScreen } from "./LoginScreen/LoginScreen";
import { Profile } from "./Profile/Profile";
import { RegisterScreen } from "./RegisterScreen/RegisterScreen";
import { AppContext } from "./context/AppContext";
import { auth } from "./api/firestore";
import { onAuthStateChanged } from "firebase/auth";

import "bootstrap/dist/css/bootstrap.min.css";
import sharedStyles from "./sharedStyles.module.css";

export interface LoggedInUserInterface {
  email: string;
}

export default function App() {
  const [loggedInUser, setLoggedInUser] = React.useState<LoggedInUserInterface>();

  React.useCallback(() => {
    onAuthStateChanged(auth, (user) => {
      console.log("user status changed: ", user);
    });
  }, []);

  const providedContext = {
    loggedInUser,
    setLoggedInUser,
  };
  return (
    <>
      <AppContext.Provider value={providedContext}>
        <Header loggedInUserEmail={loggedInUser?.email} />
        <Routes>
          <Route path="*" element={<LaunchScreen />} />
          <Route path="/" element={<LaunchScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </AppContext.Provider>
    </>
  );
}
