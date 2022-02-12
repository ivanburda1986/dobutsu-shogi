import React, { useEffect, useState } from "react";
import styles from "./Stone.module.css";

import { StoneInterface } from "../../../api/firestore";
import { useSetStonePosition, rotateOponentStones, getImgReference } from "./StoneService";

export const Stone = ({ id, type, empowered, originalOwner, currentOwner, stashed, positionLetter, positionNumber }: StoneInterface) => {
  const [rotateDegrees, setRotateDegrees] = useState<number>(0);
  const loggedInUserUserId = "player1";
  const [positionX, setPositionX] = useState<number>(0);
  const [positionY, setPositionY] = useState<number>(0);
  const setStonePosition = useSetStonePosition;

  useEffect(() => {
    setStonePosition({ stoneId: id, targetPositionLetter: positionLetter, targetPositionNumber: positionNumber, positionX, positionY, setPositionX, setPositionY });
  }, [id, positionLetter, positionNumber, positionX, positionY]);

  useEffect(() => {
    rotateOponentStones({ originalOwner, loggedInUserUserId, setRotateDegrees });
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
