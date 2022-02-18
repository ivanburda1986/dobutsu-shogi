import React, { FC, useContext, useState } from "react";
import { gameType } from "../../api/firestore";
import { ProvidedContextInterface } from "../../App";
import { AppContext } from "../../context/AppContext";
import { Avatar } from "../../Header/Avatar/Avatar";
import { BoardRow } from "../Board/BoardRow/BoardRow";
import styles from "./PlayerInterface.module.css";
import { getStashSize } from "./PlayerInterfaceService";
import { v4 as uuidv4 } from "uuid";

interface PlayerInterfaceInterface {
  type: gameType;
  amIOpponent: boolean;
}

export const PlayerInterface: FC<PlayerInterfaceInterface> = ({ type, amIOpponent }) => {
  const appContext: ProvidedContextInterface = useContext(AppContext);
  const [rowNumbers, setRowNumbers] = useState<number[]>(getStashSize({ type }).rowNumbers);
  const [columnLetters, setColumnLetters] = useState<string[]>(getStashSize({ type }).columnLetters);
  return (
    <div className={`${styles.PlayerInterface} mx-3`}>
      <div className={`${styles.Header} d-flex`}>
        <Avatar name={appContext.loggedInUserPhotoURL} />
        <span className="ms-1 fs-6">{appContext.loggedInUserDisplayName ? appContext.loggedInUserDisplayName : "Username"}</span>
        <button>Resign</button>
      </div>
      <div>
        {rowNumbers.map((item) => (
          <BoardRow key={uuidv4()} rowNumber={item} columnLetters={columnLetters} amIOpponent={amIOpponent} />
        ))}
      </div>
    </div>
  );
};
