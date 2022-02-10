import { FC } from "react";
import { Row } from "react-bootstrap";
import { Field } from "../Field/Field";
import styles from "./BoardRow.module.css";

interface BoardRowInterface {
  columnLetters: string[];
  rowNumber: number;
}

export const BoardRow: FC<BoardRowInterface> = ({ rowNumber, columnLetters }) => {
  return (
    <div className={`${styles.BoardRow}`}>
      {columnLetters.map((letter) => (
        <Field rowNumber={rowNumber} columnLetter={letter} />
      ))}
    </div>
  );
};
