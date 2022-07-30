import styles from "./MobileNavigation.module.css";
import {NavLink} from "react-router-dom";
import {Avatar} from "../Avatar/Avatar";
import {FunctionComponent} from "react";
import {AppContextInterface} from "../../App";
import {useLogoutUser} from "../../api/firestore";
import {TiInfoLargeOutline} from "react-icons/ti";
import {MdLogout} from "react-icons/md";


export const MobileNavigation: FunctionComponent<Pick<AppContextInterface, "isUserLoggedIn" | "loggedInUserDisplayName" | "loggedInUserPhotoURL">> = ({
                                                                                                                                                          isUserLoggedIn,
                                                                                                                                                          loggedInUserDisplayName,
                                                                                                                                                          loggedInUserPhotoURL
                                                                                                                                                      }) => {
    const logout = useLogoutUser;
    return (
        <header
            className={`${styles.MobileNavigation} d-flex d-md-none justify-content-between align-items-center mb-2`}>
            {/*Logged-out: Top navigation*/}
            <div className="d-flex justify-content-between align-items-center w-100 py-2">
                {isUserLoggedIn &&
                    <NavLink to="/"
                             className="btn btn-success ms-2 justify-content-center">
                        Shogi
                    </NavLink>

                }
                {isUserLoggedIn &&
                    <NavLink to="about" className="btn">
                        <button type="button" className="btn btn-warning fs4">
                            <TiInfoLargeOutline style={{fontSize: '24px', color: 'white'}}/>
                        </button>
                    </NavLink>
                }
                {isUserLoggedIn && (
                    <NavLink to="/creategame"
                             className="btn btn-primary justify-content-center">
                        New
                    </NavLink>
                )}
                {isUserLoggedIn && <NavLink to="/profile"
                                            className="btn d-flex flex-row justify-content-between align-items-center py-0">
                    <Avatar name={loggedInUserPhotoURL} medium/>
                </NavLink>}

                {!isUserLoggedIn && (
                    <>
                        <span className="ms-3 fs-3">Dobutsu Shogi</span>
                        <NavLink to="/login"
                                 className="btn btn-primary mx-2 my-auto">
                            Log in
                        </NavLink>
                    </>
                )}
                {isUserLoggedIn && (
                    <NavLink to="/" className="btn btn-danger me-3"
                             onClick={() => logout()}>
                        <MdLogout/>
                    </NavLink>
                )}
            </div>
        </header>

    );
};