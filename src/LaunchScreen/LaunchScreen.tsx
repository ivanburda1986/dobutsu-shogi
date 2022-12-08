import React, { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { AppContextInterface } from "../App";
import { AppContext } from "../context/AppContext";
import { WaitingGamesList } from "./WaitingGamesList/WaitingGamesList";
import { GamesInProgressList } from "./GamesInProgressList/GamesInProgress";
import { CompletedGamesList } from "./CompletedGamesList/CompletedGamesList";
import {
  hasCompletedGames,
  hasInProgressGames,
  shouldShowPanda,
  hasWaitingGames,
  listenToCompletedGamesWhereLoggedInPlayerIsCreator,
  listenToCompletedGamesWhereLoggedInPlayerIsOpponent,
  listenToInProgressGamesWhereLoggedInPlayerIsCreator,
  listenToInProgressGamesWhereLoggedInPlayerIsOpponent,
  listenToTieGamesWhereLoggedInPlayerIsCreator,
  listenToTieGamesWhereLoggedInPlayerIsOpponent,
  listenToWaitingGames,
} from "./LaunchScreenService";
import { SadPanda } from "./SadPanda/SadPanda";
import { ReturnedGameInterface } from "./Game/Game";

export const LaunchScreen: React.FC = () => {
  const { loggedInUserUserId }: AppContextInterface = useContext(AppContext);

  const [waitingGames, setWaitingGames] = useState<ReturnedGameInterface[]>([]);

  const [inProgressCreatorGames, setInProgressCreatorGames] = useState<
    ReturnedGameInterface[]
  >([]);
  const [inProgressOpponentGames, setInProgressOpponentGames] = useState<
    ReturnedGameInterface[]
  >([]);

  const [completedCreatorGames, setCompletedCreatorGames] = useState<
    ReturnedGameInterface[]
  >([]);
  const [completedOpponentGames, setCompletedOpponentGames] = useState<
    ReturnedGameInterface[]
  >([]);

  const [tieCreatorGames, setTieCreatorGames] = useState<
    ReturnedGameInterface[]
  >([]);
  const [tieOpponentGames, setTieOpponentGames] = useState<
    ReturnedGameInterface[]
  >([]);

  const [gamesLoaded, setGamesLoaded] = useState(false);
  const allGamesCount: number =
    waitingGames.length +
    inProgressCreatorGames.length +
    inProgressOpponentGames.length +
    completedCreatorGames.length +
    completedOpponentGames.length +
    tieCreatorGames.length +
    tieOpponentGames.length;

  useEffect(() => {
    listenToWaitingGames({ updateState: setWaitingGames });

    listenToInProgressGamesWhereLoggedInPlayerIsCreator({
      updateState: setInProgressCreatorGames,
      loggedInUserUserId,
    });
    listenToInProgressGamesWhereLoggedInPlayerIsOpponent({
      updateState: setInProgressOpponentGames,
      loggedInUserUserId,
    });
    listenToCompletedGamesWhereLoggedInPlayerIsCreator({
      updateState: setCompletedCreatorGames,
      loggedInUserUserId,
    });
    listenToCompletedGamesWhereLoggedInPlayerIsOpponent({
      updateState: setCompletedOpponentGames,
      loggedInUserUserId,
    });
    listenToTieGamesWhereLoggedInPlayerIsCreator({
      updateState: setTieCreatorGames,
      loggedInUserUserId,
    });
    listenToTieGamesWhereLoggedInPlayerIsOpponent({
      updateState: setTieOpponentGames,
      setGamesLoaded,
      loggedInUserUserId,
    });

    return () => {};
  }, [loggedInUserUserId]);

  return (
    <Container className="pb-5">
      {shouldShowPanda(gamesLoaded, allGamesCount) && <SadPanda />}
      {hasWaitingGames(waitingGames) && (
        <WaitingGamesList games={waitingGames} />
      )}
      {hasInProgressGames(inProgressCreatorGames, inProgressOpponentGames) && (
        <GamesInProgressList
          games={[...inProgressCreatorGames, ...inProgressOpponentGames]}
        />
      )}
      {hasCompletedGames(
        completedCreatorGames,
        completedOpponentGames,
        tieCreatorGames,
        tieOpponentGames
      ) && (
        <CompletedGamesList
          games={[
            ...completedCreatorGames,
            ...completedOpponentGames,
            ...tieCreatorGames,
            ...tieOpponentGames,
          ]}
        />
      )}
    </Container>
  );
};
