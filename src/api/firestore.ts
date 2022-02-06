import { UserDataInterface } from "../App";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, Timestamp, getDocs, addDoc, getDoc, setDoc, deleteDoc, doc, onSnapshot, orderBy, serverTimestamp, query, updateDoc, where, documentId, DocumentData } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth, signOut, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile, onAuthStateChanged } from "firebase/auth";

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

export type gameType = "DOBUTSU" | "GOROGORO" | "GREENWOOD";
export type statusType = "WAITING" | "VICTORY" | "CANCELLED" | "RESIGNED";
export interface CreateGameInterface {
  creatorId: string;
  creatorName: string;
  name: string;
  type: gameType;
  createGameCb: {
    redirect: () => void;
  };
}
export const gamesCollectionRef = collection(db, "games");
export const useCreateGame = ({ creatorId, creatorName, name, type, createGameCb }: CreateGameInterface) => {
  addDoc(gamesCollectionRef, {
    createdOn: Date.now(),
    creatorId: creatorId,
    creatorName: creatorName,
    name: name,
    type: type,
    status: "WAITING",
    oponent: null,
    startingPlayer: null,
    winner: null,
    finishedTimeStamp: null,
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

// USER REGISTRATION
// ======================================================
interface RegisterUserInterface {
  email: string;
  username: string;
  password: string;
  registerUserCb: {
    forwardError: (error: string) => void;
    updateUserData: () => void;
  };
}

export const useRegisterUser = ({ email, username, password, registerUserCb }: RegisterUserInterface) => {
  const updateUserProfile = useUpdateUserProfile;
  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      updateUserProfile({ displayName: username, photoURL: "placeholder", cb: registerUserCb.updateUserData });
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

export const useLoginUser = ({ email, password, loginUserCb }: LoginUserInterface) => {
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
export const useRequestPasswordReset = ({ email }: RequestPasswordResetInterface) => {
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

export const useUpdateUserProfile = ({ displayName, photoURL, cb }: UpdateUserProfileInterface) => {
  updateProfile(auth.currentUser!, {
    displayName: displayName,
    photoURL: photoURL,
  })
    .then(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          cb({ email: user.email, displayName: user.displayName, photoURL: user.photoURL });
        }
        console.log(user);
      });
      console.log("User profile updated");
    })
    .catch((err) => {
      console.log(err.message);
    });
};
