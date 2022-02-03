import React, { useContext } from "react";

import { Avatar } from "./Avatar/Avatar";
import { Button } from "react-bootstrap";
import styles from "./Header.module.css";
import { NavLink } from "react-router-dom";
import { useLogoutUser } from "../api/firestore";
import { AppContext } from "../context/AppContext";

export const Header: React.FC = () => {
  const appContext = useContext(AppContext);

  const logout = useLogoutUser;

  return (
    <header className={`${styles.header} container-fluid d-flex flex-row justify-content-between align-items-center`}>
      <h2>
        <NavLink to="/" className="btn fs-3">
          Dobutsu Shogi
        </NavLink>
      </h2>
      <div className="d-flex flex-row justify-content-between ">
        {appContext.userLoggedIn && (
          <NavLink to="/profile" className="btn mx-2 d-flex flex-row justify-content-between align-items-center">
            <Avatar name={appContext.loggedInUserAvatarImg} />
            <span className="ms-1 fs-4">{appContext.loggedInUserUsername ? appContext.loggedInUserUsername : "Username"}</span>
          </NavLink>
        )}

        {!appContext.userLoggedIn && (
          <NavLink to="/login" className={`btn btn-primary mx-3 my-auto ${styles.headerButton} justify-content-center`}>
            Log in
          </NavLink>
        )}
        {appContext.userLoggedIn && (
          <NavLink to="/" className={`btn btn-danger mx-3 my-auto ${styles.headerButton} justify-content-center`} onClick={() => logout()}>
            Log out
          </NavLink>
        )}
      </div>
    </header>
  );
};
