import {FC, useContext} from "react";
import {NavLink} from "react-router-dom";
import {useLogoutUser} from "../api/firestore";

import {ProvidedContextInterface} from "../App";
import {AppContext} from "../context/AppContext";
import {Avatar} from "./Avatar/Avatar";
import styles from "./Header.module.css";

export const Header: FC = () => {
    const appContext: ProvidedContextInterface = useContext(AppContext);
    const logout = useLogoutUser;

    return (
        <header
            className={`${styles.header} container-fluid d-flex flex-row justify-content-between align-items-center mb-5`}>
            <h2>
                <NavLink to="/" className="btn fs-2">
                    Dobutsu Shogi
                </NavLink>
            </h2>
            <div className="d-flex flex-row justify-content-between ">
                {appContext.userLoggedIn && (
                    <NavLink to="/profile"
                             className="btn mx-2 d-flex flex-row justify-content-between align-items-center">
                        <Avatar name={appContext.loggedInUserPhotoURL}/>
                        <span
                            className="ms-1 fs-4">{appContext.loggedInUserDisplayName ? appContext.loggedInUserDisplayName : "Username"}</span>
                    </NavLink>
                )}

                {!appContext.userLoggedIn && (
                    <NavLink to="/login" className="btn btn-primary mx-3 my-auto justify-content-center">
                        Log in
                    </NavLink>
                )}
                {appContext.userLoggedIn && (
                    <NavLink to="/creategame" className="btn btn-primary mx-3 my-auto justify-content-center">
                        Create Game
                    </NavLink>
                )}
                {appContext.userLoggedIn && (
                    <NavLink to="/" className="btn btn-danger mx-3 my-auto justify-content-center"
                             onClick={() => logout()}>
                        Log out
                    </NavLink>
                )}
            </div>
        </header>
    );
};
