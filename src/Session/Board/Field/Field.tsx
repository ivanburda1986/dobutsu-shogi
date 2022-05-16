import React, {FC} from "react";
import {useParams} from "react-router";
import {getSingleStoneDetails, useUpdateStonePosition} from "../../../api/firestore";
import {isLetterLabelVisible, isNumberLabelVisible} from "./FieldService";
import styles from "./Field.module.css";
import {canStoneMoveThisWay} from "../Stones/StoneService";

interface FieldInterface {
    rowNumber: number;
    columnLetter: string;
    amIOpponent: boolean;
}

interface EvaluateStoneMoveInterface {
    placedStoneId: string;
    gameId: string;
    movedFromLetter: string;
    movedFromNumber: number;
    movingToLetter: string;
    movingToNumber: number;
    amIOpponent: boolean;
    cb: Function;
}

export const evaluateStoneMove = ({
                                      placedStoneId,
                                      gameId,
                                      movedFromLetter,
                                      movedFromNumber,
                                      movingToLetter,
                                      movingToNumber,
                                      amIOpponent,
                                      cb
                                  }: EvaluateStoneMoveInterface): void => {
    const stone = getSingleStoneDetails({gameId, stoneId: placedStoneId});

    stone.then((received) => {
            let stoneData = received?.data();
            console.log(received?.data());
            let directionAllowed = (canStoneMoveThisWay({
                stoneType: stoneData!.type,
                movedFromLetter,
                movedFromNumber,
                movingToLetter,
                movingToNumber,
                isRotated: true,
                amIOpponent: amIOpponent
            }));
            console.log("directionAllowed", directionAllowed);
            return cb(directionAllowed);
        }
    );

    // -did I move in the direction allowed for the stone? If OK, continue
    //What is the current position of the stone?
    //Where can the stone move to?
    //Where I am moving the stone to?


    // -did I move to an allowed distance for the stone? If OK, continue
    // -is the target field on the board? If yes, continue
    // -is the target field free or is there an opponent's stone? If yes, continue
    // --if it is free: place the stone
    // --if there is an opponents stone and it is not the Lion
    // ---the opponent's stone should turn into my own stone
    // ---the opponent's stone should land in my stash; if there is already a stone of this type, lay over it and increase the count
};

export const Field: FC<FieldInterface> = ({rowNumber, columnLetter, amIOpponent}) => {
    const updateStonePosition = useUpdateStonePosition;

    const {gameId} = useParams();

    // Just an info function for dev purposes - remove afterwards
    const getStoneTargetCoordinates = ({
                                           positionLetter,
                                           positionNumber
                                       }: { positionLetter: string; positionNumber: number }): void => {
        let targetPosition = document.querySelector(`[data-letter="${positionLetter}"][data-number="${positionNumber}"]`);
        let rect = targetPosition?.getBoundingClientRect();
        console.log(rect);
    };


    const enableDropping = (event: React.DragEvent<HTMLDivElement>) => {

        event.preventDefault();
    };

    const onDropHandler = (event: React.DragEvent<HTMLDivElement>) => {
        let placedStoneId = event.dataTransfer!.getData("placedStoneId");
        let movedFromLetter = event.dataTransfer!.getData("movedFromLetter");
        let movedFromNumber = event.dataTransfer!.getData("movedFromNumber");
        // console.log("placed stone id", placedStoneId);
        // console.log("movedFromLetter", movedFromLetter);
        // console.log("movedFromNumber", movedFromNumber);

        const callbackFc = (stoneMoveEvaluation: boolean) => {
            if (stoneMoveEvaluation!) {
                updateStonePosition({
                    gameId: gameId!,
                    stoneId: placedStoneId,
                    positionLetter: columnLetter,
                    positionNumber: rowNumber
                });
                console.log("stoneMoveEvaluation", stoneMoveEvaluation);
            } else {
                console.log('You cannot move this way');
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
            onClick={() => getStoneTargetCoordinates({positionLetter: columnLetter, positionNumber: rowNumber})}
        >
            {isLetterLabelVisible({rowNumber, columnLetter}) &&
                <span className={styles.columnLetter}>{columnLetter}</span>}
            {isNumberLabelVisible({rowNumber, columnLetter}) && <span className={styles.rowNumber}>{rowNumber}</span>}
        </div>
    );
};
