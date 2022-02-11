import { FC } from "react";
import { v4 as uuidv4 } from "uuid";
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
        <Field key={uuidv4()} rowNumber={rowNumber} columnLetter={letter} />
      ))}
    </div>
  );
};
