import React, {useContext, useEffect, useState} from "react";
import {Container} from "react-bootstrap";
import {collection, onSnapshot} from "firebase/firestore";
import {db} from "../api/firestore";
import {AppContextInterface} from "../App";
import {AppContext} from "../context/AppContext";
import {filterPlayerRelevantGames, shouldShowPanda} from "./LaunchScreenService";
import {ReturnedGameInterface, WaitingGamesList} from "./WaitingGamesList/WaitingGamesList";
import {YourGamesInProgressList} from "./YourGamesInProgressList/YourGamesInProgress";
import {CompletedGamesList} from "./CompletedGamesList/CompletedGamesList";
import {SadPanda} from "./SadPanda/SadPanda";

export const LaunchScreen: React.FC = () => {
    const {loggedInUserUserId}: AppContextInterface = useContext(AppContext);
    const [games, setGames] = useState<ReturnedGameInterface[]>([]);
    const [gamesLoaded, setGamesLoaded] = useState(false);

    useEffect(() => {
        onSnapshot(collection(db, "games"), (snapshot) => {
            const allGames = snapshot.docs.map((game) => {
                return {...game.data()};
            }) as unknown as ReturnedGameInterface[];
            setGames(filterPlayerRelevantGames(allGames, loggedInUserUserId) as ReturnedGameInterface[]);
            setGamesLoaded(true);
        });
    }, [loggedInUserUserId]);

    return (
        <Container className="pb-5">
            {gamesLoaded && shouldShowPanda(games, loggedInUserUserId) && <SadPanda/>}
            <WaitingGamesList games={games.filter((game) => game.status === "WAITING")}/>
            <YourGamesInProgressList
                games={games.filter((game) => game.status === "INPROGRESS" && (game.creatorId === loggedInUserUserId || game.opponentId === loggedInUserUserId))}/>
            <CompletedGamesList
                games={games.filter((game) => (game.status === "COMPLETED" || game.status === "TIE") && (game.creatorId === loggedInUserUserId || game.opponentId === loggedInUserUserId))}/>
        </Container>
    );
};
