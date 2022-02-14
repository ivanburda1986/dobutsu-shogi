import React, { useEffect, useState, useContext } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router";

import { getSingleGameDetails } from "../api/firestore";
import { ProvidedContextInterface } from "../App";
import { AppContext } from "../context/AppContext";

import { Board } from "./Board/Board";

import styles from "./Session.module.css";
import { evaluateBeingOpponent } from "./SessionService";

export const Session = () => {
  const [amIOpponent, setAmIOpponent] = useState(false);
  const { gameId } = useParams();
  const appContext: ProvidedContextInterface = useContext(AppContext);

  useEffect(() => {
    getSingleGameDetails({ gameId: gameId! }).then((doc) => {
      let data = doc.data();
      if (evaluateBeingOpponent({ creatorId: data!.creatorId, loggedInUserUserId: appContext.loggedInUserUserId })) {
        setAmIOpponent(true);
      }
    });
  }, [appContext, gameId]);

  return (
    <Container fluid className={styles.Session}>
      <Board type="DOBUTSU" amIOpponent={amIOpponent} />
    </Container>
  );
};

// rotateByDeg={rotateOponentUI({ creatorId, loggedInUserUserId: appContext.loggedInUserUserId })}
