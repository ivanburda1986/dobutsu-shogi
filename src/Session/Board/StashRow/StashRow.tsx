import {FC} from "react";
import {v4 as uuidv4} from "uuid";
import styles from "./StashRow.module.css";
import {StashField} from "../StashField/StashField";

interface StashRowInterface {
    columnLetters: string[];
    rowNumber: number;
    amIOpponent: boolean;
}

export const StashRow: FC<StashRowInterface> = ({rowNumber, columnLetters, amIOpponent}) => {
    return <div className={`${styles.StashRow}`}>
        {columnLetters.map((letter) =>
            <StashField key={uuidv4()}
                        rowNumber={rowNumber}
                        columnLetter={letter}
                        amIOpponent={amIOpponent}/>
        )}</div>;
};
