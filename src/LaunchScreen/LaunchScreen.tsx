import React from "react";

import styles from "./LaunchScreen.module.css";
import sharedStyles from "../sharedStyles.module.css";
import { Container } from "react-bootstrap";
import { WaitingGamesList } from "./WaitingGamesList/WaitingGamesList";

import { DocumentData, onSnapshot } from "firebase/firestore";

export const LaunchScreen: React.FC = () => {
  return (
    <Container>
      <WaitingGamesList />
    </Container>
  );
};
