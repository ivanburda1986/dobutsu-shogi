import React, {useEffect, useState, useContext, useRef} from "react";
import {Container} from "react-bootstrap";
import {useParams} from "react-router";
import {gamesCollectionRef, getSingleGameDetails} from "../api/firestore";
import {AppContext} from "../context/AppContext";

import {ProvidedContextInterface} from "../App";
import {Board} from "./Board/Board";

import {evaluateBeingOpponent} from "./SessionService";

import styles from "./Session.module.css";
import {DocumentData, onSnapshot} from "firebase/firestore";
import {ReturnedGameInterface} from "../LaunchScreen/WaitingGamesList/WaitingGamesList";

export const Session = () => {
    const [amIOpponent, setAmIOpponent] = useState(false);
    const {gameId} = useParams();
    const appContext: ProvidedContextInterface = useContext(AppContext);
    const [gameData, setGameData] = useState<DocumentData | undefined>();
    const isComponentMountedRef = useRef(true);

    useEffect(() => {
        return () => {
            isComponentMountedRef.current = false;
        };
    }, []);

    // Make sure any game-related updates are reflected immediately
    useEffect(() => {
        onSnapshot(gamesCollectionRef, (snapshot) => {
            if (isComponentMountedRef.current) {
                let game: ReturnedGameInterface;
                snapshot.docs.forEach((doc) => {
                    game = doc.data() as ReturnedGameInterface;
                    setGameData(game);
                });
            }
        });
    }, []);

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
        <Container fluid className={styles.Session}>
            <Board type="DOBUTSU" amIOpponent={amIOpponent} gameData={gameData}/>
        </Container>
    );
};
