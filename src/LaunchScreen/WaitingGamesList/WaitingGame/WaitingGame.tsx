import React, { useContext } from "react";
import { Card, Button, ListGroup } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useDeleteGame, gameType, statusType } from "../../../api/firestore";
import { AppContext } from "../../../context/AppContext";

interface WaitingGameInterface {
  id: string;
  createdOn?: number;
  creatorId: string;
  creatorName: string;
  name: string;
  status?: statusType;
  type: gameType;
}
export const WaitingGame: React.FC<WaitingGameInterface> = ({ id, createdOn, creatorId, creatorName, name, status, type }) => {
  const appContext = useContext(AppContext);
  const deleteGame = useDeleteGame;
  const whichBackroundToUse = () => {
    if (type === "DOBUTSU") {
      return "success";
    }
    if (type === "GOROGORO") {
      return "warning";
    }
    return "danger";
  };

  const displayDeleteOption = () => {
    if (creatorId === appContext.loggedInUserUserId) {
      return true;
    }
    return false;
  };

  const onDeleteGame = (id: string) => {
    deleteGame(id);
  };

  return (
    <Card style={{ width: "18rem" }} className={`p-0 m-2 border-radius border-4 text-white bg-${whichBackroundToUse()}`}>
      <Card.Header className="d-flex justify-content-between">
        <Card.Title>{name}</Card.Title>
        {displayDeleteOption() && (
          <Button style={{ maxHeight: "30px" }} variant="light" size="sm" onClick={() => onDeleteGame(id)}>
            x
          </Button>
        )}
      </Card.Header>
      <Card.Body>
        <p>Created by: {creatorName}</p>
        <p>Type: {type}</p>
      </Card.Body>
      <Card.Footer>
        <NavLink to="/session" className={`btn btn-primary btn-sm `}>
          Join the game
        </NavLink>
      </Card.Footer>
    </Card>
  );
};
