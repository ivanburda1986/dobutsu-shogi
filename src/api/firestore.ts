import { initializeApp } from "firebase/app";
import { getFirestore, collection, Timestamp, getDocs, addDoc, getDoc, setDoc, deleteDoc, doc, onSnapshot, orderBy, serverTimestamp, query, updateDoc, where, documentId, DocumentData } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth, signOut, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile, onAuthStateChanged } from "firebase/auth";
import { UserDataInterface } from "../App";

import { gameType, statusType } from "../CreateGame/newGameClass";

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
const db = getFirestore();

//Init authentication
export const auth = getAuth();

// GAME CREATION AND MANAGEMENT
// ======================================================
export const gamesCollectionRef = collection(db, "games");

export interface CreateGameInterface {
  createdOn?: number;
  creatorId: string;
  creatorName: string;
  finishedTimeStamp?: number | null;
  name: string;
  oponent?: string | null;
  startingPlayer?: string | null;
  status?: statusType;
  timeToComplete?: number | null;
  type: gameType;
  winner?: string | null;
  createGameCb: {
    redirect: () => void;
  };
}
export const useCreateGame = ({ creatorId, creatorName, name, type, createGameCb }: CreateGameInterface) => {
  addDoc(gamesCollectionRef, {
    createdOn: Date.now(),
    creatorId: creatorId,
    creatorName: creatorName,
    finishedTimeStamp: null,
    name: name,
    oponent: null,
    startingPlayer: null,
    status: "WAITING",
    timeToComplete: null,
    type: type,
    winner: null,
  }).then(() => {
    createGameCb.redirect();
  });
};

export const useDeleteGame = (id: string) => {
  const deleteGameRef = doc(db, "games", id);
  deleteDoc(deleteGameRef).then(() => {
    console.log("Game deleted");
  });
};

interface ReturnedGameInterface extends DocumentData {
  id: string;
}
export const useGetGames = () => {
  onSnapshot(gamesCollectionRef, (snapshot) => {
    let games: ReturnedGameInterface[] = [];
    snapshot.docs.forEach((doc) => {
      games.push({ id: doc.id, ...doc.data() });
    });
    console.log(games);
    return games;
  });
};

// USER REGISTRATION AND MANAGEMENT
// ======================================================
interface LoginUserInterface {
  email: string | undefined;
  password: string | undefined;
  loginUserCb: {
    forwardError: (error: string) => void;
  };
}

export const useLoginUser = ({ email, password, loginUserCb }: LoginUserInterface) => {
  if (email && password) {
    signInWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        console.log(cred);
      })
      .catch((err) => {
        console.log(err.message);
        loginUserCb.forwardError(err.message);
      });
  }
};

export const useGetUserDetails = () => {
  const user = auth.currentUser;
  if (user) {
    console.log(user.providerData[0]);
    return user.providerData[0];
  }
};

export const useLogoutUser = () => {
  signOut(auth)
    .then(() => {
      console.log("The user has signed out");
    })
    .catch((err) => {
      console.log(err.message);
    });
};

interface RequestPasswordResetInterface {
  email: string;
}
export const useRequestPasswordReset = ({ email }: RequestPasswordResetInterface) => {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      console.log("Password reset email sent!");
    })
    .catch((err) => {
      console.log(err.message);
    });
};

interface UpdateUserProfileInterface {
  displayName?: string;
  photoURL?: string;
  cb: ({ email, username, avatarImg }: UserDataInterface) => void;
}

export const useUpdateUserProfile = ({ displayName, photoURL, cb }: UpdateUserProfileInterface) => {
  updateProfile(auth.currentUser!, {
    displayName: displayName,
    photoURL: photoURL,
  })
    .then(() => {
      console.log("User profile updated");
      onAuthStateChanged(auth, (user) => {
        if (user) {
          cb({ email: user.email, username: user.displayName, avatarImg: user.photoURL });
        }
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
};

interface RegisterUserInterface {
  email: string | undefined;
  username: string | undefined;
  password: string | undefined;
  registerUserCb: {
    forwardError: (error: string) => void;
    updateUserData: () => void;
  };
}

export const useRegisterUser = ({ email, username, password, registerUserCb }: RegisterUserInterface) => {
  const updateUserProfile = useUpdateUserProfile;
  if (email && password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((cred: any) => {
        console.log("user created:", cred.user);
        updateUserProfile({ displayName: username, photoURL: "placeholder", cb: registerUserCb.updateUserData });
      })
      .catch((err: any) => {
        console.log(err.message);
        registerUserCb.forwardError(err.message);
      });
  }
};
