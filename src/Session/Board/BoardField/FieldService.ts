import {getSingleStoneDetails} from "../../../api/firestore";
import {canStoneMoveThisWay} from "../Stones/StoneService";

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
            return cb(directionAllowed);
        }
    );

    // -did I move to an allowed distance for the stone? If OK, continue
    // -is the target field on the board? If yes, continue
    // -is the target field free or is there an opponent's stone? If yes, continue
    // --if it is free: place the stone
    // --if there is an opponents stone and it is not the Lion
    // ---the opponent's stone should turn into my own stone
    // ---the opponent's stone should land in my stash; if there is already a stone of this type, lay over it and increase the count
};