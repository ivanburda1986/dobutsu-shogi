import {FC, useContext} from "react";
import {Link} from "react-router-dom";
import {Button, Card} from "react-bootstrap";

import {AppContext} from "../../context/AppContext";
import {ProvidedContextInterface} from "../../App";
import {getSingleGameDetails, useDeleteGame, useJoinGame} from "../../api/firestore";
import {ReturnedGameInterface} from "../WaitingGamesList/WaitingGamesList";
import {
    displayDeleteOption,
    shouldShowAcceptButton,
    shouldShowGoToGameButton,
    whichBackroundToUse
} from "./GameService";

export const Game: FC<ReturnedGameInterface> = ({
                                                    id,
                                                    creatorId,
                                                    creatorName,
                                                    opponentId,
                                                    opponentName,
                                                    name,
                                                    status,
                                                    type
                                                }) => {
    const appContext: ProvidedContextInterface = useContext(AppContext);
    const deleteGame = useDeleteGame;
    const joinGame = useJoinGame;

    return (
        <Card style={{width: "18rem"}}
              className={`p-0 m-2 border-radius border-4 text-white bg-${whichBackroundToUse(type)}`}>
            <Card.Header className="d-flex justify-content-between">
                <Card.Title>{name}</Card.Title>
                {displayDeleteOption({creatorId, appContext, gameStatus: status}) && (
                    <Button style={{maxHeight: "30px"}} variant="light" size="sm" onClick={() => deleteGame(id)}>
                        x
                    </Button>
                )}
            </Card.Header>
            <Card.Body>
                <p>Created by: {creatorName}</p>
                <p>Joined by: {opponentName}</p>
                <p>State: {status}</p>
            </Card.Body>
            <Card.Footer>
                {shouldShowAcceptButton({
                    loggedInUserUserId: appContext.loggedInUserUserId,
                    creatorId: creatorId,
                    opponentId: opponentId
                }) && (
                    <Link
                        to={`/session/${id}`}
                        className={`btn btn-primary btn-sm me-2 `}
                        onClick={() => {
                            getSingleGameDetails({gameId: id}).then((doc) => {
                                let data = doc.data();
                                if (!data?.opponentJoined) {
                                    joinGame({
                                        gameId: id,
                                        joiningPlayerType: "OPPONENT",
                                        joiningPlayerId: appContext.loggedInUserUserId,
                                        joiningPlayerName: appContext.loggedInUserDisplayName,
                                        joiningPlayerPhotoURL: appContext.loggedInUserPhotoURL,
                                        type: type
                                    });
                                }
                                return;
                            });
                        }}
                    >
                        <span>Accept the game</span>
                    </Link>
                )}
                {shouldShowGoToGameButton({
                    loggedInUserUserId: appContext.loggedInUserUserId,
                    creatorId,
                    opponentId
                }) && (
                    <Link
                        to={`/session/${id}`}
                        className={`btn btn-primary btn-sm `}
                        onClick={() => {
                            getSingleGameDetails({gameId: id}).then((doc) => {
                                let data = doc.data();
                                if (!data?.creatorJoined) {
                                    joinGame({
                                        gameId: id,
                                        joiningPlayerType: "CREATOR",
                                        joiningPlayerId: appContext.loggedInUserUserId,
                                        joiningPlayerName: appContext.loggedInUserDisplayName,
                                        joiningPlayerPhotoURL: appContext.loggedInUserPhotoURL,
                                        type: type
                                    });
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
