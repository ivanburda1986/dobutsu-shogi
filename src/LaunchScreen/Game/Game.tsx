import {FC, useContext} from "react";
import {Link} from "react-router-dom";
import {Card} from "react-bootstrap";
import styles from './Game.module.css';

import {AppContext} from "../../context/AppContext";
import {AppContextInterface} from "../../App";
import {getSingleGameDetails, useDeleteGame, useJoinGame} from "../../api/firestore";
import {ReturnedGameInterface} from "../WaitingGamesList/WaitingGamesList";
import {displayDeleteOption, shouldShowAcceptButton, shouldShowGoToGameButton} from "./GameService";
import {Avatar} from "../../Avatar/Avatar";

export const Game: FC<ReturnedGameInterface> = ({
                                                    gameId,
                                                    creatorId,
                                                    creatorName,
                                                    creatorPhotoURL,
                                                    opponentId,
                                                    opponentName,
                                                    opponentPhotoURL,
                                                    currentPlayerTurn,
                                                    name,
                                                    status,
                                                }) => {
    const appContext: AppContextInterface = useContext(AppContext);
    const deleteGame = useDeleteGame;
    const joinGame = useJoinGame;

    return (
        <Card style={{width: "18rem"}}
              className={`${styles.DobutsuGreen} ${appContext.loggedInUserUserId === currentPlayerTurn && status !== "COMPLETED" && styles.YourTurn} p-0 m-2 border-radius border-4`}>
            <Card.Header className="d-flex justify-content-between">
                <span className="d-flex align-items-center">
                    <Card.Title className="me-2">{name}</Card.Title>
                <Avatar name={creatorPhotoURL} small/>
                    <Avatar name={opponentPhotoURL} small/>
                </span>
                {displayDeleteOption({creatorId, appContext, gameStatus: status}) && (
                    <button type="button" className="btn-close" aria-label="Close" onClick={() => deleteGame(gameId)}/>
                )}
            </Card.Header>
            <Card.Body>
                <p>Created by: {creatorName}</p>
                <p>Joined by: {opponentName}</p>
                {appContext.loggedInUserUserId === currentPlayerTurn && status !== "COMPLETED" &&
                    <span style={{color: "darkgreen"}}>Your turn!</span>}
                {/*<p>State: {status}</p>*/}
            </Card.Body>
            <Card.Footer>
                {shouldShowAcceptButton({
                    loggedInUserUserId: appContext.loggedInUserUserId,
                    creatorId: creatorId,
                    opponentId: opponentId
                }) && (
                    <Link
                        to={`/session/${gameId}`}
                        className={`btn btn-success btn-sm me-2 `}
                        onClick={() => {
                            getSingleGameDetails({gameId: gameId}).then((doc) => {
                                let data = doc.data();
                                if (!data?.opponentJoined) {
                                    joinGame({
                                        gameId: gameId,
                                        joiningPlayerType: "OPPONENT",
                                        joiningPlayerId: appContext.loggedInUserUserId,
                                        joiningPlayerName: appContext.loggedInUserDisplayName,
                                        joiningPlayerPhotoURL: appContext.loggedInUserPhotoURL,
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
                        to={`/session/${gameId}`}
                        className={`btn btn-success btn-sm `}
                        onClick={() => {
                            getSingleGameDetails({gameId: gameId}).then((doc) => {
                                let data = doc.data();
                                if (!data?.creatorJoined) {
                                    joinGame({
                                        gameId: gameId,
                                        joiningPlayerType: "CREATOR",
                                        joiningPlayerId: appContext.loggedInUserUserId,
                                        joiningPlayerName: appContext.loggedInUserDisplayName,
                                        joiningPlayerPhotoURL: appContext.loggedInUserPhotoURL,
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
