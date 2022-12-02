import { FC } from "react";
import { NavLink } from "react-router-dom";
import { logoutUser } from "../../api/firestore";
import { AppContextInterface } from "../../App";

import { Avatar } from "../../Avatar/Avatar";
import { TiInfoLargeOutline } from "react-icons/ti";
import { MdLogout } from "react-icons/md";
import styles from "./MobileNavigation.module.css";

export const MobileNavigation: FC<
  Pick<AppContextInterface, "userLoggedIn" | "loggedInUserPhotoURL">
> = ({ userLoggedIn, loggedInUserPhotoURL }) => {
  return (
    <header
      className={`${styles.MobileNavigation} d-flex d-md-none justify-content-between align-items-center mb-2`}
    >
      <div className="d-flex justify-content-between align-items-center w-100 py-2">
        {userLoggedIn && (
          <NavLink
            to="/"
            className="btn btn-success ms-2 justify-content-center"
          >
            Shogi
          </NavLink>
        )}
        {userLoggedIn && (
          <NavLink to="about" className="btn">
            <button type="button" className="btn btn-warning fs4">
              <TiInfoLargeOutline
                style={{ fontSize: "24px", color: "white" }}
              />
            </button>
          </NavLink>
        )}
        {userLoggedIn && (
          <NavLink
            to="/creategame"
            className="btn btn-primary justify-content-center"
          >
            New
          </NavLink>
        )}
        {userLoggedIn && (
          <NavLink
            to="/profile"
            className="btn d-flex flex-row justify-content-between align-items-center py-0"
          >
            <Avatar name={loggedInUserPhotoURL} />
          </NavLink>
        )}

        {!userLoggedIn && (
          <>
            <span className="ms-3 fs-3">Dobutsu Shogi</span>
            <NavLink to="/login" className="btn btn-primary mx-2 my-auto">
              Log in
            </NavLink>
          </>
        )}
        {userLoggedIn && (
          <NavLink
            to="/"
            className="btn btn-danger me-3"
            onClick={() => logoutUser()}
          >
            <MdLogout />
          </NavLink>
        )}
      </div>
    </header>
  );
};
