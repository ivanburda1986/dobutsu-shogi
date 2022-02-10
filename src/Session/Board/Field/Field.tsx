import { FC } from "react";
import { Col } from "react-bootstrap";
import styles from "./Field.module.css";
import { isLetterLabelVisible, isNumberLabelVisible } from "./FieldService";

interface FieldInterface {
  rowNumber: number;
  columnLetter: string;
}

export const Field: FC<FieldInterface> = ({ rowNumber, columnLetter }) => {
  return (
    <div data-row={rowNumber} data-letter={columnLetter} className={`${styles.Field}`}>
      {isLetterLabelVisible({ rowNumber, columnLetter }) && <span className={styles.columnLetter}>{columnLetter}</span>}
      {isNumberLabelVisible({ rowNumber, columnLetter }) && <span className={styles.rowNumber}>{rowNumber}</span>}
    </div>
  );
};
