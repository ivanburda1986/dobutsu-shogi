import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Route, Routes, useLocation } from "react-router-dom";
import _ from "lodash";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./api/firestore";
import { AppContext } from "./context/AppContext";

import { Header } from "./Header/Header";
import { LaunchScreen } from "./LaunchScreen/LaunchScreen";
import { RegisterScreen } from "./RegisterScreen/RegisterScreen";
import { LoginScreen } from "./LoginScreen/LoginScreen";
import { Profile } from "./Profile/Profile";
import { CreateGame } from "./CreateGame/CreateGame";
import { Session } from "./Session/Session";

import "bootstrap/dist/css/bootstrap.min.css";

export interface UserDataInterface {
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface ProvidedContextInterface {
  userLoggedIn: boolean;
  loggedInUserEmail: string | null;
  loggedInUserDisplayName: string | null;
  loggedInUserUserId: string;
  loggedInUserPhotoURL: string | null;
  setUserData: ({ email, displayName, photoURL }: UserDataInterface) => void;
}

export const App = () => {
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  const [loggedInUserEmail, setLoggedInUserEmail] = useState<string | null>("");
  const [loggedInUserDisplayName, setLoggedInUserDisplayName] = useState<string | null>("Username");
  const [loggedInUserUserId, setLoggedInUserUserId] = useState<string>("");
  const [loggedInUserPhotoURL, setLoggedInUserPhotoURL] = useState<string | null>("placeholder");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (userLoggedIn && location.pathname === "/login") {
      console.log("App navigated from login");
      navigate("../", { replace: false });
      return;
    }
    if (userLoggedIn && location.pathname === "/register") {
      console.log("App navigated from registration");
      navigate("../", { replace: false });
      return;
    }
    if (!userLoggedIn && location.pathname === "/") {
      console.log("App navigated from login");
      navigate("../login", { replace: false });
      return;
    }
  }, [userLoggedIn, navigate]);

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

  return (
    <div>
      <AppContext.Provider value={providedContext}>
        <Header />
        <Routes>
          <Route path="*" element={<LaunchScreen />} />
          <Route path="/" element={<LaunchScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/creategame" element={<CreateGame />} />
          <Route path="/session/:gameId" element={<Session />} />
        </Routes>
      </AppContext.Provider>
    </div>
  );
};
