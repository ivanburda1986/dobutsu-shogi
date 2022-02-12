import React, { useEffect, useState, useContext } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router";

import { getSingleGameDetails } from "../api/firestore";
import { ProvidedContextInterface } from "../App";
import { AppContext } from "../context/AppContext";

import { Board } from "./Board/Board";
import { rotateOponentUI } from "./SessionService";

import styles from "./Session.module.css";

export const Session = () => {
  const { gameId } = useParams();
  const appContext: ProvidedContextInterface = useContext(AppContext);
  useEffect(() => {
    getSingleGameDetails({ gameId: gameId! });
  }, []);
  return (
    <Container className={styles.Session}>
      <Board type="DOBUTSU" />
    </Container>
  );
};

// rotateByDeg={rotateOponentUI({ creatorId, loggedInUserUserId: appContext.loggedInUserUserId })}
