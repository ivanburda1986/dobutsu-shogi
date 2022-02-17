import React, { useContext, useEffect, useState } from "react";
import styles from "./Stone.module.css";

import { StoneInterface, useUpdateStonePosition, useUpdateStoneType } from "../../../api/firestore";
import { useSetStonePosition, rotateOponentStones, getImgReference, amIStoneOwner } from "./StoneService";
import { ProvidedContextInterface } from "../../../App";
import { AppContext } from "../../../context/AppContext";

export const Stone = ({ amIOpponent, id, type, empowered, originalOwner, currentOwner, stashed, positionLetter, positionNumber, rowNumbers, columnLetters }: StoneInterface) => {
  const appContext: ProvidedContextInterface = useContext(AppContext);
  const [rotateDegrees, setRotateDegrees] = useState<number>(0);
  const [positionX, setPositionX] = useState<number>(0);
  const [positionY, setPositionY] = useState<number>(0);
  const setStonePosition = useSetStonePosition;
  const updateStonePosition = useUpdateStonePosition;
  const updateStoneType = useUpdateStoneType;

  useEffect(() => {
    setStonePosition({ stoneId: id, targetPositionLetter: positionLetter, targetPositionNumber: positionNumber, positionX, positionY, setPositionX, setPositionY });
    rotateOponentStones({ currentOwner: currentOwner, loggedInUserUserId: appContext.loggedInUserUserId, setRotateDegrees });
  }, [id, positionLetter, positionNumber, positionX, positionY, amIOpponent, rowNumbers, columnLetters]);

  const onDragHandler = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("placedStoneId", id);
  };

  const onDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    const overLayingStoneId = event.dataTransfer!.getData("placedStoneId");
    console.log("Dragged over stone id:", overLayingStoneId);

    if (overLayingStoneId !== "f314ba1b-71a5-4eb0-9634-b9bcc24321ed") {
      updateStoneType({ gameId: "Qv3RW08itHgEJsyTlWal", stoneId: "f314ba1b-71a5-4eb0-9634-b9bcc24321ed", type: "GIRAFFE" });
    }
  };

  return (
    <div
      id={id}
      onDragEnter={onDragEnter}
      draggable={amIStoneOwner({ currentOwner: currentOwner, loggedInUserUserId: appContext.loggedInUserUserId })}
      onDragStart={onDragHandler}
      style={{ backgroundImage: `url(${getImgReference(type)})`, transform: `rotate(${rotateDegrees}deg)` }}
      className={`${styles.Stone} noselect`}
      onClick={() => setStonePosition({ stoneId: id, targetPositionLetter: positionLetter, targetPositionNumber: positionNumber, positionX, positionY, setPositionX, setPositionY })}
    >
      {currentOwner.substr(0, 2)}
    </div>
  );
};
