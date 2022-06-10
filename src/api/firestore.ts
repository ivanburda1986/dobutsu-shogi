import {UserDataInterface} from "../App";
import {initializeApp} from "firebase/app";
import {addDoc, collection, deleteDoc, doc, getDoc, getFirestore, setDoc, updateDoc} from "firebase/firestore";

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

//TYPES
export type gameType = "DOBUTSU" | "GOROGORO" | "GREENWOOD";
export type statusType = "WAITING" | "INPROGRESS" | "COMPLETED" | "CANCELLED" | "RESIGNED";
export type playerType = "CREATOR" | "OPPONENT";


// Update stone position
interface useUpdateStonePositionInterface {
    gameId: string;
    stoneId: string;
    positionLetter: string;
    positionNumber: number;
}

export const useUpdateStonePosition = ({
                                           gameId,
                                           stoneId,
                                           positionLetter,
                                           positionNumber,
                                       }: useUpdateStonePositionInterface) => {
    updateDoc(doc(db, `games/${gameId}/stones`, stoneId), {
        positionLetter: positionLetter,
        positionNumber: positionNumber,
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

export const useEmpowerStone = ({gameId, stoneId, type}: useUpdateStoneTypeInterface) => {
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


export const useUpdateStoneOnTakeOver = ({
                                             gameId,
                                             stone
                                         }: { gameId: string, stone: Pick<StoneInterface, 'id' | 'currentOwner' | 'stashed' | 'positionLetter' | 'positionNumber'> }) => {
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
    } else {
        console.log('The stone does not exist');
    }
};


// GAME CREATION AND MANAGEMENT
// ======================================================
export interface CreateGameInputInterface {
    creatorId: string;
    creatorName: string;
    name: string;
    type: gameType;
    createGameCb: {
        join: ({createdGameId, type}: { createdGameId: string, type: gameType }) => void;
        redirect: (createdGameId: string) => void;
    };
}

export interface Game {
    createdOn: number;
    creatorId: string;
    creatorName: string;
    creatorJoined: boolean;
    name: string;
    type: gameType;
    status: statusType;
    opponentId: string;
    opponentName: string;
    opponentJoined: boolean;
    startingPlayer: string;
    currentPlayerTurn: string;
    winner: string;
    victoryType: VictoryType;
    finishedTimeStamp: number;
}

export const gamesCollectionRef = collection(db, "games");
export const useCreateGame = ({creatorId, creatorName, name, type, createGameCb}: CreateGameInputInterface) => {
    addDoc(gamesCollectionRef, {
        createdOn: Date.now(),
        creatorId: creatorId,
        creatorName: creatorName,
        creatorJoined: false,
        name: name,
        type: type,
        status: "WAITING",
        opponentId: null,
        opponentName: null,
        opponentJoined: false,
        startingPlayer: null,
        currentPlayerTurn: null,
        winner: null,
        victoryType: null,
        finishedTimeStamp: null,
    }).then((docRef) => {
        createGameCb.join({createdGameId: docRef.id, type: type});
        createGameCb.redirect(docRef.id);
    });
};

interface JoinGame {
    gameId: string;
    joiningPlayerType: playerType;
    joiningPlayerId: string;
    joiningPlayerName: string | null;
    joiningPlayerPhotoURL: string | null;
    type: gameType;
}

export const useJoinGame = ({
                                gameId,
                                joiningPlayerType,
                                joiningPlayerId,
                                joiningPlayerName,
                                joiningPlayerPhotoURL,
                                type
                            }: JoinGame) => {
    if (joiningPlayerType === "CREATOR") {
        //Update game details
        updateDoc(doc(db, "games", gameId), {creatorJoined: true, creatorPhotoURL: joiningPlayerPhotoURL})
            .then(() => console.log("The creator has joined the game."))
            .catch((err) => {
                console.log(err.message);
            });
        //Create creator stones
        let gameStones: StoneInterface[] = getCreatorStones({creatorId: joiningPlayerId, type: type});
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
        let gameStones: StoneInterface[] = getOpponentStones({opponentId: joiningPlayerId, type: type});
        gameStones.forEach((stone) => {
            setDoc(doc(db, `games/${gameId}/stones`, stone.id), {
                ...stone,
            }).then(() => console.log("Opponents stone got created."));
        });
    }
};

export const useDeleteGame = (id: string) => {
    const deleteGameRef = doc(db, "games", id);
    deleteDoc(deleteGameRef).then(() => {
        console.log("Game deleted");
    });
};

interface useUpdateGameInterface {
    id: string;
    updatedDetails: Partial<Game>;
}

export const useUpdateGame = ({id, updatedDetails}: useUpdateGameInterface) => {
    const updateGameRef = doc(db, "games", id);
    updateDoc(updateGameRef, {...updatedDetails})
        .then(() => console.log("Game updated"))
        .catch((err) => {
            console.log(err.message);
        });
};

//Get one game details
interface getSingleGameDetailsInterface {
    gameId: string;
}

export const getSingleGameDetails = ({gameId}: getSingleGameDetailsInterface) => {
    return getDoc(doc(db, "games", gameId));
};

// USER REGISTRATION
// ======================================================
interface RegisterUserInterface {
    email: string;
    username: string;
    password: string;
    registerUserCb: {
        forwardError: (error: string) => void;
        updateUserData: ({email, displayName, photoURL}: UserDataInterface) => void;
    };
}

export const useRegisterUser = ({email, username, password, registerUserCb}: RegisterUserInterface) => {
    const updateUserProfile = useUpdateUserProfile;
    const createUserStats = useCreateUserStats;
    createUserWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            updateUserProfile({displayName: username, photoURL: "placeholder", cb: registerUserCb.updateUserData});
            createUserStats({userId: cred.user.uid});
            console.log("user created:", cred.user);
        })
        .catch((err) => {
            registerUserCb.forwardError(err.message);
            console.log(err.message);
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
            console.log(err.message);
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
}

export const useCreateUserStats = ({userId}: CreateUserStatsInterface) => {
    setDoc(doc(db, `stats`, userId), {
        userId: userId,
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

interface useUpdateUserStatsInterface {
    userId: string;
    updatedDetails: Partial<UserStats>;
}

export const useUpdateUserStats = ({userId, updatedDetails}: useUpdateUserStatsInterface) => {
    const updateUserStatsRef = doc(db, "stats", userId);
    updateDoc(updateUserStatsRef, {...updatedDetails})
        .then(() => console.log("User stats updated"))
        .catch((err) => {
            console.log(err.message);
        });
};

// Get user stats
interface getSingleUserStatsInterface {
    userId: string;
}

export const getSingleUserStats = ({userId}: getSingleUserStatsInterface) => {
    return getDoc(doc(db, "stats", userId));
};

