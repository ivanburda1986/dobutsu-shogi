import React from "react";
import styles from "./Header.module.css";
import sharedStyles from "../sharedStyles.module.css";

export const Header: React.FC = () => {
  return (
    <header>
      Header
      <button className={`${sharedStyles.button} ${styles.logoutButton}`}>Logout</button>
    </header>
  );
};
