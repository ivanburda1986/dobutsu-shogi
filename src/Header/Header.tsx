import React from "react";
import { Avatar } from "./Avatar/Avatar";
import { Button } from "react-bootstrap";
import styles from "./Header.module.css";
import { NavLink } from "react-router-dom";
import { useLogoutUser } from "../api/firestore";

interface HeaderInterface {
  loggedInUserEmail: string | undefined;
}

export const Header: React.FC = () => {
  const logout = useLogoutUser;
  return (
    <header className={`${styles.header} container-fluid d-flex flex-row justify-content-between align-items-center py-2`}>
      <h2>
        <NavLink to="/" className="btn fs-3">
          Dobutsu Shogi
        </NavLink>
      </h2>
      <div className="d-flex flex-row justify-content-between ">
        <NavLink to="/profile" className="btn mx-2">
          Username
        </NavLink>
        <NavLink to="/login" className="btn btn-primary">
          Log in
        </NavLink>
        <NavLink to="/" className="btn btn-danger mx-3" onClick={() => logout()}>
          Log out
        </NavLink>
      </div>
    </header>
  );
};
