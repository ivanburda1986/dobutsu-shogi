import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, getDoc, setDoc, deleteDoc, doc, onSnapshot, orderBy, serverTimestamp, query, updateDoc, where } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth, signOut, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

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

interface RegisterUserInterface {
  email: string | undefined;
  password: string | undefined;
  registerUserCb: {
    resetForm: (userRegistrationSuccess: boolean) => void;
    registrationProgress: (registrationProgressFinished: boolean) => void;
    forwardError: (error: string) => void;
  };
}

export const useRegisterUser = ({ email, password, registerUserCb }: RegisterUserInterface) => {
  //let userRegistrationSuccessful = false;
  if (email && password) {
    registerUserCb.registrationProgress(false);
    createUserWithEmailAndPassword(auth, email, password)
      .then((cred: any) => {
        setTimeout(() => {
          registerUserCb.registrationProgress(true);
        }, 500);
        console.log("user created:", cred.user);
        registerUserCb.resetForm(true);
      })
      .catch((err: any) => {
        console.log(err.message);
        registerUserCb.resetForm(false);
        registerUserCb.forwardError(err.message);
      });
  }
  //return userRegistrationSuccessful;
};

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
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
};
