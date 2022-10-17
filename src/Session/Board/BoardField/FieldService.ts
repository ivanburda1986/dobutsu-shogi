import {getSingleStoneDetails} from "../../../api/firestore";
import {canStoneMoveThisWay, shouldChickenTurnIntoHen} from "../Stones/StoneService";
import {lionConquerFields, stoneMovements} from "../Stones/StoneMovements";
import {StoneInterface} from "../Stones/Stone";
import {DocumentData} from "firebase/firestore";


const rowNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const columnLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

interface isLabelVisibleInterface {
    rowNumber: number;
    columnLetter: string;
}

export const isLetterLabelVisible = ({rowNumber, columnLetter}: isLabelVisibleInterface) => {
    if (rowNumber === 1 && columnLetters.includes(columnLetter)) {
        return true;
    }
};
export const isNumberLabelVisible = ({rowNumber, columnLetter}: isLabelVisibleInterface) => {
    if (columnLetter === "A" && rowNumbers.includes(rowNumber)) {
        return true;
    }
};

interface EvaluateStoneMoveInterface {
    gameId: string;
    placedStoneId: string;
    movedFromLetter: string;
    movedFromNumber: number;
    movingToLetter: string;
    movingToNumber: number;
    amIOpponent: boolean;
    stones: StoneInterface[];
    gameData: DocumentData | undefined;
    cb: Function;
}

export interface lionConquerAttemptInterface {
    success: boolean | undefined;
    conqueringPlayerId: string | undefined;
    conqueredPlayerId: string | undefined;
    endangeringOpponentStones: string[];
}


export const evaluateStoneMove = ({
                                      gameId,
                                      placedStoneId,
                                      movedFromLetter,
                                      movedFromNumber,
                                      movingToLetter,
                                      movingToNumber,
                                      amIOpponent,
                                      stones,
                                      cb
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
                    return `${stone.positionLetter}${stone.positionNumber}` === targetCoordinate;
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
                movedFromLetter,
                movedFromNumber,
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
                    let nearbyOpponentStones = opponentStones.filter((stone) => lionConquerFields.creator[targetCoordinate].includes(`${stone.positionLetter}${stone.positionNumber}`));
                    // console.log('nearbyOpponentStones', nearbyOpponentStones);
                    let endangeringOpponentStones = nearbyOpponentStones.filter((stone) => {
                        if (stone.type === "CHICKEN" || stone.type === "HEN") {
                            return stoneMovements[stone.type].opponent[`${stone.positionLetter}${stone.positionNumber}`].includes(targetCoordinate);
                        } else {
                            return stoneMovements[stone.type][`${stone.positionLetter}${stone.positionNumber}`].includes(targetCoordinate);
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
                    let nearbyOpponentStones = opponentStones.filter((stone) => lionConquerFields.opponent[targetCoordinate].includes(`${stone.positionLetter}${stone.positionNumber}`));
                    // console.log('nearbyOpponentStones', nearbyOpponentStones);
                    let endangeringOpponentStones = nearbyOpponentStones.filter((stone) => {
                        if (stone.type === "CHICKEN" || stone.type === "HEN") {
                            return stoneMovements[stone.type].creator[`${stone.positionLetter}${stone.positionNumber}`].includes(targetCoordinate);
                        } else {
                            return stoneMovements[stone.type][`${stone.positionLetter}${stone.positionNumber}`].includes(targetCoordinate);
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

            return cb(directionAllowed, turnChickenToHen, lionConquerAttempt);
        }
    );
};