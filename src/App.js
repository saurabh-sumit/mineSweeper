import "./App.css";

import React, { useState } from "react";

import GameBoard from "./Component/GameBoard";

function App() {
  const [height, setHeight] = useState(8); // setting up initial table length
  const [width, setwidth] = useState(8);
  const [mines, setMines] = useState(10); // mine counts
  return (
    <div className="gameApp">
      <GameBoard height={height} width={width} mines={mines} />
    </div>
  );
}

export default App;
