import React, { useContext, useEffect, useState } from "react";
import styles from "./Stone.module.css";

import { StoneInterface } from "../../../api/firestore";
import { useSetStonePosition, rotateOponentStones, getImgReference, amIStoneOwner } from "./StoneService";
import { ProvidedContextInterface } from "../../../App";
import { AppContext } from "../../../context/AppContext";

export const Stone = ({ amIOpponent, id, type, empowered, originalOwner, currentOwner, stashed, positionLetter, positionNumber, rowNumbers, columnLetters }: StoneInterface) => {
  const appContext: ProvidedContextInterface = useContext(AppContext);
  const [rotateDegrees, setRotateDegrees] = useState<number>(0);
  const [positionX, setPositionX] = useState<number>(0);
  const [positionY, setPositionY] = useState<number>(0);
  const setStonePosition = useSetStonePosition;

  useEffect(() => {
    setStonePosition({ stoneId: id, targetPositionLetter: positionLetter, targetPositionNumber: positionNumber, positionX, positionY, setPositionX, setPositionY });
    rotateOponentStones({ currentOwner: currentOwner, loggedInUserUserId: appContext.loggedInUserUserId, setRotateDegrees });
  }, [id, positionLetter, positionNumber, positionX, positionY, amIOpponent, rowNumbers, columnLetters]);

  return (
    <div
      id={id}
      draggable={amIStoneOwner({ currentOwner: currentOwner, loggedInUserUserId: appContext.loggedInUserUserId })}
      style={{ backgroundImage: `url(${getImgReference(type)})`, transform: `rotate(${rotateDegrees}deg)` }}
      className={`${styles.Stone} noselect`}
      onClick={() => setStonePosition({ stoneId: id, targetPositionLetter: positionLetter, targetPositionNumber: positionNumber, positionX, positionY, setPositionX, setPositionY })}
    >
      {currentOwner.substr(0, 2)}
    </div>
  );
};
