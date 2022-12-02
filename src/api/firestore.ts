import { UserDataInterface } from "../App";
import { initializeApp } from "firebase/app";
import { DocumentSnapshot } from "@firebase/firestore";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import {
  generateCreatorStones,
  generateOpponentStones,
} from "./firestoreService";
import { StoneInterface, stoneType } from "../Session/Board/Stones/Stone";

const firebaseConfig = {
  apiKey: "AIzaSyCBnawTeOf0cVa7m7aKFQoIqrXbJOorW2c",
  authDomain: "dobutsushogi-43c6e.firebaseapp.com",
  databaseURL:
    "https://dobutsushogi-43c6e-default-rtdb.europe-west1.firebasedatabase.app",
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
    onSuccess: ({ email, displayName, photoURL }: UserDataInterface) => void;
  };
}

export const registerUser = ({
  email,
  username,
  password,
  registerUserCb,
}: RegisterUserInterface) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((credentials) => {
      updateUserProfile({
        displayName: username,
        photoURL: "placeholder",
        cb: registerUserCb.onSuccess,
      });
      createUserStats({ userId: credentials.user.uid, userName: username });
    })
    .catch((err) => {
      registerUserCb.onError(err.message);
      console.log(err.message);
    });
};

// GAME CREATION AND MANAGEMENT
// ======================================================
export type VictoryType =
  | "LION_CAUGHT_SUCCESS"
  | "HOMEBASE_CONQUERED_SUCCESS"
  | "HOMEBASE_CONQUERED_FAILURE"
  | undefined
  | null;

export type gameStatusType = "WAITING" | "INPROGRESS" | "COMPLETED" | "TIE";

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

export const gamesCollectionRef = collection(db, "games");

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

export const createGame = ({
  creatorId,
  creatorName,
  name,
  gameId,
  createGameCb,
}: CreateGameInputInterface) => {
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

type playerType = "CREATOR" | "OPPONENT";

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
    updateDoc(doc(db, "games", gameId), {
      creatorJoined: true,
      creatorPhotoURL: joiningPlayerPhotoURL,
    })
      .then(() => console.log("The creator has joined the game."))
      .catch((err) => {
        console.log(err.message);
      });

    //Create creator stones
    let gameStones: Omit<StoneInterface, "allStones">[] =
      generateCreatorStones(joiningPlayerId);
    gameStones.forEach((stone) => {
      setDoc(doc(db, `games/${gameId}/stones`, stone.id), {
        ...stone,
      }).then(() => console.log("Creators stones got created."));
    });
  } else if (joiningPlayerType === "OPPONENT") {
    //Update game details
    updateDoc(doc(db, "games", gameId), {
      opponentId: joiningPlayerId,
      opponentName: joiningPlayerName,
      opponentPhotoURL: joiningPlayerPhotoURL,
      opponentJoined: true,
      status: "INPROGRESS",
    })
      .then(() => console.log("The opponent has joined the game."))
      .catch((err) => {
        console.log(err.message);
      });

    //Create opponent stones
    let gameStones: Omit<StoneInterface, "allStones">[] =
      generateOpponentStones(joiningPlayerId);
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

export interface Game {
  gameId: string;
  createdOn: number;
  creatorId: string;
  creatorName: string;
  creatorPhotoURL: string | null;
  creatorJoined: boolean;
  name: string;
  status: gameStatusType;
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

export interface updateGameInterface {
  id: string;
  updatedDetails: Partial<Game>;
}

export const updateGame = async ({
  id,
  updatedDetails,
}: updateGameInterface) => {
  const updateGameRef = doc(db, "games", id);
  await updateDoc(updateGameRef, { ...updatedDetails })
    .then(() => console.log("Game updated"))
    .catch((err) => {
      return err.message;
    });
};

interface getSingleGameDetailsInterface {
  gameId: string;
}

export const getSingleGameDetails = ({
  gameId,
}: getSingleGameDetailsInterface) => {
  return getDoc(doc(db, "games", gameId));
};

export interface UpdatePlayerAvatarInGamesInterface {
  playerId: string;
  updatedAvatar: string | null;
}

export const updatePlayerAvatarInGames = async ({
  playerId,
  updatedAvatar,
}: UpdatePlayerAvatarInGamesInterface) => {
  const queryGamesSnapshot = await getDocs(collection(db, "games"));
  let returnedGames: Game[] = [];
  queryGamesSnapshot.forEach((doc) => {
    returnedGames.push({ ...doc.data() } as Game);
  });

  let gamesWherePlayerIsOpponent = returnedGames
    .filter((game: Game) => game.opponentId === playerId)
    .map((gameWithPlayerOpponent: Game) => gameWithPlayerOpponent.gameId);

  let gamesWherePlayerIsCreator = returnedGames
    .filter((game: Game) => game.creatorId === playerId)
    .map((gameWithPlayerCreator: Game) => gameWithPlayerCreator.gameId);

  gamesWherePlayerIsCreator.forEach((gameId) => {
    updateGame({
      id: gameId,
      updatedDetails: { creatorPhotoURL: updatedAvatar },
    });
  });
  gamesWherePlayerIsOpponent.forEach((gameId) => {
    updateGame({
      id: gameId,
      updatedDetails: { opponentPhotoURL: updatedAvatar },
    });
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

export const useLoginUser = ({
  email,
  password,
  loginUserCb,
}: LoginUserInterface) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log("User logged in:", cred);
    })
    .catch((err) => {
      loginUserCb.forwardError(err.message);
      return err.message;
    });
};

// USER LOGOUT
// ======================================================
export const logoutUser = () => {
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

export const useRequestPasswordReset = ({
  email,
}: RequestPasswordResetInterface) => {
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
  cb: ({ email, displayName, photoURL }: UserDataInterface) => void;
}

export const updateUserProfile = ({
  displayName,
  photoURL,
  cb,
}: UpdateUserProfileInterface) => {
  updateProfile(auth.currentUser!, {
    displayName: displayName,
    photoURL: photoURL,
  })
    .then(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          cb({
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          });
        }
      });
      console.log("User profile updated");
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// STONES
// ======================================================
interface updateStonePositionInterface {
  gameId: string;
  stoneId: string;
  targetPositionColumnLetter: string;
  targetPositionRowNumber: number;
}

export const updateStonePosition = ({
  gameId,
  stoneId,
  targetPositionColumnLetter,
  targetPositionRowNumber,
}: updateStonePositionInterface) => {
  updateDoc(doc(db, `games/${gameId}/stones`, stoneId), {
    positionColumnLetter: targetPositionColumnLetter,
    positionRowNumber: targetPositionRowNumber,
    stashed: false,
  })
    .then(() => console.log("Stone position updated on server"))
    .catch((err) => {
      console.log(err.message);
    });
};

interface updateStoneTypeInterface {
  gameId: string;
  stoneId: string;
  type: stoneType;
}

export const empowerStone = ({
  gameId,
  stoneId,
  type,
}: updateStoneTypeInterface) => {
  updateDoc(doc(db, `games/${gameId}/stones`, stoneId), { type: type })
    .then(() => console.log("Stone empower has been updated on the server"))
    .catch((err) => {
      console.log(err.message);
    });
};

export const handicapStone = ({
  gameId,
  stoneId,
  type,
}: updateStoneTypeInterface) => {
  updateDoc(doc(db, `games/${gameId}/stones`, stoneId), { type: type })
    .then(() => console.log("Stone handicap has been updated on the server"))
    .catch((err) => {
      console.log(err.message);
    });
};

interface updateStoneHighlightingInterface {
  gameId: string;
  stoneId: string;
  highlighted: boolean;
}

export const updateStoneHighlighting = ({
  gameId,
  stoneId,
  highlighted,
}: updateStoneHighlightingInterface) => {
  updateDoc(doc(db, `games/${gameId}/stones`, stoneId), {
    highlighted: highlighted,
  })
    .then(() => console.log("Stone highlighting has been updated"))
    .catch((err) => {
      console.log(err.message);
    });
};

interface updateStoneInvisibilityInterface {
  gameId: string;
  stoneId: string;
  invisible: boolean;
}

export const updateStoneInvisibility = ({
  gameId,
  stoneId,
  invisible,
}: updateStoneInvisibilityInterface) => {
  updateDoc(doc(db, `games/${gameId}/stones`, stoneId), {
    invisible: invisible,
  })
    .then(() => console.log("Stone invisibility has been updated"))
    .catch((err) => {
      console.log(err.message);
    });
};

interface updateStoneOnTakeOverInterface {
  gameId: string;
  stone: Pick<
    StoneInterface,
    | "id"
    | "currentOwner"
    | "stashed"
    | "positionColumnLetter"
    | "positionRowNumber"
  >;
}

export const updateStoneOnTakeOver = ({
  gameId,
  stone,
}: updateStoneOnTakeOverInterface) => {
  updateDoc(doc(db, `games/${gameId}/stones`, stone.id), { ...stone })
    .then(() => console.log("Taken stone updated on server"))
    .catch((err) => {
      console.log(err.message);
    });
};

interface getSingleStoneDetailsInterface {
  gameId: string;
  stoneId: string;
}

export const getSingleStoneDetails = async ({
  gameId,
  stoneId,
}: getSingleStoneDetailsInterface) => {
  const stoneRef = doc(db, `games/${gameId}/stones/${stoneId}`);
  const singleStoneData = await getDoc(stoneRef);
  if (singleStoneData.exists()) {
    return singleStoneData;
  }
};

// USER GAME STATS
// =======================================================
export interface CreateUserStatsInterface {
  userId: string;
  userName: string;
}

export const createUserStats = ({
  userId,
  userName,
}: CreateUserStatsInterface) => {
  setDoc(doc(db, `stats`, userId), {
    userId: userId,
    userName: userName,
    win: 0,
    loss: 0,
    tie: 0,
  })
    .then(() => console.log("The user stats have been created"))
    .catch((err) => {
      console.log(err.message);
    });
};

interface UserStats {
  win: number;
  loss: number;
  tie: number;
}

export interface updateUserStatsInterface {
  userId: string;
  updatedDetails: Partial<UserStats>;
}

export const updateUserStats = ({
  userId,
  updatedDetails,
}: updateUserStatsInterface) => {
  const updateUserStatsRef = doc(db, "stats", userId);
  updateDoc(updateUserStatsRef, { ...updatedDetails })
    .then(() => console.log("User stats updated"))
    .catch((err) => {
      console.log(err.message);
    });
};

// Get user stats
export interface getSingleUserStatsInterface {
  userId: string;
}

export const getSingleUserStats = ({
  userId,
}: getSingleUserStatsInterface): Promise<DocumentSnapshot> => {
  return getDoc(doc(db, "stats", userId));
};
