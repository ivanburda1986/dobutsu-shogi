import { FC } from "react";
import { v4 as uuidv4 } from "uuid";
import { Row } from "react-bootstrap";
import { Field } from "../Field/Field";
import styles from "./BoardRow.module.css";
import { StashField } from "../StashField/StashField";

export type fieldType = "BOARDFIELD" | "STASHFIELD";
interface BoardRowInterface {
  columnLetters: string[];
  rowNumber: number;
  amIOpponent: boolean;
  fieldType: fieldType;
}

export const BoardRow: FC<BoardRowInterface> = ({ rowNumber, columnLetters, amIOpponent, fieldType }) => {
  const renderThisTypeOfField = ({ fieldType, letter }: { fieldType: fieldType; letter: string }) => {
    if (fieldType === "BOARDFIELD") {
      return <Field key={uuidv4()} rowNumber={rowNumber} columnLetter={letter} amIOpponent={amIOpponent} />;
    }
    return <StashField key={uuidv4()} rowNumber={rowNumber} columnLetter={letter} amIOpponent={amIOpponent} />;
  };
  return <div className={`${styles.BoardRow}`}>{columnLetters.map((letter) => renderThisTypeOfField({ fieldType, letter }))}</div>;
};
