import React, {FC} from "react";
import {Col} from "react-bootstrap";
import {useParams} from "react-router";
import {useUpdateStonePosition} from "../../../api/firestore";
import styles from "./StashField.module.css";

interface FieldInterface {
    rowNumber: number;
    columnLetter: string;
    amIOpponent: boolean;
}

export const StashField: FC<FieldInterface> = ({rowNumber, columnLetter, amIOpponent}) => {
    // const updateStonePosition = useUpdateStonePosition;
    const {gameId} = useParams();

    // const enableDropping = (event: React.DragEvent<HTMLDivElement>) => {
    //     console.log("Something is over me");
    //     event.preventDefault();
    // };
    //
    // const onDropHandler = (event: React.DragEvent<HTMLDivElement>) => {
    //     let placedStoneId = event.dataTransfer!.getData("placedStoneId");
    //     console.log(columnLetter);
    //     updateStonePosition({
    //         gameId: gameId!,
    //         stoneId: placedStoneId,
    //         positionLetter: columnLetter,
    //         positionNumber: rowNumber
    //     });
    // };

    return (
        <div
            // onDragOver={enableDropping}
            // onDrop={onDropHandler}
            style={{transform: `rotate(${amIOpponent === true ? 180 : 0}deg)`}}
            data-number={rowNumber}
            data-letter={columnLetter}
            className={`${styles.Field} noselect`}
        />
    );
};
