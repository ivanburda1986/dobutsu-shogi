import React from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, getDoc, setDoc, deleteDoc, doc, onSnapshot, orderBy, serverTimestamp, query, updateDoc, where } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import "./App.css";

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
const auth = getAuth();

//Collection ref
const colRef = collection(db, "books");
// Get collection data
// getDocs(colRef)
//   .then((snapshot) => {
//     const books = snapshot.docs.map((book) => {
//       return { id: book.id, ...book.data() };
//     });
//     console.log(books);
//   })
//   .catch((error) => console.log(error.message));

//Query a collection subset
//const q = query(colRef, where("author", "==", "Daniel Defoe"), orderBy("title", "desc"));
//const q = query(colRef, where("author", "==", "Daniel Defoe"));
const q = query(colRef, orderBy("createdAt", "asc"));

//Get colleaction data realtime, NOTE: use colRef as the first argument to get all or 'q; to get just the query
onSnapshot(colRef, (snapshot) => {
  const books = snapshot.docs.map((book) => {
    return { id: book.id, ...book.data() };
  });
  console.log("Real-time updated data");
  console.log(books);
});

//Get a single piece of document data
const docRef = doc(db, "books", "p9Z3bdzux97PcQdr44kf");
const getSignleDataPiece = () => {
  getDoc(docRef).then((doc) => {
    console.log(doc.data());
    console.log(doc.id);
  });
};

//Get a single piece of document data and its realtime updates
const getSignleDataPieceRT = () => {
  onSnapshot(docRef, (doc) => {
    console.log("Updated data");
    console.log(doc.data());
  });
};

const cancelSingleDataPieceRTListener = () => {
  onSnapshot(collection(db, "books"), () => {
    console.log("Unsubscribed from any further realtime updates");
  });
};

//Add data
const addDataHandler = () => {
  addDoc(colRef, {
    title: "Zombie Apocalypse",
    author: "Richard Bachman",
    createdAt: serverTimestamp(),
  }).then(() => console.log("server data updated"));
};

//Add data with a custom document id
const addDataHandlerCustomId = () => {
  setDoc(doc(db, "magazines", "king"), {
    title: "Pet Sematary",
    author: "Stephen King",
  }).then(() => console.log("server data added"));
};

//Delete doc
const deleteDataHandler = () => {
  const docRef = doc(db, "books", "RJ6yUiwuqS48tSgXmNkk");
  deleteDoc(docRef).then(() => console.log("data deleted"));
};

//Update a document
const udpateDocumentHandler = () => {
  const docRef = doc(db, "books", "p9Z3bdzux97PcQdr44kf");
  //Only the properties we pass in as the updated object will get updated in the db. The rest will stay untouched.
  updateDoc(docRef, {
    title: "Moby Dick",
    author: "Herman Melville sr.",
    yearOfPublication: 1850,
  }).then(() => console.log("document updated"));
};

function App() {
  return (
    <div className="App">
      <h1>POC for real-time updates</h1>
      <div className="counter">
        <p>1</p>
      </div>
      <div className="controller">
        <button onClick={() => deleteDataHandler()}>-</button>
        <button onClick={() => addDataHandler()}>+</button>
        <button onClick={() => getSignleDataPieceRT()}>Sub1pc</button>
        <button onClick={() => cancelSingleDataPieceRTListener()}>Unsub</button>
        <button onClick={() => udpateDocumentHandler()}>Update</button>
      </div>
    </div>
  );
}

export default App;
