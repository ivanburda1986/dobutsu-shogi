import { FC } from "react";
import { NavLink } from "react-router-dom";
import { logoutUser } from "../../api/firestore";
import { AppContextInterface } from "../../App";
import { Avatar } from "../../Avatar/Avatar";
import { TiInfoLargeOutline } from "react-icons/ti";
import styles from "./Navigation.module.css";

export const Navigation: FC<
  Pick<
    AppContextInterface,
    "userLoggedIn" | "loggedInUserDisplayName" | "loggedInUserPhotoURL"
  >
> = ({ userLoggedIn, loggedInUserDisplayName, loggedInUserPhotoURL }) => {
  const logout = logoutUser;
  return (
    <header
      className={`${styles.Navigation} d-none d-md-flex flex-row justify-content-between align-items-center mb-2`}
    >
      <div>
        <NavLink to="/" className="btn">
          <button type="button" className="btn btn-success fs4">
            Dobutsu Shogi
          </button>
        </NavLink>
        {userLoggedIn && (
          <NavLink to="about" className="btn">
            <button type="button" className="btn btn-warning fs4 text-light">
              <TiInfoLargeOutline
                style={{ fontSize: "24px", color: "white" }}
              />{" "}
              Info
            </button>
          </NavLink>
        )}
      </div>
      <div className="d-flex flex-row justify-content-between ">
        {userLoggedIn && (
          <NavLink
            to="/profile"
            className="btn mx-2 d-flex flex-row justify-content-between align-items-center"
          >
            <Avatar name={loggedInUserPhotoURL} big />
            <span className="ms-1 fs-4">
              {loggedInUserDisplayName ? loggedInUserDisplayName : "Username"}
            </span>
          </NavLink>
        )}

        {!userLoggedIn && (
          <NavLink
            to="/login"
            className="btn btn-primary mx-3 my-auto justify-content-center align-items-end"
          >
            Log in
          </NavLink>
        )}
        {userLoggedIn && (
          <NavLink
            to="/creategame"
            className="btn btn-primary mx-3 my-auto justify-content-center"
          >
            New Game
          </NavLink>
        )}
        {userLoggedIn && (
          <NavLink
            to="/"
            className="btn btn-danger mx-3 my-auto justify-content-center"
            onClick={() => logout()}
          >
            LogOut
          </NavLink>
        )}
      </div>
    </header>
  );
};
