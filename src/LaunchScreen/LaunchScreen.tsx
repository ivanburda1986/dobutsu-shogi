import React from "react";
import { Container } from "react-bootstrap";
import { WaitingGamesList } from "./WaitingGamesList/WaitingGamesList";

export const LaunchScreen: React.FC = () => {
  return (
    <Container>
      <WaitingGamesList />
    </Container>
  );
};
