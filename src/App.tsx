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
import _ from "lodash";

export interface LoggedInUserInterface {
  email: string | undefined;
  uid: string | undefined;
}

export default function App() {
  const [loggedInUserEmail, setLoggedInUserEmail] = React.useState<LoggedInUserInterface>();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(user);
      let userData = _.pick(user, ["email", "uid"]);
      //setLoggedInUser(userData);
    }
  });

  const providedContext = {
    loggedInUserEmail,
    setLoggedInUserEmail,
  };
  return (
    <>
      <AppContext.Provider value={providedContext}>
        <Header />
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
