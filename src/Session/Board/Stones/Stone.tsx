import React, { useEffect, useState } from "react";
import CHICKEN from "./images/chicken.png";
import ELEPHANT from "./images/elephant.png";
import GIRAFFE from "./images/giraffe.png";
import LION from "./images/lion.png";
import styles from "./Stone.module.css";

import { StoneInterface, stoneType } from "../../../api/firestore";
import { useSetStonePosition, rotateOponentStones } from "./StoneService";

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

  const getImgReference = (type: stoneType) => {
    if (type === "CHICKEN") return CHICKEN;
    if (type === "ELEPHANT") return ELEPHANT;
    if (type === "GIRAFFE") return GIRAFFE;
    return LION;
  };

  return (
    <div
      id={id}
      style={{ backgroundImage: `url(${getImgReference(type)})`, transform: `rotate(${rotateDegrees}deg)` }}
      className={styles.Stone}
      onClick={() => setStonePosition({ stoneId: id, targetPositionLetter: positionLetter, targetPositionNumber: positionNumber, positionX, positionY, setPositionX, setPositionY })}
    ></div>
  );
};
