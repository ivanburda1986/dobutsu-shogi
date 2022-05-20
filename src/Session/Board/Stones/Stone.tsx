import React, {FC, useContext, useEffect, useState} from "react";
import styles from "./Stone.module.css";

import {useUpdateStonePosition, useUpdateStoneType} from "../../../api/firestore";
import {
    amIStoneOwner,
    canStoneMoveThisWay,
    getImgReference,
    rotateOponentStones,
    useSetStonePosition
} from "./StoneService";
import {ProvidedContextInterface} from "../../../App";
import {AppContext} from "../../../context/AppContext";
import {useParams} from "react-router";

export type stoneType = "CHICKEN" | "ELEPHANT" | "GIRAFFE" | "LION" | "HEN";

//STONES
export interface StoneInterface {
    id: string;
    type: stoneType;
    empowered: boolean;
    originalOwner: string;
    currentOwner: string;
    stashed: boolean;
    positionLetter: string;
    positionNumber: number;
    amIOpponent?: boolean;
    rowNumbers?: number[];
    columnLetters?: string[];
    draggedStone?: StoneInterface;
    lyingStone?: StoneInterface;
    setDraggedStone?: Function;
    setLyingStone?: Function;
    canTakeStone?: boolean;
    setCanTakeStone?: Function;
}

export const Stone: FC<StoneInterface> = ({
                                              amIOpponent,
                                              id,
                                              type,
                                              empowered,
                                              originalOwner,
                                              currentOwner,
                                              stashed,
                                              positionLetter,
                                              positionNumber,
                                              rowNumbers,
                                              columnLetters,
                                              draggedStone,
                                              lyingStone,
                                              setDraggedStone,
                                              setLyingStone,
                                              canTakeStone,
                                              setCanTakeStone
                                          }) => {
    const appContext: ProvidedContextInterface = useContext(AppContext);
    const {gameId} = useParams();
    const [rotateDegrees, setRotateDegrees] = useState<number>(0);
    const [positionX, setPositionX] = useState<number>(0);
    const [positionY, setPositionY] = useState<number>(0);
    const setStonePosition = useSetStonePosition;
    const updateStonePosition = useUpdateStonePosition;
    const updateStoneType = useUpdateStoneType;

    useEffect(() => {
        setStonePosition({
            stoneId: id,
            targetPositionLetter: positionLetter,
            targetPositionNumber: positionNumber,
            positionX,
            positionY,
            setPositionX,
            setPositionY
        });
        rotateOponentStones({
            currentOwner: currentOwner,
            loggedInUserUserId: appContext.loggedInUserUserId,
            setRotateDegrees
        });
    }, [id, positionLetter, positionNumber, positionX, positionY, amIOpponent, rowNumbers, columnLetters]);

    const onDragStartHandler = (event: React.DragEvent<HTMLDivElement>) => {
        event.dataTransfer.setData("placedStoneId", id);
        event.dataTransfer.setData("movedFromLetter", positionLetter);
        event.dataTransfer.setData("movedFromNumber", String(positionNumber));
        // console.log("Dragged stone ID: ", id);
        // console.log("Dragged stone coordinates: ", positionLetter, "-", positionNumber);
        setDraggedStone && setDraggedStone({
            amIOpponent,
            id,
            type,
            empowered,
            originalOwner,
            currentOwner,
            stashed,
            positionLetter,
            positionNumber,
            rowNumbers,
            columnLetters,
        });
    };

    const onDragEnterHandler = () => {
        // console.log("Dragged stone ID: ", id);
        // console.log("Lying stone coordinates: ", positionLetter, "-", positionNumber);
        setLyingStone && setLyingStone({
            amIOpponent,
            id,
            type,
            empowered,
            originalOwner,
            currentOwner,
            stashed,
            positionLetter,
            positionNumber,
            rowNumbers,
            columnLetters,
        });
    };

    const onStoneTakeOverAttemptHandler = (event: React.DragEvent<HTMLDivElement>) => {
        //Make sure details of a lying stone and dragged stone are available
        if (!lyingStone || !draggedStone || !setCanTakeStone) {
            return;
        }

        //Do not do anything if the stone I am dragging is still above itself
        if (lyingStone.id === draggedStone.id) {
            console.log('Ignoring dragging above the stone which is being moved');
            setCanTakeStone(false);
            return;
        }

        // Is the lying stone an opponents stone?
        //no do not allow dropping
        //yes: continue
        if (lyingStone.currentOwner === draggedStone.currentOwner) {
            console.log('You cannot take your own stone');
            setCanTakeStone(false);
            return;
        }

        // Can the dragged stone move to the coordinates of the lying stone?
        if (!canStoneMoveThisWay({
            stoneType: draggedStone.type,
            movedFromLetter: draggedStone.positionLetter,
            movedFromNumber: draggedStone.positionNumber,
            movingToLetter: lyingStone.positionLetter,
            movingToNumber: lyingStone.positionNumber,
            amIOpponent: !!draggedStone.amIOpponent,
        })) {
            console.log('Your stone cannot move to this position');
            setCanTakeStone(false);
            return;
        }
        console.log('Your stone can take this stone.');
        setCanTakeStone(true);
        return;
        event.preventDefault();
    };

    const onStoneDropHandler = (event: React.DragEvent<HTMLDivElement>) => {
        if (!lyingStone || !draggedStone || !canTakeStone) {
            return;
        }
        if (canTakeStone) {
            updateStonePosition({
                gameId: gameId!,
                stoneId: lyingStone.id,
                positionLetter: 'M',
                positionNumber: 1
            });
            updateStonePosition({
                gameId: gameId!,
                stoneId: draggedStone.id,
                positionLetter: lyingStone.positionLetter,
                positionNumber: lyingStone.positionNumber
            });
        }
        console.log('Cannot drop');
        return;
    };


    return (
        <div
            id={id}
            draggable={amIStoneOwner({currentOwner: currentOwner, loggedInUserUserId: appContext.loggedInUserUserId})}
            onDragStart={onDragStartHandler}
            onDragEnter={onDragEnterHandler}
            onDragOver={onStoneTakeOverAttemptHandler}
            onDragEnd={onStoneDropHandler}
            style={{backgroundImage: `url(${getImgReference(type)})`, transform: `rotate(${rotateDegrees}deg)`}}
            className={`${styles.Stone} noselect`}
            onClick={() => setStonePosition({
                stoneId: id,
                targetPositionLetter: positionLetter,
                targetPositionNumber: positionNumber,
                positionX,
                positionY,
                setPositionX,
                setPositionY
            })}
        >
            {currentOwner.substr(0, 2)}
        </div>
    );
};
