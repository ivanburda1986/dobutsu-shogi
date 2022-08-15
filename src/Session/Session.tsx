import React, {useContext, useEffect, useRef, useState} from "react";
import {Container} from "react-bootstrap";
import {useParams} from "react-router";
import {
    gamesCollectionRef,
    getSingleGameDetails,
    getSingleUserStats,
    useUpdateGame,
    useUpdateUserStats
} from "../api/firestore";
import {AppContext} from "../context/AppContext";

import {AppContextInterface} from "../App";
import {Board} from "./Board/Board";

import {evaluateBeingOpponent, evaluateBeingWinner} from "./SessionService";

import styles from "./Session.module.css";
import {DocumentData, onSnapshot} from "firebase/firestore";
import {GameFinishedMessage} from "./GameFinishedMessage/GameFinishedMessage";
import {RecentMoves} from "./RecentMoves/RecentMoves";

export const Session = () => {
    const [amIOpponent, setAmIOpponent] = useState(false);
    const {gameId} = useParams();
    const appContext: AppContextInterface = useContext(AppContext);
    const [gameData, setGameData] = useState<DocumentData | undefined>();
    const [isTie, setIsTie] = useState(false);
    const updateGame = useUpdateGame;
    const updateStats = useUpdateUserStats;
    const isComponentMountedRef = useRef(true);

    //Make sure move representations for the whole game are available even after reload/return
    useEffect(() => {
        if (gameData && gameData.moves.length >= 2 && gameData.moves.length % 2 === 0) {
            const player1 = gameData.moves[gameData.moves.length - 1];
            const player2 = gameData.moves[gameData.moves.length - 2];


            const moveRepresentations = gameData.moveRepresentations;
            // console.log('moveRepresentations', moveRepresentations);
            let latestMovePairRepresentation: string = (player1.movingPlayerId.charAt(0) + player1.type.charAt(0) + player1.fromCoordinates + player1.targetCoordinates + player2.movingPlayerId.charAt(0) + player2.type.charAt(0) + player2.fromCoordinates + player2.targetCoordinates).toLowerCase();

            if (latestMovePairRepresentation.length > 12) {
                return;
            }

            if (moveRepresentations[moveRepresentations.length - 1] !== latestMovePairRepresentation) {
                // console.log('latestMovePairRepresentation', latestMovePairRepresentation);
                let updatedMoveRepresentations = [...moveRepresentations, latestMovePairRepresentation];
                updateGame({
                    id: gameId!,
                    updatedDetails: {moveRepresentations: updatedMoveRepresentations}
                });
            }
        }
    }, [gameData, gameData?.moves, gameId, updateGame]);

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
            getSingleUserStats({userId: gameData?.creatorId}).then((serverStats) => updateStats({
                userId: gameData?.creatorId,
                updatedDetails: {tie: serverStats.data()?.tie + 1}
            }));
            getSingleUserStats({userId: gameData?.opponentId}).then((serverStats) => updateStats({
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
        if (gameId && gameData?.creatorJoined && gameData?.opponentJoined && !gameData?.currentPlayerTurn) {
            const randomNumber = Math.random();
            const whoShouldStart = randomNumber < 0.5 ? gameData?.creatorId : gameData?.opponentId;
            updateGame({id: gameId!, updatedDetails: {currentPlayerTurn: whoShouldStart}});
        }
    }, [gameId, gameData, updateGame]);

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
