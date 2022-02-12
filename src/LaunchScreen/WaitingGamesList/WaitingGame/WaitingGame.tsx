import { FC, useContext } from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

import { AppContext } from "../../../context/AppContext";
import { ProvidedContextInterface } from "../../../App";
import { useDeleteGame, useUpdateGame } from "../../../api/firestore";
import { ReturnedGameInterface } from "../WaitingGamesList";
import { whichBackroundToUse, displayDeleteOption } from "./WaitingGameService";

export const WaitingGame: FC<ReturnedGameInterface> = ({ id, creatorId, creatorName, opponentId, name, status, type }) => {
  const appContext: ProvidedContextInterface = useContext(AppContext);
  const deleteGame = useDeleteGame;
  const updateGame = useUpdateGame;

  interface shouldShowButtonInterface {
    loggedInUserUserId: string;
    creatorId: string;
    opponentId: string | null;
  }
  const shouldShowAcceptButton = ({ loggedInUserUserId, creatorId, opponentId }: shouldShowButtonInterface) => {
    if (opponentId === null && loggedInUserUserId !== creatorId) {
      return true;
    } else {
      return false;
    }
  };

  const shouldShowGoToGameButton = ({ loggedInUserUserId, creatorId, opponentId }: shouldShowButtonInterface) => {
    if (loggedInUserUserId === creatorId || loggedInUserUserId === opponentId) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Card style={{ width: "18rem" }} className={`p-0 m-2 border-radius border-4 text-white bg-${whichBackroundToUse(type)}`}>
      <Card.Header className="d-flex justify-content-between">
        <Card.Title>{name}</Card.Title>
        {displayDeleteOption({ creatorId, appContext }) && (
          <Button style={{ maxHeight: "30px" }} variant="light" size="sm" onClick={() => deleteGame(id)}>
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
        {shouldShowAcceptButton({ loggedInUserUserId: appContext.loggedInUserUserId, creatorId: creatorId, opponentId: opponentId }) && (
          <Link to={`/session/${id}`} className={`btn btn-primary btn-sm me-2 `} onClick={() => updateGame({ id: id, updatedDetails: { opponentId: appContext.loggedInUserUserId, opponentName: appContext.loggedInUserDisplayName, status: "INPROGRESS" } })}>
            <span>Accept the game</span>
          </Link>
        )}
        {shouldShowGoToGameButton({ loggedInUserUserId: appContext.loggedInUserUserId, creatorId, opponentId }) && (
          <Link to={`/session/${id}`} className={`btn btn-primary btn-sm `}>
            Go to the game
          </Link>
        )}
      </Card.Footer>
    </Card>
  );
};
