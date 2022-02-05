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

export interface UserDataInterface {
  email: string | null;
  username: string | null;
  avatarImg: string | null;
}

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = React.useState<boolean>(false);
  const [loggedInUserEmail, setLoggedInUserEmail] = React.useState<string | null>("");
  const [loggedInUserUsername, setLoggedInUserUsername] = React.useState<string | null>();
  const [loggedInUserUserId, setLoggedInUserUserId] = React.useState<string | null>();
  const [loggedInUserAvatarImg, setLoggedInUserAvatarImg] = React.useState<string | null>();
  const navigate = useNavigate();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserLoggedIn(true);
      setLoggedInUserEmail(user.email);
      setLoggedInUserUsername(user.displayName);
      setLoggedInUserUserId(user.uid);
      setLoggedInUserAvatarImg(user.photoURL);
    } else {
      setUserLoggedIn(false);
    }
  });

  const setUserData = ({ email, username, avatarImg }: UserDataInterface) => {
    email && setLoggedInUserEmail(email);
    username && setLoggedInUserUsername(username);
    avatarImg && setLoggedInUserAvatarImg(avatarImg);
  };

  const providedContext = {
    userLoggedIn,
    loggedInUserEmail,
    loggedInUserUsername,
    loggedInUserUserId,
    loggedInUserAvatarImg,
    setUserData,
  };

  React.useEffect(() => {
    if (!userLoggedIn) {
      navigate("../login", { replace: false });
    }
  }, [userLoggedIn, navigate]);

  React.useEffect(() => {
    if (userLoggedIn) {
      navigate("../", { replace: false });
    }
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
        </Routes>
      </AppContext.Provider>
    </>
  );
}
