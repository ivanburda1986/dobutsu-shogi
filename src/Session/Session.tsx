import React, {Dispatch, SetStateAction, useContext, useEffect, useRef, useState} from "react";
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
    isGameDataAvailable
} from "./SessionService";

import {DocumentData, onSnapshot} from "firebase/firestore";
import {GameFinishedMessage} from "./GameFinishedMessage/GameFinishedMessage";
import {RecentMoves} from "./RecentMoves/RecentMoves";
import styles from "./Session.module.css";


//A tie occurs if both players repeat the same row of moves 3 times
export const isTieEvaluation = (gameData: DocumentData | undefined, setIsTie: Dispatch<SetStateAction<boolean>>): void => {
    if (!gameData) {
        return;
    }

    const moveRepresentations = gameData.moveRepresentations;
    const isMinimumCountOfMovementsAvailableForTieToOccur = moveRepresentations.length >= 6;
    if (isMinimumCountOfMovementsAvailableForTieToOccur) {
        const lastRound = moveRepresentations[moveRepresentations.length - 1];
        const lastMinusThreeRound = moveRepresentations[moveRepresentations.length - 3];
        const lastMinusFiveRound = moveRepresentations[moveRepresentations.length - 5];
        if (lastRound === lastMinusThreeRound && lastMinusThreeRound === lastMinusFiveRound) {
            setIsTie(true);
            return;
        }

        return;
    }
};

/*  Player's move   Round hash          Position in array
    1)              1-gc4c3--p-ga1a2    - length-6;
    2)              1-gc3c4--p-ga2a1    - length-5;
    3)              1-gc4c3--p-ga1a2    - length-4;
    4)              1-gc3c4--p-ga2a1    - length-3;
    5)              1-gc4c3--p-ga1a2    - length-2;
    6)              1-gc3c4--p-ga2a1    - length-1;

    Identical hashes:
    1, 3, 5 -> both players have repeated 3 movements
    2, 4, 6 -> both players have repeated 3 movements
 */


export const Session = () => {
    const {gameId} = useParams();
    const [gameData, setGameData] = useState<DocumentData | undefined>();
    const [amIOpponent, setAmIOpponent] = useState(false);
    const appContext: AppContextInterface = useContext(AppContext);
    const [isTie, setIsTie] = useState(false);
    const isComponentMountedRef = useRef(true);

    useEffect(() => {
        createAndStoreLastRoundMoveHash(gameId, gameData, updateGame);
        isTieEvaluation(gameData, setIsTie);
    }, [gameData, gameId]);
    
    useEffect(() => {
        if (isTie) {
            updateGame({
                id: gameId!,
                updatedDetails: {
                    status: "TIE",
                    finishedTimeStamp: Date.now(),
                }
            });
            getSingleUserStats({userId: gameData?.creatorId}).then((serverStats) => updateUserStats({
                userId: gameData?.creatorId,
                updatedDetails: {tie: serverStats.data()?.tie + 1}
            }));
            getSingleUserStats({userId: gameData?.opponentId}).then((serverStats) => updateUserStats({
                userId: gameData?.opponentId,
                updatedDetails: {tie: serverStats.data()?.tie + 1}
            }));
        }
    }, [gameId, updateGame, isTie]);


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


    // Randomly decide who should start
    useEffect(() => {
        if (isGameDataAvailable(gameData, gameId)) {
            determineStartingPlayer(gameData!, gameId, updateGame);
        }
    }, [gameId, gameData]);

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
