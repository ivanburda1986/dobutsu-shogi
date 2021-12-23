import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";

// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
const firebaseConfig = {
  apiKey: "AIzaSyCBnawTeOf0cVa7m7aKFQoIqrXbJOorW2c",
  authDomain: "dobutsushogi-43c6e.firebaseapp.com",
  projectId: "dobutsushogi-43c6e",
  storageBucket: "dobutsushogi-43c6e.appspot.com",
  messagingSenderId: "721291009374",
  appId: "1:721291009374:web:16ce8eaf9286ec6a4683cf",
  measurementId: "G-NHVXG2LCZJ",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
const database = firebase.database();

export default database;
