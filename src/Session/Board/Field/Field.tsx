import { FC } from "react";
import { Col } from "react-bootstrap";
import styles from "./Field.module.css";
import { isLetterLabelVisible, isNumberLabelVisible } from "./FieldService";

interface FieldInterface {
  rowNumber: number;
  columnLetter: string;
}

export const Field: FC<FieldInterface> = ({ rowNumber, columnLetter }) => {
  // Just an info function for dev purposes - remove afterwards
  const getStoneTargetCoordinates = ({ positionLetter, positionNumber }: { positionLetter: string; positionNumber: number }) => {
    let targetPosition = document.querySelector(`[data-letter="${positionLetter}"][data-number="${positionNumber}"]`);
    let rect = targetPosition?.getBoundingClientRect();
    console.log(rect);
  };
  return (
    <div data-number={rowNumber} data-letter={columnLetter} className={`${styles.Field} noselect`} onClick={() => getStoneTargetCoordinates({ positionLetter: columnLetter, positionNumber: rowNumber })}>
      {isLetterLabelVisible({ rowNumber, columnLetter }) && <span className={styles.columnLetter}>{columnLetter}</span>}
      {isNumberLabelVisible({ rowNumber, columnLetter }) && <span className={styles.rowNumber}>{rowNumber}</span>}
    </div>
  );
};
