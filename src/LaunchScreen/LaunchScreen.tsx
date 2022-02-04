import React from "react";

import styles from "./LaunchScreen.module.css";
import sharedStyles from "../sharedStyles.module.css";
import { Game } from "../CreateGame/newGameClass";
import { Container } from "react-bootstrap";
import { WaitingGamesList } from "./WaitingGamesList/WaitingGamesList";

export const LaunchScreen: React.FC = () => {
  return (
    <Container>
      <WaitingGamesList />
    </Container>
  );
};
