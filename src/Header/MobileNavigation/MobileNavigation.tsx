import styles from "./MobileNavigation.module.css";
import {NavLink} from "react-router-dom";
import {Avatar} from "../Avatar/Avatar";
import {FunctionComponent} from "react";
import {ProvidedContextInterface} from "../../App";
import {useLogoutUser} from "../../api/firestore";


export const MobileNavigation: FunctionComponent<Pick<ProvidedContextInterface, "userLoggedIn" | "loggedInUserDisplayName" | "loggedInUserPhotoURL">> = ({
                                                                                                                                                             userLoggedIn,
                                                                                                                                                             loggedInUserDisplayName,
                                                                                                                                                             loggedInUserPhotoURL
                                                                                                                                                         }) => {
    const logout = useLogoutUser;
    return (
        <header
            className={`${styles.MobileNavigation} d-flex d-sm-none justify-content-between align-items-center mb-2`}>
            {/*Logged-out: Top navigation*/}
            <div className="d-flex justify-content-between align-items-center w-100 py-2">
                {userLoggedIn &&
                    <NavLink to="/"
                             className="btn btn-success ms-3 justify-content-center">
                        Shogi
                    </NavLink>
                }
                {userLoggedIn && (
                    <NavLink to="/creategame"
                             className="btn btn-primary justify-content-center">
                        New
                    </NavLink>
                )}
                {userLoggedIn && <NavLink to="/profile"
                                          className="btn d-flex flex-row justify-content-between align-items-center py-0">
                    <Avatar name={loggedInUserPhotoURL} small/>
                </NavLink>}

                {!userLoggedIn && (
                    <>
                        <span className="ms-3 fs-3">Dobutsu Shogi</span>
                        <NavLink to="/login"
                                 className="btn btn-primary mx-3 my-auto">
                            Log in
                        </NavLink>
                    </>
                )}
                {userLoggedIn && (
                    <NavLink to="/" className="btn btn-danger me-3"
                             onClick={() => logout()}>
                        Log out
                    </NavLink>
                )}
            </div>
        </header>

    );
};