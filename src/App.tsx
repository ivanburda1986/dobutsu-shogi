import React from "react";
import { Route, Link, Routes, Navigate } from "react-router-dom";
import { useNavigate } from "react-router";
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

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = React.useState<boolean>(false);
  const [loggedInUserEmail, setLoggedInUserEmail] = React.useState<string>("");
  const [registrationFinished, setRegistrationFinished] = React.useState<boolean>(true);
  const navigate = useNavigate();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserLoggedIn(true);
      let email = user.email;
      email && setLoggedInUserEmail(email);
    } else {
      setUserLoggedIn(false);
      setLoggedInUserEmail("");
    }
  });

  const providedContext = {
    userLoggedIn,
    loggedInUserEmail,
    setRegistrationFinished,
  };
  React.useEffect(() => {
    if (userLoggedIn) {
      navigate("../", { replace: false });
    }
  }, [userLoggedIn]);

  React.useEffect(() => {
    if (userLoggedIn && registrationFinished) {
      navigate("../", { replace: false });
    }
  }, [userLoggedIn, registrationFinished]);

  return (
    <>
      <AppContext.Provider value={providedContext}>
        <Header username={loggedInUserEmail} />
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
