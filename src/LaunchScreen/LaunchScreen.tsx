import React from "react";

import styles from "./LaunchScreen.module.css";
import sharedStyles from "../sharedStyles.module.css";
import { Game } from "./newGameClass";

export const LaunchScreen: React.FC = () => {
  React.useEffect(() => {
    const game = new Game({ name: "Ivanova hra", creator: "abcdef", type: "DOBUTSU" });
    game.setOponentName("lukas");
    console.log(game);
  });
  return <div className="container-lg">Lanchscreen</div>;
};
