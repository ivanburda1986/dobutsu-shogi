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
import { CreateGame } from "./CreateGame/CreateGame";
import { Session } from "./Session/Session";

export interface UserDataInterface {
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface ProvidedContextInterface {
  userLoggedIn: boolean;
  loggedInUserEmail: string | null;
  loggedInUserDisplayName: string | null;
  loggedInUserUserId: string | null;
  loggedInUserPhotoURL: string | null;
  setUserData: ({ email, displayName, photoURL }: UserDataInterface) => void;
}

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = React.useState<boolean>(false);
  const [loggedInUserEmail, setLoggedInUserEmail] = React.useState<string | null>("");
  const [loggedInUserDisplayName, setLoggedInUserDisplayName] = React.useState<string | null>("");
  const [loggedInUserUserId, setLoggedInUserUserId] = React.useState<string | null>("");
  const [loggedInUserPhotoURL, setLoggedInUserPhotoURL] = React.useState<string | null>("");
  const navigate = useNavigate();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserLoggedIn(true);
      setLoggedInUserEmail(user.email);
      setLoggedInUserDisplayName(user.displayName);
      setLoggedInUserUserId(user.uid);
      setLoggedInUserPhotoURL(user.photoURL);
    } else {
      setUserLoggedIn(false);
    }
  });

  const setUserData = ({ email, displayName, photoURL }: UserDataInterface) => {
    email && setLoggedInUserEmail(email);
    displayName && setLoggedInUserDisplayName(displayName);
    photoURL && setLoggedInUserPhotoURL(photoURL);
  };

  const providedContext: ProvidedContextInterface = {
    userLoggedIn,
    loggedInUserEmail,
    loggedInUserDisplayName,
    loggedInUserUserId,
    loggedInUserPhotoURL,
    setUserData,
  };

  React.useEffect(() => {
    setTimeout(() => {
      if (!userLoggedIn) {
        navigate("../login", { replace: false });
      }
    }, 500);
  }, [userLoggedIn]);

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
          <Route path="/creategame" element={<CreateGame />} />
          <Route path="/session" element={<Session />} />
        </Routes>
      </AppContext.Provider>
    </>
  );
}
