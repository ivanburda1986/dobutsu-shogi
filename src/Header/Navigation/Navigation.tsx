import styles from "./Navigation.module.css";
import {NavLink} from "react-router-dom";
import {Avatar} from "../Avatar/Avatar";
import {FunctionComponent} from "react";
import {ProvidedContextInterface} from "../../App";
import {useLogoutUser} from "../../api/firestore";


export const Navigation: FunctionComponent<Pick<ProvidedContextInterface, "userLoggedIn" | "loggedInUserDisplayName" | "loggedInUserPhotoURL">> = ({
                                                                                                                                                       userLoggedIn,
                                                                                                                                                       loggedInUserDisplayName,
                                                                                                                                                       loggedInUserPhotoURL
                                                                                                                                                   }) => {
    const logout = useLogoutUser;
    return (
        <header
            className={`${styles.Navigation} d-none d-sm-flex flex-row justify-content-between align-items-center mb-2`}>
            <NavLink to="/" className="btn">
                <button type="button" className="btn btn-success fs4">Dobutsu Shogi</button>
            </NavLink>
            <div className="d-flex flex-row justify-content-between ">
                {userLoggedIn && (
                    <NavLink to="/profile"
                             className="btn mx-2 d-flex flex-row justify-content-between align-items-center">
                        <Avatar name={loggedInUserPhotoURL}/>
                        <span
                            className="ms-1 fs-4">{loggedInUserDisplayName ? loggedInUserDisplayName : "Username"}</span>
                    </NavLink>
                )}

                {!userLoggedIn && (
                    <NavLink to="/login"
                             className="btn btn-primary mx-3 my-auto justify-content-center align-items-end">
                        Log in
                    </NavLink>
                )}
                {userLoggedIn && (
                    <NavLink to="/creategame" className="btn btn-primary mx-3 my-auto justify-content-center">
                        New Game
                    </NavLink>
                )}
                {userLoggedIn && (
                    <NavLink to="/" className="btn btn-danger mx-3 my-auto justify-content-center"
                             onClick={() => logout()}>
                        Log out
                    </NavLink>
                )}
            </div>
        </header>

    );
};