import {useState} from "react";
import {Route, Routes} from "react-router-dom";

import {onAuthStateChanged} from "firebase/auth";
import {auth} from "./api/firestore";
import {AppContext} from "./context/AppContext";

import {Header} from "./Header/Header";
import {LaunchScreen} from "./LaunchScreen/LaunchScreen";
import {RegisterScreen} from "./RegisterScreen/RegisterScreen";
import {LoginScreen} from "./LoginScreen/LoginScreen";
import {Profile} from "./Profile/Profile";
import {CreateGame} from "./CreateGame/CreateGame";
import {Session} from "./Session/Session";

import "bootstrap/dist/css/bootstrap.min.css";
import {About} from "./About/About";
import {useRoute} from "./hooks/useRoute";

export interface UserDataInterface {
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

export interface appContextInterface {
    userLoggedIn: boolean;
    loggedInUserEmail: string | null;
    loggedInUserDisplayName: string | null;
    loggedInUserUserId: string;
    loggedInUserPhotoURL: string | null;
    setUserData: ({email, displayName, photoURL}: UserDataInterface) => void;
}

export const App = () => {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
    const [loggedInUserEmail, setLoggedInUserEmail] = useState<string | null>("");
    const [loggedInUserDisplayName, setLoggedInUserDisplayName] = useState<string | null>("Username");
    const [loggedInUserUserId, setLoggedInUserUserId] = useState<string>("");
    const [loggedInUserPhotoURL, setLoggedInUserPhotoURL] = useState<string | null>("placeholder");
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

    const setUserData = ({email, displayName, photoURL}: UserDataInterface) => {
        email && setLoggedInUserEmail(email);
        displayName && setLoggedInUserDisplayName(displayName);
        photoURL && setLoggedInUserPhotoURL(photoURL);
    };

    const providedAppContext: appContextInterface = {
        userLoggedIn: isUserLoggedIn,
        loggedInUserEmail,
        loggedInUserDisplayName,
        loggedInUserUserId,
        loggedInUserPhotoURL,
        setUserData,
    };

    return (
        <div>
            <AppContext.Provider value={providedAppContext}>
                <Header/>
                <Routes>
                    <Route path="*" element={<LaunchScreen/>}/>
                    <Route path="/" element={<LaunchScreen/>}/>
                    <Route path="/register" element={<RegisterScreen/>}/>
                    <Route path="/login" element={<LoginScreen/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/about" element={<About/>}/>
                    <Route path="/creategame" element={<CreateGame/>}/>
                    <Route path="/session/:gameId" element={<Session/>}/>
                </Routes>
            </AppContext.Provider>
        </div>
    );
};
