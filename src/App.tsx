import { useState } from "react";
import { Provider } from "react-redux";
import store from "./Store";
import { Route, Routes } from "react-router-dom";

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
import { About } from "./About/About";
import { useRoute } from "./hooks/useRoute";
import { Sandbox } from "./sandbox/Sandbox";

export interface UserDataInterface {
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AppContextInterface {
  userLoggedIn: boolean;
  loggedInUserEmail: string | null;
  loggedInUserDisplayName: string | null;
  loggedInUserUserId: string;
  loggedInUserPhotoURL: string | null;
  setUserData: ({ email, displayName, photoURL }: UserDataInterface) => void;
}

export const App = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [loggedInUserEmail, setLoggedInUserEmail] = useState<string | null>("");
  const [loggedInUserDisplayName, setLoggedInUserDisplayName] = useState<
    string | null
  >("");
  const [loggedInUserUserId, setLoggedInUserUserId] = useState<string>("");
  const [loggedInUserPhotoURL, setLoggedInUserPhotoURL] = useState<
    string | null
  >("placeholder");
  useRoute(isUserLoggedIn);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setIsUserLoggedIn(true);
      setLoggedInUserEmail(user.email);
      setLoggedInUserDisplayName(user.displayName);
      setLoggedInUserUserId(user.uid);
      setLoggedInUserPhotoURL(user.photoURL);
    } else {
      setIsUserLoggedIn(false);
    }
  });

  const setUserData = ({ email, displayName, photoURL }: UserDataInterface) => {
    email && setLoggedInUserEmail(email);
    displayName && setLoggedInUserDisplayName(displayName);
    photoURL && setLoggedInUserPhotoURL(photoURL);
  };

  const providedAppContext: AppContextInterface = {
    userLoggedIn: isUserLoggedIn,
    loggedInUserEmail,
    loggedInUserDisplayName,
    loggedInUserUserId,
    loggedInUserPhotoURL,
    setUserData,
  };

  return (
    <div>
      <Provider store={store}>
        <AppContext.Provider value={providedAppContext}>
          <Header />
          <Routes>
            <Route path="*" element={<LaunchScreen />} />
            <Route path="/" element={<LaunchScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="/creategame" element={<CreateGame />} />
            <Route path="/session/:gameId" element={<Session />} />
            <Route path="/sandbox" element={<Sandbox />} />
          </Routes>
        </AppContext.Provider>
      </Provider>
    </div>
  );
};
