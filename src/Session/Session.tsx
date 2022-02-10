import React from "react";
import { Container } from "react-bootstrap";
import { Board } from "./Board/Board";
import { Stone } from "./Board/Stones/Stone";
import styles from "./Session.module.css";

export const Session = () => {
  return (
    <Container className={styles.Session}>
      <Stone />
      <Board type="DOBUTSU" />
    </Container>
  );
};
