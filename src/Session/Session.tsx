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
    isGameDataAvailable
} from "./SessionService";

import {DocumentData, onSnapshot} from "firebase/firestore";
import {GameFinishedMessage} from "./GameFinishedMessage/GameFinishedMessage";
import {RecentMoves} from "./RecentMoves/RecentMoves";
import styles from "./Session.module.css";


export const Session = () => {
    const {gameId} = useParams();
    const [gameData, setGameData] = useState<DocumentData | undefined>();
    const [amIOpponent, setAmIOpponent] = useState(false);
    const appContext: AppContextInterface = useContext(AppContext);
    const [isTie, setIsTie] = useState(false);
    const isComponentMountedRef = useRef(true);

    useEffect(() => {
        createAndStoreLastRoundMoveHash(gameId, gameData, updateGame);

    }, [gameData, gameId]);

    // Evalute the movement repetition that might lead to a tie
    useEffect(() => {
        if (gameData && gameData.moveRepresentations.length >= 6) {
            const moveRepresentations = gameData.moveRepresentations;
            console.log(moveRepresentations[moveRepresentations.length - 1]);
            console.log(moveRepresentations[moveRepresentations.length - 3]);
            console.log(moveRepresentations[moveRepresentations.length - 5]);
            if (moveRepresentations[moveRepresentations.length - 1] === moveRepresentations[moveRepresentations.length - 3] && moveRepresentations[moveRepresentations.length - 3] === moveRepresentations[moveRepresentations.length - 5]) {
                // console.log('TIE');
                setIsTie(true);
                return;
            }
            // console.log('not tie');
            return;
        }
    }, [gameData, gameData?.moveRepresentations, gameId, updateGame]);

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
