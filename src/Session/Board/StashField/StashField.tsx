import React, {FC} from "react";
import styles from "./StashField.module.css";
import {getImgReference} from "./StashFieldService";

interface FieldInterface {
    rowNumber: number;
    columnLetter: string;
    amIOpponent: boolean;
}

export const StashField: FC<FieldInterface> = ({rowNumber, columnLetter, amIOpponent}) => {
    return (
        <div style={{
            backgroundImage: `url(${getImgReference(columnLetter)})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            opacity: '0.1'
        }}>
            <div
                data-number={rowNumber}
                data-letter={columnLetter}
                className={`${styles.Field} noselect`}
            />
        </div>
    );
};
