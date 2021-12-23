import React from "react";

import "./App.css";

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
