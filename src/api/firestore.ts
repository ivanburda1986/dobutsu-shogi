import {UserDataInterface} from "../App";
import {initializeApp} from "firebase/app";
import {
    collection,
    deleteDoc,
    doc,
    DocumentData,
    getDoc,
    getDocs,
    getFirestore,
    setDoc,
    updateDoc
} from "firebase/firestore";

import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from "firebase/auth";
import {getCreatorStones, getOpponentStones} from "./firestoreService";
import {StoneInterface, stoneType} from "../Session/Board/Stones/Stone";
import {VictoryType} from "../Session/Board/Board";
import {DocumentSnapshot} from "@firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCBnawTeOf0cVa7m7aKFQoIqrXbJOorW2c",
    authDomain: "dobutsushogi-43c6e.firebaseapp.com",
    databaseURL: "https://dobutsushogi-43c6e-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "dobutsushogi-43c6e",
    storageBucket: "dobutsushogi-43c6e.appspot.com",
    messagingSenderId: "721291009374",
    appId: "1:721291009374:web:16ce8eaf9286ec6a4683cf",
    measurementId: "G-NHVXG2LCZJ",
};

//Init the firebase app
initializeApp(firebaseConfig);

//Init services
export const db = getFirestore();

//Init authentication
export const auth = getAuth();

// USER REGISTRATION
// ======================================================
interface RegisterUserInterface {
    email: string;
    username: string;
    password: string;
    registerUserCb: {
        onError: (error: string) => void;
        onSuccess: ({email, displayName, photoURL}: UserDataInterface) => void;
    };
}

export const useRegisterUser = ({email, username, password, registerUserCb}: RegisterUserInterface) => {
    const updateUserProfile = useUpdateUserProfile;
    const createUserStats = useCreateUserStats;
    createUserWithEmailAndPassword(auth, email, password)
        .then((credentials) => {
            updateUserProfile({displayName: username, photoURL: "placeholder", cb: registerUserCb.onSuccess});
            createUserStats({userId: credentials.user.uid, userName: username});
        })
        .catch((err) => {
            registerUserCb.onError(err.message);
            console.log(err.message);
        });
};

//TYPES
export type statusType = "WAITING" | "INPROGRESS" | "COMPLETED" | "TIE";
export type playerType = "CREATOR" | "OPPONENT";

// Update stone position
interface useUpdateStonePositionInterface {
    gameId: string;
    stoneId: string;
    positionColumnLetter: string;
    positionRowNumber: number;
}

export const updateStonePosition = ({
                                        gameId,
                                        stoneId,
                                        positionColumnLetter,
                                        positionRowNumber,
                                    }: useUpdateStonePositionInterface) => {
    updateDoc(doc(db, `games/${gameId}/stones`, stoneId), {
        positionColumnLetter: positionColumnLetter,
        positionRowNumber: positionRowNumber,
        stashed: false
    })
        .then(() => console.log("Stone position updated on server"))
        .catch((err) => {
            console.log(err.message);
        });
};

interface useUpdateStoneTypeInterface {
    gameId: string;
    stoneId: string;
    type: stoneType;
}

interface useUpdateStoneHighlightedInterface {
    gameId: string;
    stoneId: string;
    highlighted: boolean;
}

interface useUpdateStoneInvisibilityInterface {
    gameId: string;
    stoneId: string;
    invisible: boolean;
}

export const empowerStone = ({gameId, stoneId, type}: useUpdateStoneTypeInterface) => {
    updateDoc(doc(db, `games/${gameId}/stones`, stoneId), {type: type})
        .then(() => console.log("Stone empower has been updated on the server"))
        .catch((err) => {
            console.log(err.message);
        });
};

export const useHandicapStone = ({gameId, stoneId, type}: useUpdateStoneTypeInterface) => {
    updateDoc(doc(db, `games/${gameId}/stones`, stoneId), {type: type})
        .then(() => console.log("Stone handicap has been updated on the server"))
        .catch((err) => {
            console.log(err.message);
        });
};

export const highlightStone = ({gameId, stoneId, highlighted}: useUpdateStoneHighlightedInterface) => {
    updateDoc(doc(db, `games/${gameId}/stones`, stoneId), {highlighted: highlighted})
        .then(() => console.log("Stone highlighting has been updated"))
        .catch((err) => {
            console.log(err.message);
        });
};

export const useInvisibleStone = ({gameId, stoneId, invisible}: useUpdateStoneInvisibilityInterface) => {
    updateDoc(doc(db, `games/${gameId}/stones`, stoneId), {invisible: invisible})
        .then(() => console.log("Stone invisibility has been updated"))
        .catch((err) => {
            console.log(err.message);
        });
};


export const useUpdateStoneOnTakeOver = ({
                                             gameId,
                                             stone
                                         }: { gameId: string, stone: Pick<StoneInterface, 'id' | 'currentOwner' | 'stashed' | 'positionColumnLetter' | 'positionRowNumber'> }) => {
    updateDoc(doc(db, `games/${gameId}/stones`, stone.id), {...stone})
        .then(() => console.log("Taken stone updated on server"))
        .catch((err) => {
            console.log(err.message);
        });
};


//Get stone details
interface useGetSingleStoneDetailsInterface {
    gameId: string;
    stoneId: string;
}

export const getSingleStoneDetails = async ({gameId, stoneId}: useGetSingleStoneDetailsInterface) => {
    const stoneRef = doc(db, `games/${gameId}/stones/${stoneId}`);
    const singleStoneData = await getDoc(stoneRef);
    if (singleStoneData.exists()) {
        return singleStoneData;
    }
};


// GAME CREATION AND MANAGEMENT
// ======================================================
export interface MoveInterface {
    moveNumber: number;
    id: string;
    type: stoneType;
    movingPlayerId: string;
    fromCoordinates: string;
    targetCoordinates: string;
    isTakeOver: boolean;
    isVictory: boolean;
}

export interface CreateGameInputInterface {
    gameId: string;
    creatorId: string;
    creatorName: string;
    name: string;
    createGameCb: {
        join: (createdGameId: string) => void;
        redirect: (createdGameId: string) => void;
    };
}

export interface Game {
    gameId: string;
    createdOn: number;
    creatorId: string;
    creatorName: string;
    creatorPhotoURL: string | null;
    creatorJoined: boolean;
    name: string;
    status: statusType;
    opponentId: string;
    opponentName: string;
    opponentPhotoURL: string | null;
    opponentJoined: boolean;
    startingPlayer: string;
    currentPlayerTurn: string;
    moves: MoveInterface[];
    moveRepresentations: string[];
    winner: string;
    victoryType: VictoryType;
    finishedTimeStamp: number;
}


export const gamesCollectionRef = collection(db, "games");
export const useCreateGame = ({creatorId, creatorName, name, gameId, createGameCb}: CreateGameInputInterface) => {
    setDoc(doc(db, "games", gameId), {
        gameId: gameId,
        createdOn: Date.now(),
        creatorId: creatorId,
        creatorName: creatorName,
        creatorJoined: false,
        name: name,
        status: "WAITING",
        opponentId: null,
        opponentName: null,
        opponentJoined: false,
        startingPlayer: null,
        currentPlayerTurn: null,
        moves: [],
        moveRepresentations: [],
        winner: null,
        victoryType: null,
        finishedTimeStamp: null,
    }).then((docRef) => {
        createGameCb.join(gameId);
        createGameCb.redirect(gameId);
    });
};

//the docRef is returned if the ID of a newly create item gets generated at the server; the docRef contains an id, such as docRef id

interface JoinGame {
    gameId: string;
    joiningPlayerType: playerType;
    joiningPlayerId: string;
    joiningPlayerName: string | null;
    joiningPlayerPhotoURL: string | null;
}

export const joinGame = ({
                             gameId,
                             joiningPlayerType,
                             joiningPlayerId,
                             joiningPlayerName,
                             joiningPlayerPhotoURL,
                         }: JoinGame) => {
    if (joiningPlayerType === "CREATOR") {
        //Update game details
        updateDoc(doc(db, "games", gameId), {creatorJoined: true, creatorPhotoURL: joiningPlayerPhotoURL})
            .then(() => console.log("The creator has joined the game."))
            .catch((err) => {
                console.log(err.message);
            });
        //Create creator stones
        let gameStones: StoneInterface[] = getCreatorStones(joiningPlayerId);
        gameStones.forEach((stone) => {
            setDoc(doc(db, `games/${gameId}/stones`, stone.id), {
                ...stone,
            }).then(() => console.log("Creators stones got created."));
        });
    } else {
        //Update game details
        updateDoc(doc(db, "games", gameId), {
            opponentId: joiningPlayerId,
            opponentName: joiningPlayerName,
            opponentPhotoURL: joiningPlayerPhotoURL,
            opponentJoined: true,
            status: "INPROGRESS"
        })
            .then(() => console.log("The opponent has joined the game."))
            .catch((err) => {
                console.log(err.message);
            });
        //Create opponent stones
        let gameStones: StoneInterface[] = getOpponentStones(joiningPlayerId);
        gameStones.forEach((stone) => {
            setDoc(doc(db, `games/${gameId}/stones`, stone.id), {
                ...stone,
            }).then(() => console.log("Opponents stone got created."));
        });
    }
};

export const deleteGame = (id: string) => {
    const deleteGameRef = doc(db, "games", id);
    deleteDoc(deleteGameRef).then(() => {
        console.log("Game deleted");
    });
};

export interface useUpdateGameInterface {
    id: string;
    updatedDetails: Partial<Game>;
}

export const updateGame = async ({id, updatedDetails}: useUpdateGameInterface) => {
    const updateGameRef = doc(db, "games", id);
    await updateDoc(updateGameRef, {...updatedDetails})
        .then(() => console.log("Game updated"))
        .catch((err) => {
            return (err.message);
        });

};

//Get one game details
interface getSingleGameDetailsInterface {
    gameId: string;
}

export const getSingleGameDetails = ({gameId}: getSingleGameDetailsInterface) => {
    return getDoc(doc(db, "games", gameId));
};

//Update user profile image in all games where the user has participated
export interface UpdatePlayerAvatarInGamesInterface {
    playerId: string;
    updatedAvatar: string | null;
}


export const updatePlayerAvatarInGames = async ({playerId, updatedAvatar}: UpdatePlayerAvatarInGamesInterface) => {
    const queryGamesSnapshot = await getDocs(collection(db, "games"));
    let returnedGames: Game[] = [];
    queryGamesSnapshot.forEach((doc) => {
        returnedGames.push({...doc.data()} as Game);
    });
    let gamesWherePlayerIsOpponent = returnedGames.filter((game: Game) => game.opponentId === playerId).map((gameWithPlayerOpponent: Game) => gameWithPlayerOpponent.gameId);
    let gamesWherePlayerIsCreator = returnedGames.filter((game: Game) => game.creatorId === playerId).map((gameWithPlayerCreator: Game) => gameWithPlayerCreator.gameId);
    gamesWherePlayerIsCreator.forEach((gameId) => {
        updateGame({id: gameId, updatedDetails: {creatorPhotoURL: updatedAvatar}});
    });
    gamesWherePlayerIsOpponent.forEach((gameId) => {
        updateGame({id: gameId, updatedDetails: {opponentPhotoURL: updatedAvatar}});
    });
};


// USER LOGIN
// ======================================================
interface LoginUserInterface {
    email: string;
    password: string;
    loginUserCb: {
        forwardError: (error: string) => void;
    };
}

export const useLoginUser = ({email, password, loginUserCb}: LoginUserInterface) => {
    signInWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            console.log('User logged in:', cred);
        })
        .catch((err) => {
            loginUserCb.forwardError(err.message);
            return (err.message);
        });
};

// USER LOGOUT
// ======================================================
export const useLogoutUser = () => {
    signOut(auth)
        .then(() => {
            console.log("The user has logged out");
        })
        .catch((err) => {
            console.log(err.message);
        });
};

// LOGIN: REQUEST A PASSWORD RESET
// ======================================================
interface RequestPasswordResetInterface {
    email: string;
}

export const useRequestPasswordReset = ({email}: RequestPasswordResetInterface) => {
    sendPasswordResetEmail(auth, email)
        .then(() => {
            console.log("Password reset email sent!");
        })
        .catch((err) => {
            console.log(err.message);
        });
};

// LOGIN: UPDATE USER PROFILE
// ======================================================
interface UpdateUserProfileInterface {
    displayName: string | null;
    photoURL?: string | null;
    cb: ({email, displayName, photoURL}: UserDataInterface) => void;
}

export const useUpdateUserProfile = ({displayName, photoURL, cb}: UpdateUserProfileInterface) => {
    updateProfile(auth.currentUser!, {
        displayName: displayName,
        photoURL: photoURL,
    })
        .then(() => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    cb({email: user.email, displayName: user.displayName, photoURL: user.photoURL});
                }
            });
            console.log("User profile updated");
        })
        .catch((err) => {
            console.log(err.message);
        });
};

// USER GAME STATS
// =======================================================

// Initial creation of stats
export interface CreateUserStatsInterface {
    userId: string;
    userName: string;
}

export const useCreateUserStats = ({userId, userName}: CreateUserStatsInterface) => {
    setDoc(doc(db, `stats`, userId), {
        userId: userId,
        userName: userName,
        win: 0,
        loss: 0,
        tie: 0,
    }).then(() => console.log("The user stats have been created"))
        .catch((err) => {
            console.log(err.message);
        });
};

// Update user stats
interface UserStats {
    win: number,
    loss: number,
    tie: number,
}

export interface useUpdateUserStatsInterface {
    userId: string;
    updatedDetails: Partial<UserStats>;
}

export const updateUserStats = ({userId, updatedDetails}: useUpdateUserStatsInterface) => {
    const updateUserStatsRef = doc(db, "stats", userId);
    updateDoc(updateUserStatsRef, {...updatedDetails})
        .then(() => console.log("User stats updated"))
        .catch((err) => {
            console.log(err.message);
        });
};

// Get user stats
export interface getSingleUserStatsInterface {
    userId: string;
}

export const getSingleUserStats = ({userId}: getSingleUserStatsInterface): Promise<DocumentSnapshot> => {
    return getDoc(doc(db, "stats", userId));
};

