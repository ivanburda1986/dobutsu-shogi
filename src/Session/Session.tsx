import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";

import { Board } from "./Board/Board";

import styles from "./Session.module.css";

export const Session = () => {
  return (
    <Container className={styles.Session}>
      <Board type="DOBUTSU" />
    </Container>
  );
};
