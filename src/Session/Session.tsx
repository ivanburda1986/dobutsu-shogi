import React, {useContext, useEffect, useRef, useState} from "react";
import {Container} from "react-bootstrap";
import {useParams} from "react-router";
import {
    gamesCollectionRef,
    getSingleGameDetails,
    getSingleUserStats,
    updateGame,
    updateUserStats
} from "../api/firestore";
import {AppContext} from "../context/AppContext";

import {AppContextInterface} from "../App";
import {Board} from "./Board/Board";

import {
    createAndStoreLastRoundMoveHash,
    determineStartingPlayer,
    evaluateBeingOpponent,
    evaluateBeingWinner, haveBothPlayersJoined,
    isGameDataAvailable,
    isTieEvaluation
} from "./SessionService";

import {DocumentData, onSnapshot} from "firebase/firestore";
import {GameFinishedMessage} from "./GameFinishedMessage/GameFinishedMessage";
import {RecentMoves} from "./RecentMoves/RecentMoves";
import styles from "./Session.module.css";


const increaseTieStatsCountForBothPlayers = (player1Id: string, player2Id: string): void => {
    [player1Id, player2Id].forEach((playerId) => {
        getSingleUserStats({userId: playerId}).then((serverStats) => updateUserStats({
            userId: playerId,
            updatedDetails: {tie: serverStats.data()?.tie + 1}
        }));
    });
};

export const currentGameSession = () => {
    function updateGameToBeTie(gameId: string | undefined): void {
        if (!gameId) {
            return;
        }
        updateGame({
            id: gameId,
            updatedDetails: {
                status: "TIE",
                finishedTimeStamp: Date.now(),
            }
        });

    }

    return {updateGameToBeTie, increaseTieStatsCountForBothPlayers};
};


export const Session = () => {
    const {gameId} = useParams();
    const [gameData, setGameData] = useState<DocumentData | undefined>();
    const [creatorId, setCreatorId] = useState<string | undefined>();
    const [opponentId, setOpponentId] = useState<string | undefined>();
    const [amIOpponent, setAmIOpponent] = useState(false);
    const [isTie, setIsTie] = useState(false);

    const {loggedInUserUserId}: AppContextInterface = useContext(AppContext);
    const isComponentMountedRef = useRef(true);

    useEffect(() => {
        if (!isGameDataAvailable(gameData, gameId)) {
            return;
        }
        if (haveBothPlayersJoined(gameData?.creatorId, gameData?.opponentId)) {
            setCreatorId(gameData!.creatorId);
            setOpponentId(gameData!.opponentId);
            determineStartingPlayer(gameData, gameId, updateGame);
        }

        
        if (evaluateBeingOpponent({
            creatorId: gameData?.creatorId,
            loggedInUserUserId
        })) {
            setAmIOpponent(true);
        }
        createAndStoreLastRoundMoveHash(gameData, gameId, updateGame);
        setIsTie(isTieEvaluation(gameData));

    }, [creatorId, gameData, gameId, opponentId]);

    useEffect(() => {
        if (isTie) {
            currentGameSession().updateGameToBeTie(gameId);
            increaseTieStatsCountForBothPlayers(creatorId!, opponentId!);
        }
    }, [creatorId, gameId, isTie, opponentId]);

    useEffect(() => {
        onSnapshot(gamesCollectionRef, (snapshot) => {
            if (isComponentMountedRef.current && gameId) {
                getSingleGameDetails({gameId: gameId}).then((data) => setGameData(data.data()));
            }
        });
    }, [gameId]);

    // Evaluate whether I am an opponent or creator and make sure my interface is turned
    useEffect(() => {
        if (!gameData) {
            return;
        }
        // if (evaluateBeingOpponent({
        //     creatorId: gameData!.creatorId,
        //     loggedInUserUserId
        // })) {
        //     setAmIOpponent(true);
        // }
    }, [loggedInUserUserId, gameData]);


    return (
        <Container className="d-flex justify-content-start align-items-center flex-column pb-5">
            <Container fluid
                       className={`d-flex justify-content-between flex-row mb-3 ${styles.GameHeaderInfo}`}>
                <h6 className="mt-1 me-2"><strong>Game:</strong> {gameData?.name}</h6>
                <RecentMoves moves={gameData?.moves} creatorId={gameData?.creatorId}/>
            </Container>

            <Container fluid
                       className={`d-flex flex-column justify-content-start align-items-center ${styles.Session}`}>
                {
                    <Board amIOpponent={amIOpponent} gameData={gameData}
                    />
                }
            </Container>

            <Container fluid
                       className={`d-flex flex-column justify-content-start align-items-center ${styles.EndMessage}`}>
                {
                    gameData?.winner && evaluateBeingWinner({
                        winnerId: gameData.winner,
                        victoryType: gameData.victoryType,
                        loggedInUserUserId
                    }) && <GameFinishedMessage messageType={evaluateBeingWinner({
                        winnerId: gameData.winner,
                        victoryType: gameData.victoryType,
                        loggedInUserUserId
                    })}/>
                }
                {
                    gameData?.status === "TIE" && <GameFinishedMessage messageType={"TIE"}/>
                }
            </Container>

        </Container>
    );
};
