import React, {useContext, useEffect, useRef, useState} from "react";
import {Container} from "react-bootstrap";
import {ReturnedGameInterface, WaitingGamesList} from "./WaitingGamesList/WaitingGamesList";
import {YourGamesInProgressList} from "./YourGamesInProgressList/YourGamesInProgress";
import {collection, onSnapshot} from "firebase/firestore";
import {db, statusType} from "../api/firestore";
import {ProvidedContextInterface} from "../App";
import {AppContext} from "../context/AppContext";
import {SadPanda} from "./SadPanda/SadPanda";


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
    if (status === "INPROGRESS") {
        // console.log("status === INPROGRESS", status === "INPROGRESS");
        // console.log('creatorId', creatorId);
        // console.log('opponentId', opponentId);
        // console.log('loggedInPlayerId', loggedInPlayerId);
        if (creatorId === loggedInPlayerId || opponentId === loggedInPlayerId) {
            // console.log("creatorId === loggedInPlayerId", creatorId === loggedInPlayerId);
            // console.log("opponentId === loggedInPlayerId", opponentId === loggedInPlayerId);
            // console.log("creatorId === loggedInPlayerId || opponentId === loggedInPlayerId", creatorId === loggedInPlayerId || opponentId === loggedInPlayerId);
            return true;
        }
        return false;
    }
    return false;
};

export const LaunchScreen: React.FC = () => {
    const appContext: ProvidedContextInterface = useContext(AppContext);
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
                           }) => status === "WAITING" || status === "INPROGRESS").filter(({
                                                                                              creatorId,
                                                                                              opponentId,
                                                                                              status
                                                                                          }) => shouldGameBeExcluded({
                    creatorId,
                    opponentId,
                    status,
                    loggedInPlayerId: appContext.loggedInUserUserId
                }));
                setGames(returnedGames as ReturnedGameInterface[]);
                setGamesLoaded(true);
            });

        }

    }, [appContext.loggedInUserUserId]);

    return (
        <Container>
            {gamesLoaded && games.length < 1 && <SadPanda/>}
            <WaitingGamesList games={games.filter((game) => game.status === "WAITING")}/>
            <YourGamesInProgressList
                games={games.filter((game) => game.status === "INPROGRESS" && (game.creatorId === appContext.loggedInUserUserId || game.opponentId === appContext.loggedInUserUserId))}/>
        </Container>
    );
};
