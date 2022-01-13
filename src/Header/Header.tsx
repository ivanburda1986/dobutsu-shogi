import React from "react";
import { Avatar } from "./Avatar/Avatar";
import { Button } from "react-bootstrap";
import styles from "./Header.module.css";

export const Header: React.FC = () => {
  return (
    <header className={`${styles.header} d-flex flex-row justify-content-between align-items-center`}>
      Header
      <Avatar name="avatar3" />
    </header>
  );
};
