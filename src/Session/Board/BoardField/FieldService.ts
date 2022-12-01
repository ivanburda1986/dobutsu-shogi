import {
    empowerStone,
    getSingleStoneDetails,
    getSingleUserStats, highlightStone, MoveInterface,
    updateGame,
    updateStonePosition, updateUserStats
} from "../../../api/firestore";
import {canStoneMoveThisWay, nextTurnPlayerId, shouldChickenTurnIntoHen} from "../Stones/StoneService";
import {lionConquerFields, stoneMovements} from "../Stones/StoneMovements";
import {StoneInterface, stoneType} from "../Stones/Stone";
import {DocumentData} from "firebase/firestore";
import React from "react";


const rowNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const columnLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

interface isLabelVisibleInterface {
    rowNumber: number;
    columnLetter: string;
}

export const shouldShowLetter = ({rowNumber, columnLetter}: isLabelVisibleInterface) => {
    if (rowNumber === 1 && columnLetters.includes(columnLetter)) {
        return true;
    }
};
export const shouldShowNumber = ({rowNumber, columnLetter}: isLabelVisibleInterface) => {
    if (columnLetter === "A" && rowNumbers.includes(rowNumber)) {
        return true;
    }
};

interface EvaluateStoneMoveInterface {
    amIOpponent: boolean;
    cb: Function;
    columnLetter:string;
    gameData: DocumentData | undefined;
    gameId: string;
    loggedInUserUserId: string;
    movedFromColumnLetter: string;
    movedFromRowNumber: number;
    movingToLetter: string;
    movingToNumber: number;
    placedStoneId: string;
    placedStoneType: stoneType;
    rowNumber:number;
    stones: StoneInterface[];
}

export interface lionConquerAttemptInterface {
    success: boolean | undefined;
    conqueringPlayerId: string | undefined;
    conqueredPlayerId: string | undefined;
    endangeringOpponentStones: string[];
}


export const evaluateStoneMove = ({
                                      amIOpponent,
                                      cb,
                                      gameData,
                                      gameId,
                                      columnLetter,
                                      loggedInUserUserId,
                                      movedFromColumnLetter,
                                      movedFromRowNumber,
                                      movingToLetter,
                                      movingToNumber,
                                      placedStoneId,
                                      placedStoneType,
                                      rowNumber,
                                      stones
                                  }: EvaluateStoneMoveInterface): void => {
    const stone = getSingleStoneDetails({gameId, stoneId: placedStoneId});
    stone.then((received) => {
            let stoneData = received?.data();
            // console.log('Lifted stone details:');
            // console.log(received?.data());

            // Is field empty?
            const isFieldEmpty = () => {
                let fieldEmpty = true;
                const targetCoordinate = `${movingToLetter}${movingToNumber}`;
                const stonesOnField = stones.filter((stone) => {
                    return `${stone.positionColumnLetter}${stone.positionRowNumber}` === targetCoordinate;
                });
                if (stonesOnField.length > 0) {
                    fieldEmpty = false;
                }
                // console.log('stonesOnField', stonesOnField);
                // console.log('fieldEmpty', fieldEmpty);
                return fieldEmpty;
            };

            // -- make sure none of the stones occupy the position of the field yet
            // -- this must be checked because stones are smaller than fields and a player should not be allowed to drop a stone on a field if another stone is there

            // Is direction move allowed?
            let directionAllowed = (canStoneMoveThisWay({
                stoneType: stoneData!.type,
                movedFromColumnLetter,
                movedFromRowNumber,
                movingToLetter,
                movingToNumber,
                amIOpponent: amIOpponent,
                stashed: stoneData!.stashed
            })) && isFieldEmpty();

            // Should chicken turn to hen?
            let turnChickenToHen = false;
            if (stoneData!.type === "CHICKEN") {
                turnChickenToHen = shouldChickenTurnIntoHen({
                    amIOpponent: amIOpponent,
                    stashed: stoneData!.stashed,
                    type: stoneData!.type,
                    movingToLetter: movingToLetter,
                    movingToNumber: movingToNumber
                });
            }

            // Lion conquer attempt evaluation
            let lionConquerAttempt: lionConquerAttemptInterface = {
                success: undefined,
                conqueringPlayerId: undefined,
                conqueredPlayerId: undefined,
                endangeringOpponentStones: []
            };
            if (stoneData!.type === "LION" && !amIOpponent) {
                const targetCoordinate = `${movingToLetter}${movingToNumber}`;
                // console.log('lion target coordinate', targetCoordinate);
                if (targetCoordinate in lionConquerFields.creator) {
                    let opponentStones = stones.filter((stone) => stone.currentOwner !== stoneData!.currentOwner && !stone.stashed);
                    // console.log('opponentStones', opponentStones);
                    // console.log('nearby fields of lion target position', lionConquerFields.creator[targetCoordinate]);
                    let nearbyOpponentStones = opponentStones.filter((stone) => lionConquerFields.creator[targetCoordinate].includes(`${stone.positionColumnLetter}${stone.positionRowNumber}`));
                    // console.log('nearbyOpponentStones', nearbyOpponentStones);
                    let endangeringOpponentStones = nearbyOpponentStones.filter((stone) => {
                        if (stone.type === "CHICKEN" || stone.type === "HEN") {
                            return stoneMovements[stone.type].opponent[`${stone.positionColumnLetter}${stone.positionRowNumber}`].includes(targetCoordinate);
                        } else {
                            return stoneMovements[stone.type][`${stone.positionColumnLetter}${stone.positionRowNumber}`].includes(targetCoordinate);
                        }
                    });
                    // console.log('endangeringOpponentStones', endangeringOpponentStones);
                    lionConquerAttempt = {
                        success: endangeringOpponentStones.length === 0,
                        conqueringPlayerId: stoneData!.currentOwner,
                        conqueredPlayerId: opponentStones[0].currentOwner,
                        endangeringOpponentStones: endangeringOpponentStones.map((stone) => stone.id)
                    };
                }
            } else if (stoneData!.type === "LION" && amIOpponent) {
                const targetCoordinate = `${movingToLetter}${movingToNumber}`;
                // console.log('lion target coordinate', targetCoordinate);
                if (targetCoordinate in lionConquerFields.opponent) {
                    let opponentStones = stones.filter((stone) => stone.currentOwner !== stoneData!.currentOwner && !stone.stashed);
                    // console.log('opponentStones', opponentStones);
                    // console.log('nearby fields of lion target position', lionConquerFields.opponent[targetCoordinate]);
                    let nearbyOpponentStones = opponentStones.filter((stone) => lionConquerFields.opponent[targetCoordinate].includes(`${stone.positionColumnLetter}${stone.positionRowNumber}`));
                    // console.log('nearbyOpponentStones', nearbyOpponentStones);
                    let endangeringOpponentStones = nearbyOpponentStones.filter((stone) => {
                        if (stone.type === "CHICKEN" || stone.type === "HEN") {
                            return stoneMovements[stone.type].creator[`${stone.positionColumnLetter}${stone.positionRowNumber}`].includes(targetCoordinate);
                        } else {
                            return stoneMovements[stone.type][`${stone.positionColumnLetter}${stone.positionRowNumber}`].includes(targetCoordinate);
                        }
                    });
                    // console.log('endangeringOpponentStones', endangeringOpponentStones);
                    lionConquerAttempt = {
                        success: endangeringOpponentStones.length === 0,
                        conqueringPlayerId: stoneData!.currentOwner,
                        conqueredPlayerId: opponentStones[0].currentOwner,
                        endangeringOpponentStones: endangeringOpponentStones.map((stone) => stone.id)
                    };
                }
            }

            return cb({gameData,loggedInUserUserId,movedFromColumnLetter,movedFromRowNumber,placedStoneType,placedStoneId,columnLetter,rowNumber, stoneMoveAllowed: directionAllowed,shouldChickenTransformToHen:turnChickenToHen, lionConquerAttempt});
        }
    );
};

export const enableDropping = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
};

export const rotateField = (amIOpponent: boolean): string => {
    if (amIOpponent) {
        return 'rotate(180deg)';
    }

    return 'rotate(0deg)';
};


export interface OndropCallBackInterface{
    gameData: DocumentData;
    loggedInUserUserId:string;
    movedFromColumnLetter: string;
    movedFromRowNumber: number;
    placedStoneType:stoneType;
    placedStoneId: string;
    columnLetter: string;
    rowNumber: number;
    stoneMoveAllowed: boolean;
    shouldChickenTransformToHen: boolean;
    lionConquerAttempt: lionConquerAttemptInterface
}

export const onDropCallback = ({gameData,loggedInUserUserId,movedFromColumnLetter,movedFromRowNumber,placedStoneType,placedStoneId,columnLetter,rowNumber,stoneMoveAllowed,shouldChickenTransformToHen,lionConquerAttempt}:OndropCallBackInterface) => {
    console.log(shouldChickenTransformToHen);
    console.log(stoneMoveAllowed);
    const updatedMoves:MoveInterface[] = gameData?.moves;

    if (shouldChickenTransformToHen) {
        empowerStone({gameId: gameData.gameId!, stoneId: placedStoneId, type: "HEN"});
    }
    if (stoneMoveAllowed!) {
        // Update stone position
        updateStonePosition({
            gameId: gameData.gameId!,
            stoneId: placedStoneId,
            positionColumnLetter: columnLetter,
            positionRowNumber: rowNumber,
        });
        // Prepare data for stone move tracking
        updatedMoves.push({
            moveNumber: updatedMoves.length > 0 ? updatedMoves[updatedMoves.length - 1].moveNumber + 1 : 0,
            id: placedStoneId,
            type: placedStoneType,
            movingPlayerId: loggedInUserUserId,
            fromCoordinates: `${movedFromColumnLetter}${movedFromRowNumber}`,
            targetCoordinates: `${columnLetter}${rowNumber}`,
            isTakeOver: false,
            isVictory: false
        });
        // Send data for stone move tracking
        updateGame({
            id: gameData.gameId!,
            updatedDetails: {
                moves: updatedMoves
            }
        });

        //Evaluate whether a lion-move is a homebase-conquer attempt and leads to a game end
        if (lionConquerAttempt.success !== undefined) {
            const {success, conqueringPlayerId, conqueredPlayerId} = lionConquerAttempt;
            // console.log('success', success);
            // console.log('conqueringPlayerId', conqueringPlayerId);
            // console.log('conqueredPlayerId', conqueredPlayerId);
            if (success === true) {
                updateGame({
                    id: gameData.gameId!,
                    updatedDetails: {
                        status: "COMPLETED",
                        winner: conqueringPlayerId,
                        victoryType: "HOMEBASE_CONQUERED_SUCCESS"
                    }
                });
                getSingleUserStats({userId: conqueredPlayerId!}).then((serverStats) => updateUserStats({
                    userId: conqueredPlayerId!,
                    updatedDetails: {loss: serverStats.data()?.loss + 1}
                }));
                getSingleUserStats({userId: conqueringPlayerId!}).then((serverStats) => updateUserStats({
                    userId: conqueringPlayerId!,
                    updatedDetails: {win: serverStats.data()?.win + 1}
                }));
            } else {
                lionConquerAttempt.endangeringOpponentStones.forEach((id) => {
                    highlightStone({gameId: gameData.gameId!, stoneId: id, highlighted: true});
                });
                updateGame({
                    id: gameData.gameId!,
                    updatedDetails: {
                        status: "COMPLETED",
                        winner: conqueredPlayerId,
                        victoryType: "HOMEBASE_CONQUERED_FAILURE"
                    }
                });
                getSingleUserStats({userId: conqueringPlayerId!}).then((serverStats) => updateUserStats({
                    userId: conqueringPlayerId!,
                    updatedDetails: {loss: serverStats.data()?.loss + 1}
                }));
                getSingleUserStats({userId: conqueredPlayerId!}).then((serverStats) => updateUserStats({
                    userId: conqueredPlayerId!,
                    updatedDetails: {win: serverStats.data()?.win + 1}
                }));
            }

            // console.log('The stone can move here');
            // console.log('lionConquerAttemptSuccessful', lionConquerAttempt.success);
        }

        // Set turn to the other player
        // console.log(updatedMoves);
        updateGame({
            id: gameData.gameId!,
            updatedDetails: {
                currentPlayerTurn: nextTurnPlayerId({
                    myId: loggedInUserUserId,
                    gameData: gameData
                })
            }
        });

    } else {
        console.log('The stone cannot move here');
    }
};
