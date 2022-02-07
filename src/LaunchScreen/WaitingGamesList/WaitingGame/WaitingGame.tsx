import React, { FC, useContext } from "react";
import { NavLink } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

import { AppContext } from "../../../context/AppContext";
import { ProvidedContextInterface } from "../../../App";
import { useDeleteGame } from "../../../api/firestore";
import { ReturnedGameInterface } from "../WaitingGamesList";

export const WaitingGame: FC<ReturnedGameInterface> = ({ id, creatorId, creatorName, name, status, type }) => {
  const appContext: ProvidedContextInterface = useContext(AppContext);

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
        <p>State: {status}</p>
      </Card.Body>
      <Card.Footer>
        <NavLink to="/session" className={`btn btn-primary btn-sm `}>
          Join the game
        </NavLink>
      </Card.Footer>
    </Card>
  );
};
