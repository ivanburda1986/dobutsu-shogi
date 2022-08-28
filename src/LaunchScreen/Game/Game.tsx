import {FC, useCallback, useContext} from "react";
import {Link} from "react-router-dom";
import {Card} from "react-bootstrap";

import {AppContextInterface} from "../../App";
import {AppContext} from "../../context/AppContext";
import {deleteGame, getSingleGameDetails, MoveInterface, statusType, joinGame} from "../../api/firestore";
import {
    shouldDisplayGameDeleteOption,
    isLoggedInPlayerTurn,
    shouldDisplayAcceptGameOption,
    shouldDisplayGoToGameOption
} from "./GameService";
import {Avatar} from "../../Avatar/Avatar";
import {VictoryType} from "../../Session/Board/Board";
import styles from './Game.module.css';

export interface ReturnedGameInterface {
    gameId: string;
    creatorId: string;
    creatorName?: string;
    creatorPhotoURL: string;
    opponentId: string | null;
    opponentName?: string;
    opponentPhotoURL: string;
    currentPlayerTurn?: string;
    name: string;
    status: statusType;

    createdOn?: number;
    creatorJoined?: boolean;
    finishedTimeStamp?: number;
    moveRepresentations?: string[];
    moves?: MoveInterface[];
    opponentJoined?: boolean;
    startingPlayer?: string;
    victoryType?: VictoryType;
    winner?: string;
}

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
    const {
        loggedInUserUserId,
        loggedInUserPhotoURL,
        loggedInUserDisplayName
    }: AppContextInterface = useContext(AppContext);

    const acceptGameHandler = (gameId: string, loggedInUserUserId: string, loggedInUserDisplayName: string | null, loggedInUserPhotoURL: string | null) => {
        getSingleGameDetails({gameId: gameId}).then((doc) => {
            let data = doc.data();
            if (!data?.opponentJoined) {
                joinGame({
                    gameId: gameId,
                    joiningPlayerType: "OPPONENT",
                    joiningPlayerId: loggedInUserUserId,
                    joiningPlayerName: loggedInUserDisplayName,
                    joiningPlayerPhotoURL: loggedInUserPhotoURL,
                });
            }
            return;
        });
    };

    const goToGameHandler = () => {
        getSingleGameDetails({gameId: gameId}).then((doc) => {
            let data = doc.data();
            if (!data?.creatorJoined) {
                joinGame({
                    gameId: gameId,
                    joiningPlayerType: "CREATOR",
                    joiningPlayerId: loggedInUserUserId,
                    joiningPlayerName: loggedInUserDisplayName,
                    joiningPlayerPhotoURL: loggedInUserPhotoURL,
                });
            }
            return;
        });
    };

    return (
        <Card style={{width: '18rem'}}
              className={`${styles.GameCard} ${isLoggedInPlayerTurn(loggedInUserUserId, currentPlayerTurn, status) && styles.YourTurnGameCard} p-0 m-2 border-radius border-4`}>
            <Card.Header className="d-flex justify-content-between">
                <span className="d-flex align-items-center">
                    <Card.Title className="me-2">{name}</Card.Title>
                <Avatar name={creatorPhotoURL} small/>
                    <Avatar name={opponentPhotoURL} small/>
                </span>
                {shouldDisplayGameDeleteOption({creatorId, loggedInUserUserId, gameStatus: status}) && (
                    <button type="button" className="btn-close" aria-label="Close" onClick={() => deleteGame(gameId)}/>
                )}
            </Card.Header>
            <Card.Body>
                <p>Created by: {creatorName}</p>
                <p>Joined by: {opponentName}</p>
                {isLoggedInPlayerTurn(loggedInUserUserId, currentPlayerTurn, status) &&
                    <span className={styles.YourTurnText}>Your turn!</span>}
            </Card.Body>
            <Card.Footer>
                {shouldDisplayAcceptGameOption({
                    loggedInUserUserId: loggedInUserUserId,
                    creatorId: creatorId,
                    opponentId: opponentId
                }) && (
                    <Link
                        to={`/session/${gameId}`}
                        className={`btn btn-success btn-sm me-2 `}
                        onClick={() => acceptGameHandler(gameId, loggedInUserUserId, loggedInUserDisplayName, loggedInUserPhotoURL)}
                    >
                        <span>Accept Game</span>
                    </Link>
                )}
                {shouldDisplayGoToGameOption({
                    loggedInUserUserId: loggedInUserUserId,
                    creatorId,
                    opponentId
                }) && (
                    <Link
                        to={`/session/${gameId}`}
                        className={`btn btn-success btn-sm `}
                        onClick={() => {
                            goToGameHandler();
                        }}
                    >
                        Go to Game
                    </Link>
                )}
            </Card.Footer>
        </Card>
    );
};
