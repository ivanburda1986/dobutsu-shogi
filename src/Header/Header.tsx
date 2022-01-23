import React from "react";
import { Avatar } from "./Avatar/Avatar";
import { Button } from "react-bootstrap";
import styles from "./Header.module.css";

export const Header: React.FC = () => {
  return (
    <header className={`${styles.header} container-fluid d-flex flex-row justify-content-between align-items-center py-2`}>
      <h2>Dobutsu Shogi</h2>
      <Button>Log in</Button>
    </header>
  );
};
