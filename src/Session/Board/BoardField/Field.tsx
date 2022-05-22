import React, {FC} from "react";
import {useParams} from "react-router";
import {useUpdateStonePosition, useEmpowerStone} from "../../../api/firestore";
import {evaluateStoneMove, isLetterLabelVisible, isNumberLabelVisible} from "./FieldService";
import styles from "./Field.module.css";


interface FieldInterface {
    rowNumber: number;
    columnLetter: string;
    amIOpponent: boolean;
}

export const Field: FC<FieldInterface> = ({rowNumber, columnLetter, amIOpponent}) => {
    const {gameId} = useParams();
    const updateStonePosition = useUpdateStonePosition;
    const empowerStone = useEmpowerStone;

    const enableDropping = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const onDropHandler = (event: React.DragEvent<HTMLDivElement>) => {
        let placedStoneId = event.dataTransfer!.getData("placedStoneId");
        let movedFromLetter = event.dataTransfer!.getData("movedFromLetter");
        let movedFromNumber = event.dataTransfer!.getData("movedFromNumber");

        const callbackFc = (stoneMoveAllowed: boolean, shouldChickenTransformToHen: boolean) => {
            console.log('shouldChickenTransformToHen', shouldChickenTransformToHen);
            if (shouldChickenTransformToHen) {
                console.log('empowering!');
                empowerStone({gameId: gameId!, stoneId: placedStoneId, type: "HEN"});
            }
            if (stoneMoveAllowed!) {
                updateStonePosition({
                    gameId: gameId!,
                    stoneId: placedStoneId,
                    positionLetter: columnLetter,
                    positionNumber: rowNumber,
                });
                console.log('The stone can move here');
            } else {
                console.log('The stone cannot move here');
            }
        };

        evaluateStoneMove({
            placedStoneId: placedStoneId,
            gameId: gameId!,
            movedFromLetter,
            movedFromNumber: parseInt(movedFromNumber),
            movingToLetter: columnLetter,
            movingToNumber: rowNumber,
            amIOpponent: amIOpponent,
            cb: callbackFc
        });

    };


    return (
        <div
            onDragOver={enableDropping}
            onDrop={onDropHandler}
            style={{transform: `rotate(${amIOpponent === true ? 180 : 0}deg)`}}
            data-number={rowNumber}
            data-letter={columnLetter}
            className={`${styles.Field} noselect`}
        >
            {isLetterLabelVisible({rowNumber, columnLetter}) &&
                <span className={styles.columnLetter}>{columnLetter}</span>}
            {isNumberLabelVisible({rowNumber, columnLetter}) && <span className={styles.rowNumber}>{rowNumber}</span>}
        </div>
    );
};