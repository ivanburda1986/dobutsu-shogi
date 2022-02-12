import React, { useEffect, useState, useContext } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router";
import { ProvidedContextInterface } from "../App";
import { AppContext } from "../context/AppContext";

import { Board } from "./Board/Board";

import styles from "./Session.module.css";

export const Session = () => {
  const { gameId } = useParams();
  const appContext: ProvidedContextInterface = useContext(AppContext);
  console.log(gameId);
  return (
    <Container className={styles.Session}>
      <Board type="DOBUTSU" />
    </Container>
  );
};
