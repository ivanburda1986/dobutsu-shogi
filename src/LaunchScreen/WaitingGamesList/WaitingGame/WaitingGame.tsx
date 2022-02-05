import React from "react";
import { Card, Button, ListGroup } from "react-bootstrap";
import { gameType, statusType } from "../../../CreateGame/newGameClass";

interface WaitingGameInterface {
  createdOn?: number;
  creatorId: string;
  creatorName: string;
  name: string;
  status?: statusType;
  type: gameType;
}
export const WaitingGame: React.FC<WaitingGameInterface> = ({ createdOn, creatorId, creatorName, name, status, type }) => {
  const whichBackroundToUse = () => {
    if (type === "DOBUTSU") {
      return "success";
    }
    if (type === "GOROGORO") {
      return "warning";
    }
    return "danger";
  };

  return (
    <Card style={{ width: "18rem" }} className={`p-0 m-2 border-radius border-4 text-white bg-${whichBackroundToUse()}`}>
      <Card.Header>
        <Card.Title>{name}</Card.Title>
      </Card.Header>
      <Card.Body>
        <p>Created by: {creatorName}</p>
      </Card.Body>
      <Card.Footer>
        <Button variant="primary" size="sm">
          Join the game
        </Button>
      </Card.Footer>
    </Card>
  );
};
