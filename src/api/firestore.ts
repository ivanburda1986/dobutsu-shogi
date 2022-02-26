import { UserDataInterface } from "../App";
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    Timestamp,
    getDocs,
    addDoc,
    getDoc,
    setDoc,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    serverTimestamp,
    query,
    updateDoc,
    where,
    documentId,
    DocumentData
} from "firebase/firestore";
import {
    createUserWithEmailAndPassword,
    getAuth,
    signOut,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile,
    onAuthStateChanged
} from "firebase/auth";
import { getCreatorStones, getOpponentStones } from "./firestoreService";

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
export type statusType = "WAITING" | "INPROGRESS" | "VICTORY" | "CANCELLED" | "RESIGNED";
export type stoneType = "CHICKEN" | "ELEPHANT" | "GIRAFFE" | "LION";
export type playerType = "CREATOR" | "OPPONENT";

//STONES
export interface StoneInterface {
    id: string;
    type: stoneType;
    empowered: boolean;
    originalOwner: string;
    currentOwner: string;
    stashed: boolean;
    positionLetter: string;
    positionNumber: number;
    amIOpponent?: boolean;
    rowNumbers?: number[];
    columnLetters?: string[];
}

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
                                           positionNumber
                                       }: useUpdateStonePositionInterface) => {
    updateDoc(doc(db, `games/${gameId}/stones`, stoneId), {
        positionLetter: positionLetter,
        positionNumber: positionNumber
    })
        .then(() => console.log("Stone position updated"))
        .catch((err) => {
            console.log(err.message);
        });
};

interface useUpdateStoneTypeInterface {
    gameId: string;
    stoneId: string;
    type: stoneType;
}

export const useUpdateStoneType = ({gameId, stoneId, type}: useUpdateStoneTypeInterface) => {
    updateDoc(doc(db, `games/${gameId}/stones`, stoneId), {type: type})
        .then(() => console.log("Stone position updated"))
        .catch((err) => {
            console.log(err.message);
        });
};

//Get one game details
interface useGetSingleStoneDetailsInterface {
    gameId: string;
    stoneId: string;
}

export const useGetSingleStoneDetails = ({gameId, stoneId}: useGetSingleStoneDetailsInterface) => {
    return getDoc(doc(db, `games/${gameId}/stones/${stoneId}`));
};

// GAME CREATION AND MANAGEMENT
// ======================================================
export interface CreateGameInputInterface {
    creatorId: string;
    creatorName: string;
    name: string;
    type: gameType;
    createGameCb: {
        redirect: () => void;
    };
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
        winner: null,
        finishedTimeStamp: null,
    }).then((docRef) => {
        createGameCb.redirect();
    });
};

interface createJoiningPlayerStones {
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
                            }: createJoiningPlayerStones) => {
    if (joiningPlayerType === "CREATOR") {
        //Update game details
        updateDoc(doc(db, "games", gameId), {creatorJoined: true, creatorPhotoURL: joiningPlayerPhotoURL})
            .then(() => console.log("Game updated"))
            .catch((err) => {
                console.log(err.message);
            });
        //Create creator stones
        let gameStones: StoneInterface[] = getCreatorStones({creatorId: joiningPlayerId, type: type});
        gameStones.forEach((stone) => {
            setDoc(doc(db, `games/${gameId}/stones`, stone.id), {
                ...stone,
            }).then(() => console.log("Stone added"));
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
            .then(() => console.log("Game updated"))
            .catch((err) => {
                console.log(err.message);
            });
        //Create opponent stones
        let gameStones: StoneInterface[] = getOpponentStones({opponentId: joiningPlayerId, type: type});
        gameStones.forEach((stone) => {
            setDoc(doc(db, `games/${gameId}/stones`, stone.id), {
                ...stone,
            }).then(() => console.log("Stone added"));
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
    updatedDetails: any;
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
    createUserWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            updateUserProfile({displayName: username, photoURL: "placeholder", cb: registerUserCb.updateUserData});
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
            console.log(cred);
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
