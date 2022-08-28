import React, {useContext, useEffect, useState} from "react";
import {Container} from "react-bootstrap";
import {AppContextInterface} from "../App";
import {AppContext} from "../context/AppContext";
import {ReturnedGameInterface, WaitingGamesList} from "./WaitingGamesList/WaitingGamesList";
import {YourGamesInProgressList} from "./YourGamesInProgressList/YourGamesInProgress";
import {CompletedGamesList} from "./CompletedGamesList/CompletedGamesList";
import {
    listenToCompletedGamesWhereLoggedInPlayerIsCreator,
    listenToCompletedGamesWhereLoggedInPlayerIsOpponent,
    listenToInProgressGamesWhereLoggedInPlayerIsCreator,
    listenToInProgressGamesWhereLoggedInPlayerIsOpponent,
    listenToTieGamesWhereLoggedInPlayerIsCreator,
    listenToTieGamesWhereLoggedInPlayerIsOpponent,
    listenToWaitingGames
} from "./LaunchScreenService";
import {SadPanda} from "./SadPanda/SadPanda";

export const LaunchScreen: React.FC = () => {
    const {loggedInUserUserId}: AppContextInterface = useContext(AppContext);
    const [waitingGames, setWaitingGames] = useState<ReturnedGameInterface[]>([]);
    const [inProgressCreatorGames, setInProgressCreatorGames] = useState<ReturnedGameInterface[]>([]);
    const [inProgressOpponentGames, setInProgressOpponentGames] = useState<ReturnedGameInterface[]>([]);
    const [completedCreatorGames, setCompletedCreatorGames] = useState<ReturnedGameInterface[]>([]);
    const [completedOpponentGames, setCompletedOpponentGames] = useState<ReturnedGameInterface[]>([]);
    const [tieCreatorGames, setTieCreatorGames] = useState<ReturnedGameInterface[]>([]);
    const [tieOpponentGames, setTieOpponentGames] = useState<ReturnedGameInterface[]>([]);
    const [gamesLoaded, setGamesLoaded] = useState(false);
    const allGamesCount = waitingGames.length + inProgressCreatorGames.length + inProgressOpponentGames.length + completedCreatorGames.length + completedOpponentGames.length + tieCreatorGames.length + tieOpponentGames.length;

    useEffect(() => {
        listenToWaitingGames(setWaitingGames, setGamesLoaded);

        listenToInProgressGamesWhereLoggedInPlayerIsCreator({
            updateState: setInProgressCreatorGames,
            setGamesLoaded,
            loggedInUserUserId
        });
        listenToInProgressGamesWhereLoggedInPlayerIsOpponent({
            updateState: setInProgressOpponentGames,
            setGamesLoaded,
            loggedInUserUserId
        });
        listenToCompletedGamesWhereLoggedInPlayerIsCreator({
            updateState: setCompletedCreatorGames,
            setGamesLoaded,
            loggedInUserUserId
        });
        listenToCompletedGamesWhereLoggedInPlayerIsOpponent({
            updateState: setCompletedOpponentGames,
            setGamesLoaded,
            loggedInUserUserId
        });
        listenToTieGamesWhereLoggedInPlayerIsCreator({
            updateState: setTieCreatorGames,
            setGamesLoaded,
            loggedInUserUserId
        });
        listenToTieGamesWhereLoggedInPlayerIsOpponent({
            updateState: setTieOpponentGames,
            setGamesLoaded,
            loggedInUserUserId
        });

    }, [loggedInUserUserId]);

    return (
        <Container className="pb-5">
            {gamesLoaded && allGamesCount === 0 && <SadPanda/>}
            <WaitingGamesList games={waitingGames}/>
            <YourGamesInProgressList
                games={[...inProgressCreatorGames, ...inProgressOpponentGames]}/>
            <CompletedGamesList
                games={[...completedCreatorGames, ...completedOpponentGames, ...tieCreatorGames, ...tieOpponentGames]}/>
        </Container>
    );
};
