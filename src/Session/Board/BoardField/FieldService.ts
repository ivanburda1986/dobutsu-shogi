import {getSingleStoneDetails} from "../../../api/firestore";
import {canStoneMoveThisWay, shouldChickenTurnIntoHen} from "../Stones/StoneService";

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
    cb: Function;
}

export const evaluateStoneMove = ({
                                      gameId,
                                      placedStoneId,
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
            console.log('Lifted stone details:');
            console.log(received?.data());
            let directionAllowed = (canStoneMoveThisWay({
                stoneType: stoneData!.type,
                movedFromLetter,
                movedFromNumber,
                movingToLetter,
                movingToNumber,
                amIOpponent: amIOpponent,
                stashed: stoneData!.stashed
            }));
            let turnChickenToHen = shouldChickenTurnIntoHen({
                amIOpponent: amIOpponent,
                stashed: stoneData!.stashed,
                type: stoneData!.type,
                movingToLetter: movingToLetter,
                movingToNumber: movingToNumber
            });
            return cb(directionAllowed, turnChickenToHen);
        }
    );
};