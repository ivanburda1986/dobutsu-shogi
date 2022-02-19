import { FC, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

import { AppContext } from "../../../context/AppContext";
import { ProvidedContextInterface } from "../../../App";
import { useDeleteGame, useUpdateGame, useJoinGame, getSingleGameDetails } from "../../../api/firestore";
import { ReturnedGameInterface } from "../WaitingGamesList";
import { whichBackroundToUse, displayDeleteOption, shouldShowAcceptButton, shouldShowGoToGameButton } from "./WaitingGameService";

export const WaitingGame: FC<ReturnedGameInterface> = ({ id, creatorId, creatorName, opponentId, name, status, type }) => {
  const appContext: ProvidedContextInterface = useContext(AppContext);
  const deleteGame = useDeleteGame;
  const joinGame = useJoinGame;
  const { gameId } = useParams();

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
          <Link
            to={`/session/${id}`}
            className={`btn btn-primary btn-sm me-2 `}
            onClick={() => {
              getSingleGameDetails({ gameId: id }).then((doc) => {
                let data = doc.data();
                if (!data?.opponentJoined) {
                  joinGame({ gameId: id, joiningPlayerType: "OPPONENT", joiningPlayerId: appContext.loggedInUserUserId, joiningPlayerName: appContext.loggedInUserDisplayName, joiningPlayerPhotoURL: appContext.loggedInUserPhotoURL, type: type });
                }
                return;
              });
            }}
          >
            <span>Accept the game</span>
          </Link>
        )}
        {shouldShowGoToGameButton({ loggedInUserUserId: appContext.loggedInUserUserId, creatorId, opponentId }) && (
          <Link
            to={`/session/${id}`}
            className={`btn btn-primary btn-sm `}
            onClick={() => {
              getSingleGameDetails({ gameId: id }).then((doc) => {
                let data = doc.data();
                if (!data?.creatorJoined) {
                  joinGame({ gameId: id, joiningPlayerType: "CREATOR", joiningPlayerId: appContext.loggedInUserUserId, joiningPlayerName: appContext.loggedInUserDisplayName, joiningPlayerPhotoURL: appContext.loggedInUserPhotoURL, type: type });
                }
                return;
              });
            }}
          >
            Go to the game
          </Link>
        )}
      </Card.Footer>
    </Card>
  );
};
