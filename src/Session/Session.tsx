import React, { useContext, useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router";
import {
  gamesCollectionRef,
  getSingleGameDetails,
  updateGame,
} from "../api/firestore";
import { AppContext } from "../context/AppContext";

import { AppContextInterface } from "../App";
import { Board } from "./Board/Board";

import {
  createAndStoreLastRoundMoveHash,
  determineStartingPlayer,
  isThisPlayerOpponent,
  getPlayerFinishedGameState,
  haveBothPlayersJoined,
  increaseTieStatsCountForBothPlayers,
  isGameDataAvailable,
  isTieEvaluation,
  updateGameToBeTie,
} from "./SessionService";

import { DocumentData, onSnapshot } from "firebase/firestore";
import { GameFinishedMessage } from "./GameFinishedMessage/GameFinishedMessage";
import { RecentMoves } from "./RecentMoves/RecentMoves";
import styles from "./Session.module.css";

export const Session = () => {
  const { gameId } = useParams();
  const [gameData, setGameData] = useState<DocumentData | undefined>();
  const [creatorId, setCreatorId] = useState<string | undefined>();
  const [opponentId, setOpponentId] = useState<string | undefined>();
  const [amIOpponent, setAmIOpponent] = useState(false);
  const [isTie, setIsTie] = useState(false);

  const { loggedInUserUserId }: AppContextInterface = useContext(AppContext);
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

    if (isThisPlayerOpponent(gameData?.creatorId, loggedInUserUserId)) {
      setAmIOpponent(true);
    }

    createAndStoreLastRoundMoveHash(gameData, gameId, updateGame);
    setIsTie(isTieEvaluation(gameData));
    return () => {
      console.log("Session cleanup");
    };
  }, [creatorId, gameData, gameId, loggedInUserUserId, opponentId]);

  useEffect(() => {
    if (isTie) {
      updateGameToBeTie(gameId);
      increaseTieStatsCountForBothPlayers(creatorId!, opponentId!);
    }
    return () => {
      console.log("Session cleanup");
    };
  }, [creatorId, gameId, isTie, opponentId]);

  useEffect(() => {
    onSnapshot(gamesCollectionRef, (snapshot) => {
      if (isComponentMountedRef.current && gameId) {
        getSingleGameDetails({ gameId: gameId }).then((data) =>
          setGameData(data.data())
        );
      }
    });
    return () => {
      console.log("Session cleanup");
    };
  }, [gameId]);

  return (
    <Container className="d-flex justify-content-start align-items-center flex-column pb-5">
      <Container
        fluid
        className={`d-flex justify-content-between flex-row mb-3 ${styles.GameHeaderInfo}`}
      >
        <h6 className="mt-1 me-2">
          <strong>Game:</strong> {gameData?.name}
        </h6>
        <RecentMoves moves={gameData?.moves} creatorId={gameData?.creatorId} />
      </Container>
      <Container
        fluid
        className={`d-flex flex-column justify-content-start align-items-center ${styles.Session}`}
      >
        {<Board gameData={gameData} />}
      </Container>
      <Container
        fluid
        className={`d-flex flex-column justify-content-start align-items-center ${styles.EndMessage}`}
      >
        {gameData?.winner && (
          <GameFinishedMessage
            messageType={getPlayerFinishedGameState(
              gameData.winner,
              gameData.victoryType,
              loggedInUserUserId
            )}
          />
        )}
        {isTie && <GameFinishedMessage messageType={"TIE"} />}
      </Container>
    </Container>
  );
};
