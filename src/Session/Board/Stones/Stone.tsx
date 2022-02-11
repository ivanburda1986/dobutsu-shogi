import React, { useEffect, useState } from "react";
import CHICKEN from "./images/chicken.png";
import ELEPHANT from "./images/elephant.png";
import GIRAFFE from "./images/giraffe.png";
import LION from "./images/lion.png";
import styles from "./Stone.module.css";

import { StoneInterface, stoneType } from "../../../api/firestore";

export const Stone = ({ id, type, empowered, originalOwner, currentOwner, stashed, positionLetter, positionNumber }: StoneInterface) => {
  const [positionX, setPositionX] = useState<number>();
  const [positionY, setPositionY] = useState<number>();
  const [turnDegrees, setTurnDegrees] = useState<string>();
  const loggedInUserUserId = "player1";
  useEffect(() => {
    let div = document.getElementById(id);
    div!.style.left = positionX + "px";
    div!.style.top = positionY + "px";
    getStoneTargetCoordinates({ positionLetter, positionNumber });
  }, [id, positionLetter, positionNumber, positionX, positionY]);
  useEffect(() => {
    if (originalOwner === loggedInUserUserId) {
      return setTurnDegrees("0deg");
    }
    return setTurnDegrees("180deg");
  }, []);

  const getImgReference = (type: stoneType) => {
    if (type === "CHICKEN") return CHICKEN;
    if (type === "ELEPHANT") return ELEPHANT;
    if (type === "GIRAFFE") return GIRAFFE;
    return LION;
  };

  const getStoneTargetCoordinates = ({ positionLetter, positionNumber }: { positionLetter: string; positionNumber: number }) => {
    let targetPosition = document.querySelector(`[data-letter="${positionLetter}"][data-number="${positionNumber}"]`);
    let rect = targetPosition?.getBoundingClientRect();
    setPositionX(Math.floor(rect!.x + 8));
    setPositionY(Math.floor(rect!.y + 8));
    console.log(rect);
  };

  return <div id={id} style={{ backgroundImage: `url(${getImgReference(type)})`, transform: `rotate(${turnDegrees})` }} className={styles.Stone} onClick={() => getStoneTargetCoordinates({ positionLetter, positionNumber })}></div>;
};
