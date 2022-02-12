import React, { useContext, useEffect, useState } from "react";
import styles from "./Stone.module.css";

import { StoneInterface } from "../../../api/firestore";
import { useSetStonePosition, rotateOponentStones, getImgReference } from "./StoneService";
import { ProvidedContextInterface } from "../../../App";
import { AppContext } from "../../../context/AppContext";

export const Stone = ({ id, type, empowered, originalOwner, currentOwner, stashed, positionLetter, positionNumber }: StoneInterface) => {
  const appContext: ProvidedContextInterface = useContext(AppContext);
  const [rotateDegrees, setRotateDegrees] = useState<number>(0);
  const [positionX, setPositionX] = useState<number>(0);
  const [positionY, setPositionY] = useState<number>(0);
  const setStonePosition = useSetStonePosition;

  useEffect(() => {
    setStonePosition({ stoneId: id, targetPositionLetter: positionLetter, targetPositionNumber: positionNumber, positionX, positionY, setPositionX, setPositionY });
  }, [id, positionLetter, positionNumber, positionX, positionY]);

  useEffect(() => {
    rotateOponentStones({ owner: currentOwner, loggedInUserUserId: appContext.loggedInUserUserId, setRotateDegrees });
  }, []);

  return (
    <div
      id={id}
      style={{ backgroundImage: `url(${getImgReference(type)})`, transform: `rotate(${rotateDegrees}deg)` }}
      className={styles.Stone}
      onClick={() => setStonePosition({ stoneId: id, targetPositionLetter: positionLetter, targetPositionNumber: positionNumber, positionX, positionY, setPositionX, setPositionY })}
    ></div>
  );
};
