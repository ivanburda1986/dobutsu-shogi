import styles from "./Navigation.module.css";
import {NavLink} from "react-router-dom";
import {Avatar} from "../Avatar/Avatar";
import {FunctionComponent} from "react";
import {AppContextInterface} from "../../App";
import {useLogoutUser} from "../../api/firestore";
import {TiInfoLargeOutline} from 'react-icons/ti';


export const Navigation: FunctionComponent<Pick<AppContextInterface, "isUserLoggedIn" | "loggedInUserDisplayName" | "loggedInUserPhotoURL">> = ({
                                                                                                                                                    isUserLoggedIn,
                                                                                                                                                    loggedInUserDisplayName,
                                                                                                                                                    loggedInUserPhotoURL
                                                                                                                                                }) => {
    const logout = useLogoutUser;
    return (
        <header
            className={`${styles.Navigation} d-none d-md-flex flex-row justify-content-between align-items-center mb-2`}>

            <div>
                <NavLink to="/" className="btn">
                    <button type="button" className="btn btn-success fs4">Dobutsu Shogi</button>
                </NavLink>
                {isUserLoggedIn && <NavLink to="about" className="btn">
                    <button type="button" className="btn btn-warning fs4 text-light">
                        <TiInfoLargeOutline style={{fontSize: '24px', color: 'white'}}/> Info
                    </button>
                </NavLink>}
            </div>
            <div className="d-flex flex-row justify-content-between ">
                {isUserLoggedIn && (
                    <NavLink to="/profile"
                             className="btn mx-2 d-flex flex-row justify-content-between align-items-center">
                        <Avatar name={loggedInUserPhotoURL}/>
                        <span
                            className="ms-1 fs-4">{loggedInUserDisplayName ? loggedInUserDisplayName : "Username"}</span>
                    </NavLink>
                )}

                {!isUserLoggedIn && (
                    <NavLink to="/login"
                             className="btn btn-primary mx-3 my-auto justify-content-center align-items-end">
                        Log in
                    </NavLink>
                )}
                {isUserLoggedIn && (
                    <NavLink to="/creategame" className="btn btn-primary mx-3 my-auto justify-content-center">
                        New Game
                    </NavLink>
                )}
                {isUserLoggedIn && (
                    <NavLink to="/" className="btn btn-danger mx-3 my-auto justify-content-center"
                             onClick={() => logout()}>
                        LogOut
                    </NavLink>
                )}
            </div>
        </header>

    );
};