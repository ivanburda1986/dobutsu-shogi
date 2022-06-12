import React, {FC, useContext, useEffect, useState} from "react";
import styles from "./Stone.module.css";

import {
    useUpdateStoneOnTakeOver,
    useUpdateStonePosition,
    useEmpowerStone,
    useHandicapStone, useUpdateGame, useUpdateUserStats, getSingleUserStats, getSingleGameDetails, useHighlightStone
} from "../../../api/firestore";
import {
    amIStoneOwner,
    canStoneMoveThisWay,
    getImgReference,
    getStashedStonePillCount,
    getStashTargetPosition,
    isItMyTurn,
    lionConquerAttemptEvaluation,
    nextTurnPlayerId,
    rotateOponentStones,
    shouldChickenTurnIntoHen,
    useSetStonePosition
} from "./StoneService";
import {ProvidedContextInterface} from "../../../App";
import {AppContext} from "../../../context/AppContext";
import {useParams} from "react-router";
import {DocumentData} from "firebase/firestore";
import {StoneStashCount} from "./StoneStashCount/StoneStashCount";

export type stoneType = "CHICKEN" | "ELEPHANT" | "GIRAFFE" | "LION" | "HEN";

//STONES
export interface StoneInterface {
    id: string;
    type: stoneType;
    originalOwner: string;
    currentOwner: string;
    highlighted: boolean;
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
    gameData?: DocumentData | undefined;
    allStones?: StoneInterface[];
}

export const Stone: FC<StoneInterface> = ({
                                              amIOpponent,
                                              id,
                                              type,
                                              originalOwner,
                                              currentOwner,
                                              highlighted,
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
                                              setCanTakeStone,
                                              gameData,
                                              allStones,
                                          }) => {
    const appContext: ProvidedContextInterface = useContext(AppContext);
    const {gameId} = useParams();
    const [rotateDegrees, setRotateDegrees] = useState<number>(0);
    const [positionX, setPositionX] = useState<number>(0);
    const [positionY, setPositionY] = useState<number>(0);
    const [hideStoneStashCount, setHideStoneStashCount] = useState<boolean>(false);
    const [screenWidth, setScreenWidth] = useState<number>();
    const [screenHeight, setScreenHeight] = useState<number>();
    const [isHighlighted, setIsHighlighted] = useState<boolean>(false);

    const setStonePosition = useSetStonePosition;
    const updateStonePosition = useUpdateStonePosition;
    const updateStoneOnTakeOver = useUpdateStoneOnTakeOver;
    const highlightStone = useHighlightStone;
    const updateStoneType = useEmpowerStone;
    const stashedPillCount = getStashedStonePillCount({
        allStones: allStones ?? [],
        currentOwnerId: currentOwner,
        stashed: stashed,
        type: type,
    });

    //Change stone endangering status
    useEffect(() => {
        let stone: StoneInterface[] | undefined = [];
        stone = allStones?.filter((stone) => stone.id === id);
        if (stone && stone[0] && stone[0].highlighted) {
            setIsHighlighted(true);
        }
    }, [allStones, id]);

    // Make sure stones are in place even after change of the UI size and appearance of new elements
    const onResizeHandler = ({newHeight, newWidth}: { newHeight: number, newWidth: number }) => {
        setScreenHeight(newHeight);
        setScreenWidth(newWidth);
    };
    window.addEventListener('resize', () => onResizeHandler({
        newHeight: window.innerHeight,
        newWidth: window.innerWidth
    }));

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

    }, [screenHeight, screenWidth]);

    //Position and rotate stones after game starts
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
        setDraggedStone && setDraggedStone({
            amIOpponent,
            id,
            type,
            originalOwner,
            currentOwner,
            stashed,
            positionLetter,
            positionNumber,
            rowNumbers,
            columnLetters,
        });
        setHideStoneStashCount(true);
    };

    const onDragStartHandlerDisallowed = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        // console.log('it is not your turn');
    };

    const onDragEnterHandler = () => {
        setLyingStone && setLyingStone({
            amIOpponent,
            id,
            type,
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
            // console.log('Ignoring dragging above the stone which is being moved');
            setCanTakeStone(false);
            return;
        }

        // Prevent takeover if the stone I am dragging is going from the stash
        if (draggedStone.stashed) {
            // console.log('A stone you are dragging from the stash cannot be place on top of another stone');
            return;
        }

        // Is the lying stone an opponents stone?
        //no do not allow dropping
        //yes: continue
        if (lyingStone.currentOwner === draggedStone.currentOwner) {
            // console.log('You cannot take your own stone');
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
            stashed: draggedStone.stashed
        })) {
            // console.log('Your stone cannot move to this position');
            setCanTakeStone(false);
            return;
        }
        // console.log('Your stone can take this stone.');
        setCanTakeStone(true);
        return;
        event.preventDefault();
    };

    const onStoneDropHandler = (event: React.DragEvent<HTMLDivElement>) => {
        const empowerStone = useEmpowerStone;
        const handicapStone = useHandicapStone;
        const updateGame = useUpdateGame;
        const updateStats = useUpdateUserStats;

        setHideStoneStashCount(false);
        if (!lyingStone || !draggedStone || !canTakeStone) {
            return;
        }

        // Set turn to the other player
        updateGame({
            id: gameId!,
            updatedDetails: {
                currentPlayerTurn: nextTurnPlayerId({
                    myId: appContext.loggedInUserUserId,
                    gameData: gameData
                })
            }
        });

        if (canTakeStone) {
            //Victory handling for taking a LION
            if (lyingStone.type === "LION") {
                updateGame({
                    id: gameId!,
                    updatedDetails: {
                        status: "COMPLETED",
                        winner: draggedStone.currentOwner,
                        victoryType: "LION_CAUGHT_SUCCESS",
                        finishedTimeStamp: Date.now(),
                        currentPlayerTurn: lyingStone.currentOwner
                    }
                });
                //Update dragged stone
                updateStonePosition({
                    gameId: gameId!,
                    stoneId: draggedStone.id,
                    positionLetter: lyingStone.positionLetter,
                    positionNumber: lyingStone.positionNumber,
                });
                updateStonePosition({
                    gameId: gameId!,
                    stoneId: lyingStone.id,
                    positionLetter: lyingStone.positionLetter,
                    positionNumber: lyingStone.positionNumber,
                });
                //Highlight the taking stone to make it clear it has taken the opponents lion
                highlightStone({gameId: gameId!, stoneId: id, highlighted: true});

                getSingleUserStats({userId: lyingStone.originalOwner}).then((serverStats) => updateStats({
                    userId: lyingStone.originalOwner,
                    updatedDetails: {loss: serverStats.data()?.loss + 1}
                }));
                getSingleUserStats({userId: draggedStone.currentOwner}).then((serverStats) => updateStats({
                    userId: draggedStone.currentOwner,
                    updatedDetails: {win: serverStats.data()?.win + 1}
                }));
                return;
            }


            //Evaluate whether a lion-move is a homebase-conquer attempt and leads to a game end
            const lionConquerAttempt = lionConquerAttemptEvaluation({
                stoneData: draggedStone,
                amIOpponent: amIOpponent!,
                movingToLetter: lyingStone.positionLetter,
                movingToNumber: lyingStone.positionNumber,
                stones: allStones!
            });
            if (lionConquerAttempt.success !== undefined) {
                const {success, conqueringPlayerId, conqueredPlayerId} = lionConquerAttempt;
                console.log('success', success);
                console.log('conqueringPlayerId', conqueringPlayerId);
                console.log('conqueredPlayerId', conqueredPlayerId);
                if (success === true) {
                    updateGame({
                        id: gameId!,
                        updatedDetails: {
                            status: "COMPLETED",
                            winner: conqueringPlayerId,
                            victoryType: "HOMEBASE_CONQUERED_SUCCESS"
                        }
                    });
                } else {
                    lionConquerAttempt.endangeringOpponentStones.forEach((id) => {
                        highlightStone({gameId: gameId!, stoneId: id, highlighted: true});
                    });
                    updateGame({
                        id: gameId!,
                        updatedDetails: {
                            status: "COMPLETED",
                            winner: conqueredPlayerId,
                            victoryType: "HOMEBASE_CONQUERED_FAILURE"
                        }
                    });
                }

                // console.log('The stone can move here');
                console.log('lionConquerAttemptSuccessful', lionConquerAttempt.success);
            }


            //Special handling to handicap a HEN getting stashed
            if (lyingStone.type === "HEN") {
                // console.log('dis-empowering!');
                handicapStone({gameId: gameId!, stoneId: lyingStone.id, type: "CHICKEN"});
            }

            //Update taken stone
            updateStoneOnTakeOver({
                gameId: gameId!,
                stone: {
                    id: lyingStone.id,
                    currentOwner: draggedStone.currentOwner,
                    stashed: true,
                    positionLetter: getStashTargetPosition({
                        type: lyingStone.type,
                        amIOpponent: amIOpponent!
                    }),
                    positionNumber: 1
                }
            });

            //Special handling to empower a CHICKEN when it should become a HEN
            if (draggedStone.type === "CHICKEN") {
                // this turnChickenToHen could be ensapsulated in shouldChickenTurnIntoHen() which would also trigger the empowerStone()
                let turnChickenToHen = shouldChickenTurnIntoHen({
                    amIOpponent: amIOpponent!,
                    type: draggedStone!.type,
                    stashed: draggedStone!.stashed,
                    movingToLetter: lyingStone.positionLetter,
                    movingToNumber: lyingStone.positionNumber
                });
                // console.log('turnChickenToHen', turnChickenToHen);
                if (turnChickenToHen) {
                    // console.log('empowering!');
                    empowerStone({gameId: gameId!, stoneId: draggedStone.id, type: "HEN"});
                }
            }

            //Update dragged stone
            updateStonePosition({
                gameId: gameId!,
                stoneId: draggedStone.id,
                positionLetter: lyingStone.positionLetter,
                positionNumber: lyingStone.positionNumber,
            });
        }
        // console.log('Cannot drop');
        return;
    };


    return (
        <div
            id={id}
            draggable={gameData?.status === "INPROGRESS" && amIStoneOwner({
                currentOwner: currentOwner,
                loggedInUserUserId: appContext.loggedInUserUserId
            })}
            onDragStart={isItMyTurn({
                myId: appContext.loggedInUserUserId,
                currentTurnPlayerId: gameData?.currentPlayerTurn
            }) ? onDragStartHandler : onDragStartHandlerDisallowed}
            onDragEnter={onDragEnterHandler}
            onDragOver={onStoneTakeOverAttemptHandler}
            onDragEnd={onStoneDropHandler}
            style={{backgroundImage: `url(${getImgReference(type)})`, transform: `rotate(${rotateDegrees}deg)`}}
            className={`${styles.Stone} ${isHighlighted && styles.Highlighted} noselect`}
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
            {/*{currentOwner.substr(0, 2)}*/}
            {stashedPillCount > 1 && !hideStoneStashCount ? <StoneStashCount
                count={stashedPillCount}/> : null
            }

        </div>
    );
};
