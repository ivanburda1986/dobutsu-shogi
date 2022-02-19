import React, { FC, useContext, useState } from "react";
import { gameType } from "../../api/firestore";
import { ProvidedContextInterface } from "../../App";
import { AppContext } from "../../context/AppContext";
import { Avatar } from "../../Header/Avatar/Avatar";
import { BoardRow } from "../Board/BoardRow/BoardRow";
import styles from "./PlayerInterface.module.css";
import { getStashSize } from "./PlayerInterfaceService";
import { v4 as uuidv4 } from "uuid";
import { Button } from "react-bootstrap";
import { FaRegFlag } from "react-icons/fa";
import { DocumentData } from "firebase/firestore";

interface PlayerInterfaceInterface {
  type: gameType;
  amIOpponent: boolean;
  creatorInterface: boolean;
  gameData: DocumentData | undefined;
}

export const PlayerInterface: FC<PlayerInterfaceInterface> = ({ type, amIOpponent, creatorInterface, gameData }) => {
  const appContext: ProvidedContextInterface = useContext(AppContext);
  const [rowNumbers, setRowNumbers] = useState<number[]>(getStashSize({ type }).rowNumbers);
  const [columnLetters, setColumnLetters] = useState<string[]>(getStashSize({ type }).columnLetters);

  const whatNameToDisplay = () => {
    if (creatorInterface) {
      return gameData?.creatorName;
    }
    return gameData?.opponentName;
  };
  return (
    <div className={`${styles.PlayerInterface} mx-3`} style={{ transform: `rotate(${creatorInterface === true ? 0 : 180}deg)` }}>
      <div className={`${creatorInterface ? styles.CreatorHeader : styles.OpponentHeader} d-flex justify-content-between align-items-center rounded mb-1 p-1`}>
        <Avatar name={creatorInterface ? gameData?.creatorPhotoURL : gameData?.opponentPhotoURL} />
        <span className="ms-1 fs-5 text-primary">{whatNameToDisplay()}</span>
        {/* {!creatorInterface && (
          <Button variant="outline-dark" size="sm" className="btn-height-30">
            <FaRegFlag />
          </Button>
        )} */}
      </div>
      <div>
        {rowNumbers.map((item) => (
          <BoardRow key={uuidv4()} rowNumber={item} columnLetters={columnLetters} amIOpponent={amIOpponent} fieldType={"STASHFIELD"} />
        ))}
      </div>
    </div>
  );
};
