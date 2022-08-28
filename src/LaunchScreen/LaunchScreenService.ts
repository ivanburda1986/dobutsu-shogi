import {Dispatch, SetStateAction} from "react";
import {collection, onSnapshot, query, where} from "firebase/firestore";
import {db} from "../api/firestore";
import {ReturnedGameInterface} from "./Game/Game";

interface GameListenerInterface {
    updateState: Dispatch<SetStateAction<ReturnedGameInterface[]>>;
    setGamesLoaded?: Dispatch<SetStateAction<boolean>>;
    loggedInUserUserId?: string;
}

export const listenToWaitingGames = ({updateState}: GameListenerInterface) => {
    const QUERY_WAITING = query(collection(db, "games"), where('status', '==', 'WAITING'));
    onSnapshot(QUERY_WAITING, (querySnapshot) => {
        const returnedGames = querySnapshot.docs.map((game) => {
            return {...game.data() as unknown as ReturnedGameInterface};
        });
        updateState(returnedGames);
    });
};

export const listenToInProgressGamesWhereLoggedInPlayerIsCreator = ({
                                                                        updateState,
                                                                        loggedInUserUserId
                                                                    }: GameListenerInterface) => {
    const QUERY_INPROGRESS_LOGGED_IN_IS_CREATOR = query(collection(db, "games"), where('status', '==', 'INPROGRESS'), where('creatorId', '==', `${loggedInUserUserId}`));
    onSnapshot(QUERY_INPROGRESS_LOGGED_IN_IS_CREATOR, (querySnapshot) => {
        const returnedGames = querySnapshot.docs.map((game) => {
            return {...game.data() as unknown as ReturnedGameInterface};
        });
        updateState(returnedGames);
    });
};

export const listenToInProgressGamesWhereLoggedInPlayerIsOpponent = ({
                                                                         updateState,
                                                                         loggedInUserUserId
                                                                     }: GameListenerInterface) => {
    const QUERY_INPROGRESS_LOGGED_IN_IS_OPPONENT = query(collection(db, "games"), where('status', '==', 'INPROGRESS'), where('opponentId', '==', `${loggedInUserUserId}`));
    onSnapshot(QUERY_INPROGRESS_LOGGED_IN_IS_OPPONENT, (querySnapshot) => {
        const returnedGames = querySnapshot.docs.map((game) => {
            return {...game.data() as unknown as ReturnedGameInterface};
        });
        updateState(returnedGames);
    });
};

export const listenToCompletedGamesWhereLoggedInPlayerIsCreator = ({
                                                                       updateState,
                                                                       loggedInUserUserId
                                                                   }: GameListenerInterface) => {
    const QUERY_COMPLETED_LOGGED_IN_IS_CREATOR = query(collection(db, "games"), where('status', '==', 'COMPLETED'), where('creatorId', '==', `${loggedInUserUserId}`));
    onSnapshot(QUERY_COMPLETED_LOGGED_IN_IS_CREATOR, (querySnapshot) => {
        const returnedGames = querySnapshot.docs.map((game) => {
            return {...game.data() as unknown as ReturnedGameInterface};
        });
        updateState(returnedGames);
    });
};

export const listenToCompletedGamesWhereLoggedInPlayerIsOpponent = ({
                                                                        updateState,
                                                                        loggedInUserUserId
                                                                    }: GameListenerInterface) => {
    const QUERY_COMPLETED_LOGGED_IN_IS_OPPONENT = query(collection(db, "games"), where('status', '==', 'COMPLETED'), where('opponentId', '==', `${loggedInUserUserId}`));
    onSnapshot(QUERY_COMPLETED_LOGGED_IN_IS_OPPONENT, (querySnapshot) => {
        const returnedGames = querySnapshot.docs.map((game) => {
            return {...game.data() as unknown as ReturnedGameInterface};
        });
        updateState(returnedGames);
    });
};

export const listenToTieGamesWhereLoggedInPlayerIsCreator = ({
                                                                 updateState,
                                                                 loggedInUserUserId
                                                             }: GameListenerInterface) => {
    const QUERY_TIE_LOGGED_IN_IS_CREATOR = query(collection(db, "games"), where('status', '==', 'TIE'), where('creatorId', '==', `${loggedInUserUserId}`));

    onSnapshot(QUERY_TIE_LOGGED_IN_IS_CREATOR, (querySnapshot) => {
        const returnedGames = querySnapshot.docs.map((game) => {
            return {...game.data() as unknown as ReturnedGameInterface};
        });
        updateState(returnedGames);
    });
};

export const listenToTieGamesWhereLoggedInPlayerIsOpponent = ({
                                                                  updateState,
                                                                  setGamesLoaded,
                                                                  loggedInUserUserId
                                                              }: GameListenerInterface) => {
    const QUERY_TIE_LOGGED_IN_IS_OPPONENT = query(collection(db, "games"), where('status', '==', 'TIE'), where('opponentId', '==', `${loggedInUserUserId}`));

    onSnapshot(QUERY_TIE_LOGGED_IN_IS_OPPONENT, (querySnapshot) => {
        const returnedGames = querySnapshot.docs.map((game) => {
            return {...game.data() as unknown as ReturnedGameInterface};
        });
        updateState(returnedGames);
        setGamesLoaded && setGamesLoaded(true);
    });
};

