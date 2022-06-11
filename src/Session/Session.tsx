import React, {useEffect, useState, useContext, useRef} from "react";
import {Container} from "react-bootstrap";
import {useParams} from "react-router";
import {gamesCollectionRef, getSingleGameDetails, useUpdateGame} from "../api/firestore";
import {AppContext} from "../context/AppContext";

import {ProvidedContextInterface} from "../App";
import {Board} from "./Board/Board";

import {evaluateBeingOpponent, evaluateBeingWinner} from "./SessionService";

import styles from "./Session.module.css";
import {DocumentData, onSnapshot} from "firebase/firestore";
import {ReturnedGameInterface} from "../LaunchScreen/WaitingGamesList/WaitingGamesList";
import {GameFinishedMessage, GameFinishedMessageInterface} from "./GameFinishedMessage/GameFinishedMessage";

export const Session = () => {
    const [amIOpponent, setAmIOpponent] = useState(false);
    const {gameId} = useParams();
    const appContext: ProvidedContextInterface = useContext(AppContext);
    const [gameData, setGameData] = useState<DocumentData | undefined>();
    const isComponentMountedRef = useRef(true);
    const updateGame = useUpdateGame;


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
        <Container fluid
                   className={`d-flex flex-column justify-content-start align-items-center ${styles.Session}`}>
            <h3 className="mb-3">Game name: {gameData?.name}</h3>

            {
                <Board type="DOBUTSU" amIOpponent={amIOpponent} gameData={gameData}
                />
            }
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
        </Container>
    );
};
