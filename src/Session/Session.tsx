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
    evaluateBeingWinner,
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

const updateGameToBeTie = (gameId: string | undefined): void => {
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
};

export const Session = () => {
    const {gameId} = useParams();
    const [gameData, setGameData] = useState<DocumentData | undefined>();
    const [amIOpponent, setAmIOpponent] = useState(false);
    const [isTie, setIsTie] = useState(false);
    const appContext: AppContextInterface = useContext(AppContext);
    const isComponentMountedRef = useRef(true);

    useEffect(() => {
        if (!isGameDataAvailable(gameData, gameId)) {
            return;
        }
        determineStartingPlayer(gameData, gameId, updateGame);
        createAndStoreLastRoundMoveHash(gameId, gameData, updateGame);
        setIsTie(isTieEvaluation(gameData));
    }, [gameData, gameId]);

    useEffect(() => {
        if (!isGameDataAvailable(gameData, gameId)) {
            return;
        }
        if (isTie) {
            updateGameToBeTie(gameId);
            increaseTieStatsCountForBothPlayers(gameData?.creatorId, gameData?.opponentId);
        }
    }, [isTie]);


    useEffect(() => {
        return () => {
            isComponentMountedRef.current = false;
        };
    }, []);

    // Make sure any game-related updates are reflected immediately
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
        if (evaluateBeingOpponent({
            creatorId: gameData!.creatorId,
            loggedInUserUserId: appContext.loggedInUserUserId
        })) {
            setAmIOpponent(true);
        }
    }, [appContext.loggedInUserUserId, gameData]);


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
                        loggedInUserUserId: appContext.loggedInUserUserId
                    }) && <GameFinishedMessage messageType={evaluateBeingWinner({
                        winnerId: gameData.winner,
                        victoryType: gameData.victoryType,
                        loggedInUserUserId: appContext.loggedInUserUserId
                    })}/>
                }
                {
                    gameData?.status === "TIE" && <GameFinishedMessage messageType={"TIE"}/>
                }
            </Container>

        </Container>
    );
};
