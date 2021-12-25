import React from "react";
import { getCities } from "./FirebaseSetup";
import "./App.css";

function App() {
  const getCitiesHandler = () => {
    const cities = getCities();
    console.log(cities);
  };

  return (
    <div className="App">
      <h1>POC for real-time updates</h1>
      <div className="counter">
        <p>1</p>
      </div>
      <div className="controller">
        <button onClick={() => getCitiesHandler()}>-</button>
        <button>+</button>
      </div>
    </div>
  );
}

export default App;
