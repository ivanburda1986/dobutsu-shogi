import React from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
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
//Collection ref
const colRef = collection(db, "books");
//Get collection data
getDocs(colRef)
  .then((snapshot) => {
    const books = snapshot.docs.map((book) => {
      return { id: book.id, ...book.data() };
    });
    console.log(books);
  })
  .catch((error) => console.log(error.message));

function App() {
  return (
    <div className="App">
      <h1>POC for real-time updates</h1>
      <div className="counter">
        <p>1</p>
      </div>
      <div className="controller">
        <button>-</button>
        <button>+</button>
      </div>
    </div>
  );
}

export default App;
