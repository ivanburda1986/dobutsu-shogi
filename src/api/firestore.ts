import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, getDoc, setDoc, deleteDoc, doc, onSnapshot, orderBy, serverTimestamp, query, updateDoc, where } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth, signOut, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { LoggedInUserInterface } from "../App";
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
  registerUserCb: (userRegistrationSuccess: boolean) => void;
}

export const useRegisterUser = ({ email, password, registerUserCb }: RegisterUserInterface) => {
  //let userRegistrationSuccessful = false;
  if (email && password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((cred: any) => {
        console.log("user created:", cred.user);
        registerUserCb(true);
      })
      .catch((err: any) => {
        console.log(err.message);
        registerUserCb(false);
      });
  }
  //return userRegistrationSuccessful;
};

interface LoginUserInterface {
  email: string | undefined;
  password: string | undefined;
  loginUserCb: {
    resetForm: (userLoginSuccess: boolean) => void;
  };
}

export const useLoginUser = ({ email, password, loginUserCb }: LoginUserInterface) => {
  if (email && password) {
    signInWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        loginUserCb.resetForm(true);
      })
      .catch((err) => {
        console.log(err.message);
        loginUserCb.resetForm(false);
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
