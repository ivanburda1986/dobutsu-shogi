import React, {FC} from "react";
import {useParams} from "react-router";
import styles from "./StashField.module.css";

interface FieldInterface {
    rowNumber: number;
    columnLetter: string;
    amIOpponent: boolean;
}

export const StashField: FC<FieldInterface> = ({rowNumber, columnLetter, amIOpponent}) => {

    return (
        <div
            style={{transform: `rotate(${amIOpponent === true ? 180 : 0}deg)`}}
            data-number={rowNumber}
            data-letter={columnLetter}
            className={`${styles.Field} noselect`}
        />
    );
};
