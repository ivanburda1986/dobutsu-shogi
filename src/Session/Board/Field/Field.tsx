import React, { FC } from "react";
import { useParams } from "react-router";
import { useGetSingleStoneDetails, useUpdateStonePosition } from "../../../api/firestore";
import styles from "./Field.module.css";
import { isLetterLabelVisible, isNumberLabelVisible } from "./FieldService";

interface FieldInterface {
  rowNumber: number;
  columnLetter: string;
  amIOpponent: boolean;
}

export const evaluateStoneMove = () => {
  // -did I move in the direction allowed for the stone? If OK, continue
  //What is the current position of the stone?
  //Where can the stone move to?
  //Where I am moving the stone to?


  // -did I move to an allowed distance for the stone? If OK, continue
  // -is the target field on the board? If yes, continue
  // -is the target field free or is there an opponent's stone? If yes, continue
  // --if it is free: place the stone
  // --if there is an opponents stone and it is not the Lion
  // ---the opponent's stone should turn into my own stone
  // ---the opponent's stone should land in my stash; if there is already a stone of this type, lay over it and increase the count
}

export const Field: FC<FieldInterface> = ({ rowNumber, columnLetter, amIOpponent }) => {
  const updateStonePosition = useUpdateStonePosition;
  const getSingleStoneDetails = useGetSingleStoneDetails;
  const { gameId } = useParams();

  // Just an info function for dev purposes - remove afterwards
  const getStoneTargetCoordinates = ({ positionLetter, positionNumber }: { positionLetter: string; positionNumber: number }) => {
    let targetPosition = document.querySelector(`[data-letter="${positionLetter}"][data-number="${positionNumber}"]`);
    let rect = targetPosition?.getBoundingClientRect();
    console.log(rect);
  };

  const enableDropping = (event: React.DragEvent<HTMLDivElement>) => {
    let placedStoneId = event.dataTransfer!.getData("placedStoneId")
    console.log('id je:', placedStoneId);
    //const result = getSingleStoneDetails({gameId:gameId!, stoneId:placedStoneId})
    console.log("Something is over me!!");
    event.preventDefault();
  };

  const onDropHandler = (event: React.DragEvent<HTMLDivElement>) => {
    let placedStoneId = event.dataTransfer!.getData("placedStoneId");
    console.log(placedStoneId)
    evaluateStoneMove();
    updateStonePosition({ gameId: gameId!, stoneId: placedStoneId, positionLetter: columnLetter, positionNumber: rowNumber });
  };

  return (
    <div
      onDragOver={enableDropping}
      onDrop={onDropHandler}
      style={{ transform: `rotate(${amIOpponent === true ? 180 : 0}deg)` }}
      data-number={rowNumber}
      data-letter={columnLetter}
      className={`${styles.Field} noselect`}
      onClick={() => getStoneTargetCoordinates({ positionLetter: columnLetter, positionNumber: rowNumber })}
    >
      {isLetterLabelVisible({ rowNumber, columnLetter }) && <span className={styles.columnLetter}>{columnLetter}</span>}
      {isNumberLabelVisible({ rowNumber, columnLetter }) && <span className={styles.rowNumber}>{rowNumber}</span>}
    </div>
  );
};
