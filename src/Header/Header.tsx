import React from "react";
import { Avatar } from "./Avatar/Avatar";
import { Button } from "../components/Button/Button";
import styles from "./Header.module.css";

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <Button name="Logout" bgColor="tomato" borderColor="red" />
      <Avatar name={"avatar2"} />
    </header>
  );
};
