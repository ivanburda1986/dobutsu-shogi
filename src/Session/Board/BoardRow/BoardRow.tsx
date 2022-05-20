import {FC} from "react";
import {v4 as uuidv4} from "uuid";
import {Field} from "../BoardField/Field";
import styles from "./BoardRow.module.css";


interface BoardRowInterface {
    columnLetters: string[];
    rowNumber: number;
    amIOpponent: boolean;
}

export const BoardRow: FC<BoardRowInterface> = ({rowNumber, columnLetters, amIOpponent}) => {
    return <div className={`${styles.BoardRow}`}>
        {columnLetters.map((letter) =>
            <Field key={uuidv4()}
                   rowNumber={rowNumber}
                   columnLetter={letter}
                   amIOpponent={amIOpponent}/>)}
    </div>;
};
