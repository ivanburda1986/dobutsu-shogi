import React, {useEffect, useState} from "react";
import {Container} from "react-bootstrap";
import {ReturnedGameInterface, WaitingGamesList} from "./WaitingGamesList/WaitingGamesList";
import {YourGamesInProgressList} from "./YourGamesInProgressList/YourGamesInProgress";
import {collection, onSnapshot} from "firebase/firestore";
import {db} from "../api/firestore";

export const LaunchScreen: React.FC = () => {
    const [games, setGames] = useState<ReturnedGameInterface[]>([]);

    useEffect(() => {
        const colRef = collection(db, "games");
        onSnapshot(colRef, (snapshot) => {

            const returnedGames = snapshot.docs.map((game) => {
                return {...game.data()};
            });
            setGames(returnedGames as ReturnedGameInterface[]);
        });
    }, []);

    return (
        <Container>
            <WaitingGamesList games={games.filter((game) => game.status === "WAITING")}/>
            <YourGamesInProgressList games={games.filter((game) => game.status === "WAITING")}/>
        </Container>
    );
};
