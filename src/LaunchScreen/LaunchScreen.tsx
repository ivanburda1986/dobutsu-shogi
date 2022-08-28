import React, {useContext, useEffect, useState} from "react";
import {Container} from "react-bootstrap";
import {collection, onSnapshot, query, where} from "firebase/firestore";
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
    const [waitingGames, setWaitingGames] = useState<ReturnedGameInterface[]>([]);
    const [inProgressCreatorGames, setInProgressCreatorGames] = useState<ReturnedGameInterface[]>([]);
    const [inProgressOpponentGames, setInProgressOpponentGames] = useState<ReturnedGameInterface[]>([]);
    const [completedCreatorGames, setCompletedCreatorGames] = useState<ReturnedGameInterface[]>([]);
    const [completedOpponentGames, setCompletedOpponentGames] = useState<ReturnedGameInterface[]>([]);
    const [tieCreatorGames, setTieCreatorGames] = useState<ReturnedGameInterface[]>([]);
    const [tieOpponentGames, setTieOpponentGames] = useState<ReturnedGameInterface[]>([]);
    const [gamesLoaded, setGamesLoaded] = useState(false);

    // useEffect(() => {
    //     onSnapshot(collection(db, "games"), (snapshot) => {
    //         const allGames = snapshot.docs.map((game) => {
    //             return {...game.data()};
    //         }) as unknown as ReturnedGameInterface[];
    //         setGames(filterPlayerRelevantGames(allGames, loggedInUserUserId) as ReturnedGameInterface[]);
    //         setGamesLoaded(true);
    //     });
    // }, [loggedInUserUserId]);

    //testing
    useEffect(() => {
        const QUERY_WAITING = query(collection(db, "games"), where('status', '==', 'WAITING'));
        const QUERY_INPROGRESS_LOGGED_IN_IS_CREATOR = query(collection(db, "games"), where('status', '==', 'INPROGRESS'), where('creatorId', '==', `${loggedInUserUserId}`));
        const QUERY_INPROGRESS_LOGGED_IN_IS_OPPONENT = query(collection(db, "games"), where('status', '==', 'INPROGRESS'), where('opponentId', '==', `${loggedInUserUserId}`));
        const QUERY_COMPLETED_LOGGED_IN_IS_CREATOR = query(collection(db, "games"), where('status', '==', 'COMPLETED'), where('creatorId', '==', `${loggedInUserUserId}`));
        const QUERY_COMPLETED_LOGGED_IN_IS_OPPONENT = query(collection(db, "games"), where('status', '==', 'COMPLETED'), where('opponentId', '==', `${loggedInUserUserId}`));
        const QUERY_TIE_LOGGED_IN_IS_CREATOR = query(collection(db, "games"), where('status', '==', 'TIE'), where('creatorId', '==', `${loggedInUserUserId}`));
        const QUERY_TIE_LOGGED_IN_IS_OPPONENT = query(collection(db, "games"), where('status', '==', 'TIE'), where('opponentId', '==', `${loggedInUserUserId}`));

        onSnapshot(QUERY_WAITING, (querySnapshot) => {
            const returnedGames = querySnapshot.docs.map((game) => {
                return {...game.data() as unknown as ReturnedGameInterface};
            });
            setWaitingGames(returnedGames);
            setGamesLoaded(true);
        });

        onSnapshot(QUERY_INPROGRESS_LOGGED_IN_IS_CREATOR, (querySnapshot) => {
            const returnedGames = querySnapshot.docs.map((game) => {
                return {...game.data() as unknown as ReturnedGameInterface};
            });
            setInProgressCreatorGames(returnedGames);
            setGamesLoaded(true);
        });

        onSnapshot(QUERY_INPROGRESS_LOGGED_IN_IS_OPPONENT, (querySnapshot) => {
            const returnedGames = querySnapshot.docs.map((game) => {
                return {...game.data() as unknown as ReturnedGameInterface};
            });
            setInProgressOpponentGames(returnedGames);
            setGamesLoaded(true);
        });

        onSnapshot(QUERY_COMPLETED_LOGGED_IN_IS_CREATOR, (querySnapshot) => {
            const returnedGames = querySnapshot.docs.map((game) => {
                return {...game.data() as unknown as ReturnedGameInterface};
            });
            setCompletedCreatorGames(returnedGames);
            setGamesLoaded(true);
        });

        onSnapshot(QUERY_COMPLETED_LOGGED_IN_IS_OPPONENT, (querySnapshot) => {
            const returnedGames = querySnapshot.docs.map((game) => {
                return {...game.data() as unknown as ReturnedGameInterface};
            });
            setCompletedOpponentGames(returnedGames);
            setGamesLoaded(true);
        });

        onSnapshot(QUERY_TIE_LOGGED_IN_IS_CREATOR, (querySnapshot) => {
            const returnedGames = querySnapshot.docs.map((game) => {
                return {...game.data() as unknown as ReturnedGameInterface};
            });
            setTieCreatorGames(returnedGames);
            setGamesLoaded(true);
        });

        onSnapshot(QUERY_TIE_LOGGED_IN_IS_OPPONENT, (querySnapshot) => {
            const returnedGames = querySnapshot.docs.map((game) => {
                return {...game.data() as unknown as ReturnedGameInterface};
            });
            setTieOpponentGames(returnedGames);
            setGamesLoaded(true);
        });

    }, [loggedInUserUserId]);

    return (
        <Container className="pb-5">
            {/*{gamesLoaded && shouldShowPanda(games, loggedInUserUserId) && <SadPanda/>}*/}
            <WaitingGamesList games={waitingGames}/>
            <YourGamesInProgressList
                games={[...inProgressCreatorGames, ...inProgressOpponentGames]}/>
            <CompletedGamesList
                games={[...completedCreatorGames, ...completedOpponentGames, ...tieCreatorGames, ...tieOpponentGames]}/>
        </Container>
    );
};
