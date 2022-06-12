import React, {useContext, useEffect, useState} from "react";
import {Container} from "react-bootstrap";
import {ReturnedGameInterface, WaitingGamesList} from "./WaitingGamesList/WaitingGamesList";
import {YourGamesInProgressList} from "./YourGamesInProgressList/YourGamesInProgress";
import {collection, onSnapshot} from "firebase/firestore";
import {db} from "../api/firestore";
import {ProvidedContextInterface} from "../App";
import {AppContext} from "../context/AppContext";
import {SadPanda} from "./SadPanda/SadPanda";

export const LaunchScreen: React.FC = () => {
    const appContext: ProvidedContextInterface = useContext(AppContext);
    const [games, setGames] = useState<ReturnedGameInterface[]>([]);
    const [gamesLoaded, setGamesLoaded] = useState(false);

    useEffect(() => {
        const colRef = collection(db, "games");
        onSnapshot(colRef, (snapshot) => {

            const returnedGames = snapshot.docs.map((game) => {
                return {...game.data()};
            }).filter((mappedGame) => mappedGame.status !== "COMPLETED");
            setGames(returnedGames as ReturnedGameInterface[]);
            setGamesLoaded(true);
        });
    }, []);

    return (
        <Container>
            {gamesLoaded && games.length < 1 && <SadPanda/>}
            <WaitingGamesList games={games.filter((game) => game.status === "WAITING")}/>
            <YourGamesInProgressList
                games={games.filter((game) => game.status === "INPROGRESS" && (game.creatorId === appContext.loggedInUserUserId || game.opponentId === appContext.loggedInUserUserId))}/>
        </Container>
    );
};
