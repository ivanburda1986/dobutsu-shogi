import React, {useContext, useEffect, useRef, useState} from "react";
import {Container} from "react-bootstrap";
import {collection, onSnapshot} from "firebase/firestore";
import {db, statusType} from "../api/firestore";
import {AppContextInterface} from "../App";
import {AppContext} from "../context/AppContext";
import {ReturnedGameInterface, WaitingGamesList} from "./WaitingGamesList/WaitingGamesList";
import {YourGamesInProgressList} from "./YourGamesInProgressList/YourGamesInProgress";
import {CompletedGamesList} from "./CompletedGamesList/CompletedGamesList";
import {SadPanda} from "./SadPanda/SadPanda";
import {shouldShowPanda} from "./LaunchScreenService";


interface shouldGameBeExcludedInterface {
    creatorId: string;
    opponentId: string;
    status: statusType;
    loggedInPlayerId: string;
}

const shouldGameBeExcluded = ({
                                  creatorId,
                                  opponentId,
                                  status,
                                  loggedInPlayerId
                              }: shouldGameBeExcludedInterface): boolean => {
    if (status === "WAITING") {
        return true;
    }
    if (status === "COMPLETED") {
        return true;
    }
    if (status === "INPROGRESS") {
        if (creatorId === loggedInPlayerId || opponentId === loggedInPlayerId) {
            return true;
        }
        return false;
    }
    return false;
};

export const LaunchScreen: React.FC = () => {
    const {loggedInUserUserId}: AppContextInterface = useContext(AppContext);
    const [games, setGames] = useState<ReturnedGameInterface[]>([]);
    const [gamesLoaded, setGamesLoaded] = useState(false);
    const isComponentMountedRef = useRef(true);

    useEffect(() => {
        return () => {
            isComponentMountedRef.current = false;
        };
    }, []);


    useEffect(() => {
        if (isComponentMountedRef.current) {
            const colRef = collection(db, "games");
            onSnapshot(colRef, (snapshot) => {

                const returnedGames = snapshot.docs.map((game) => {
                    return {...game.data()};
                }).filter(({
                               creatorId,
                               opponentId,
                               status
                           }) => status === "WAITING" || status === "INPROGRESS" || status === "COMPLETED").filter(({
                                                                                                                        creatorId,
                                                                                                                        opponentId,
                                                                                                                        status
                                                                                                                    }) => shouldGameBeExcluded({
                    creatorId,
                    opponentId,
                    status,
                    loggedInPlayerId: loggedInUserUserId
                }));
                setGames(returnedGames as ReturnedGameInterface[]);
                setGamesLoaded(true);
            });

        }

    }, [loggedInUserUserId]);


    return (
        <Container className="pb-5">
            {gamesLoaded && shouldShowPanda(games, loggedInUserUserId) && <SadPanda/>}
            <WaitingGamesList games={games.filter((game) => game.status === "WAITING")}/>
            <YourGamesInProgressList
                games={games.filter((game) => game.status === "INPROGRESS" && (game.creatorId === loggedInUserUserId || game.opponentId === loggedInUserUserId))}/>
            <CompletedGamesList
                games={games.filter((game) => game.status === "COMPLETED" && (game.creatorId === loggedInUserUserId || game.opponentId === loggedInUserUserId))}/>
        </Container>
    );
};
