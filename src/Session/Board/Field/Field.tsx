import React, { FC } from "react";
import { Col } from "react-bootstrap";
import { useUpdateStonePosition } from "../../../api/firestore";
import styles from "./Field.module.css";
import { isLetterLabelVisible, isNumberLabelVisible } from "./FieldService";

interface FieldInterface {
  rowNumber: number;
  columnLetter: string;
  amIOpponent: boolean;
}

export const Field: FC<FieldInterface> = ({ rowNumber, columnLetter, amIOpponent }) => {
  const updateStonePosition = useUpdateStonePosition;

  // Just an info function for dev purposes - remove afterwards
  const getStoneTargetCoordinates = ({ positionLetter, positionNumber }: { positionLetter: string; positionNumber: number }) => {
    let targetPosition = document.querySelector(`[data-letter="${positionLetter}"][data-number="${positionNumber}"]`);
    let rect = targetPosition?.getBoundingClientRect();
    console.log(rect);
  };

  const enableDropping = (event: React.DragEvent<HTMLDivElement>) => {
    console.log("Something is over me");
    event.preventDefault();
  };

  const onDropHandler = (event: React.DragEvent<HTMLDivElement>) => {
    let placedStoneId = event.dataTransfer!.getData("placedStoneId");
    console.log(columnLetter);
    updateStonePosition({ gameId: "Qv3RW08itHgEJsyTlWal", stoneId: placedStoneId, positionLetter: columnLetter, positionNumber: rowNumber });
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
