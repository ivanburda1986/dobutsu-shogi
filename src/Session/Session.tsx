import React, {Dispatch, useCallback, useContext, useEffect, useRef, useState} from "react";
import {Container} from "react-bootstrap";
import {useParams} from "react-router";
import {
    gamesCollectionRef,
    getSingleGameDetails,
    getSingleUserStats,
    updateGame,
    updateUserStats, useUpdateGameInterface
} from "../api/firestore";
import {AppContext} from "../context/AppContext";

import {AppContextInterface} from "../App";
import {Board} from "./Board/Board";

import {
    determineStartingPlayer,
    evaluateBeingOpponent,
    evaluateBeingWinner,
    isGameDataAvailable
} from "./SessionService";

import {DocumentData, onSnapshot} from "firebase/firestore";
import {GameFinishedMessage} from "./GameFinishedMessage/GameFinishedMessage";
import {RecentMoves} from "./RecentMoves/RecentMoves";
import styles from "./Session.module.css";


interface PlayerMoveHashInput {
    playerId: string;
    playerType: string;
    fromCoordinates: string;
    targetCoordinates: string;
}

interface BothPlayerHashInput {
    player1: PlayerMoveHashInput;
    player2: PlayerMoveHashInput;
}

const isLatestRoundMovementHashAlreadySaved = (moveRepresentations: string[], latestRoundMoveHash: string | undefined): boolean => {
    return moveRepresentations[moveRepresentations.length - 1] !== latestRoundMoveHash
}
const isMoveHashRelatedToStash = (moveHash: string): boolean => {
    return moveHash.length > 12;
};

const createLatestRoundMoveHash = (hashInput: BothPlayerHashInput): string | undefined => {
    const {player1, player2} = hashInput;
    const latestMovePairRepresentation = (player1.playerId.charAt(0) + player1.playerType.charAt(0) + player1.fromCoordinates + player1.targetCoordinates + player2.playerId.charAt(0) + player2.playerType.charAt(0) + player2.fromCoordinates + player2.targetCoordinates).toLowerCase();

    if (isMoveHashRelatedToStash(latestMovePairRepresentation)) {
        return;
    } else return latestMovePairRepresentation;
};

const areLastRoundMoveRecordsAvailable = (gameData: DocumentData | undefined): boolean => {
    return !!(gameData && gameData.moves.length >= 2 && gameData.moves.length % 2 === 0);
};

const lastRoundMovementHash = (gameId: string, gameData: DocumentData | undefined) => {
    if (areLastRoundMoveRecordsAvailable(gameData)) {
        const recordedMoves = gameData!.moves;
        const numberOfRecordedMoves = gameData!.moves.length;
        const moveRepresentations = gameData?.moveRepresentations
        const player1LatestMove = recordedMoves[numberOfRecordedMoves - 1];
        const player2LatestMove = recordedMoves[numberOfRecordedMoves - 2];

        const latestRoundMoveHash = createLatestRoundMoveHash({player1: player1LatestMove, player2: player2LatestMove});

        if (isLatestRoundMovementHashAlreadySaved(moveRepresentations, latestRoundMoveHash)) {
            let updatedMoveRepresentations = [...moveRepresentations, latestRoundMoveHash];
            updateGame({
                id: gameId!,
                updatedDetails: {moveRepresentations: updatedMoveRepresentations}
            });
        }
    }
};

export const Session = () => {
    const {gameId} = useParams();
    const [gameData, setGameData] = useState<DocumentData | undefined>();
    const [amIOpponent, setAmIOpponent] = useState(false);
    const appContext: AppContextInterface = useContext(AppContext);
    const [isTie, setIsTie] = useState(false);
    const isComponentMountedRef = useRef(true);

    //Make sure move representations for the whole game are available even after reload/return
    useEffect(() => {
        // Track move representation

        //If there is an even count of moves
        if (gameData && gameData.moves.length >= 2 && gameData.moves.length % 2 === 0) {

            //Get latest moves for both players
            const player1 = gameData.moves[gameData.moves.length - 1];
            const player2 = gameData.moves[gameData.moves.length - 2];


            const moveRepresentations = gameData.moveRepresentations;
            // console.log('moveRepresentations', moveRepresentations);
            //Create latest move hash
            let latestMovePairRepresentation: string = (player1.movingPlayerId.charAt(0) + player1.type.charAt(0) + player1.fromCoordinates + player1.targetCoordinates + player2.movingPlayerId.charAt(0) + player2.type.charAt(0) + player2.fromCoordinates + player2.targetCoordinates).toLowerCase();

            //If a move representation is related to out-of-field movements, ignore it
            if (latestMovePairRepresentation.length > 12) {
                return;
            }

            //Make sure the latest recorded move hash is different that the next-update attempt (avoiding duplicate updates with the same value)
            if (moveRepresentations[moveRepresentations.length - 1] !== latestMovePairRepresentation) {
                // console.log('latestMovePairRepresentation', latestMovePairRepresentation);
                //Then update the moves
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
