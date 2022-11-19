import {FC} from "react";
import {v4 as uuidv4} from "uuid";
import {Field} from "../BoardField/Field";
import {DocumentData} from "firebase/firestore";
import {StoneInterface} from "../Stones/Stone";
import styles from "./BoardRow.module.css";


interface BoardRowInterface {
    columnLetters: string[];
    rowNumber: number;
    amIOpponent: boolean;
    gameData: DocumentData | undefined;
    stones: StoneInterface[];
}

export const BoardRow: FC<BoardRowInterface> = ({rowNumber, columnLetters, amIOpponent, gameData, stones}) => {
    return <div className={`${styles.BoardRow}`}>
        {columnLetters.map((letter) =>
            <Field key={uuidv4()}
                   rowNumber={rowNumber}
                   columnLetter={letter}
                   amIOpponent={amIOpponent}
                   gameData={gameData}
                   stones={stones}
            />)}
    </div>;
};
