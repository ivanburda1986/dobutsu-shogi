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
  isOpponentsInterface: boolean;
  gameData: DocumentData | undefined;
}

export const PlayerInterface: FC<PlayerInterfaceInterface> = ({ type, amIOpponent, isOpponentsInterface, gameData }) => {
  const appContext: ProvidedContextInterface = useContext(AppContext);
  const [rowNumbers, setRowNumbers] = useState<number[]>(getStashSize({ type }).rowNumbers);
  const [columnLetters, setColumnLetters] = useState<string[]>(getStashSize({ type }).columnLetters);

  const whatNameToDisplay = () => {
    if (isOpponentsInterface) {
      return gameData?.opponentName;
    }
    return appContext.loggedInUserDisplayName ? appContext.loggedInUserDisplayName : "Username";
  };
  return (
    <div className={`${styles.PlayerInterface} mx-3`} style={{ transform: `rotate(${isOpponentsInterface === true ? 180 : 0}deg)` }}>
      <div className={`${isOpponentsInterface ? styles.OpponentHeader : styles.CreatorHeader} d-flex justify-content-between align-items-center rounded mb-1 p-1`}>
        <Avatar name={isOpponentsInterface ? gameData?.opponentPhotoURL : appContext.loggedInUserPhotoURL} />
        <span className="ms-1 fs-5 text-primary">{whatNameToDisplay()}</span>
        {!isOpponentsInterface && (
          <Button variant="outline-dark" size="sm" className="btn-height-30">
            <FaRegFlag />
          </Button>
        )}
      </div>
      <div>
        {rowNumbers.map((item) => (
          <BoardRow key={uuidv4()} rowNumber={item} columnLetters={columnLetters} amIOpponent={amIOpponent} fieldType={"STASHFIELD"} />
        ))}
      </div>
    </div>
  );
};
