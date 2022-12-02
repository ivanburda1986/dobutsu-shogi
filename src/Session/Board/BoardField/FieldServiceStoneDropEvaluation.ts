import {StoneInterface, stoneType} from "../Stones/Stone";
import {
    getSingleStoneDetails,
    updateStonePosition,
} from "../../../api/firestore";
import {
    canDraggedStoneMoveToThisPosition,
    highlightStonesThatDefendedAttackedBase,


} from "../Stones/StoneService";
import {
    lionConquerAttemptEvaluation,
    LionConquerAttemptEvaluationOutputInterface,
} from "../Stones/LionStoneService";
import {DocumentData} from "firebase/firestore";
import {trackStoneMove} from "./FieldServiceMoveTracking";
import {
    increaseUserLossStats,
    increaseUserWinStats,
    setGameToComplete,
    switchMoveToOtherPlayer,
} from "../../SessionService";
import {shouldChickenTurnIntoHen, transformChickenToHen} from "../Stones/ChickenStoneService";

function isFieldEmpty(
    movingToLetter: string,
    movingToNumber: number,
    stones: StoneInterface[]
): boolean {
    const stonesOccupyingField = stones.filter((stone) => {
        return (
            `${stone.positionColumnLetter}${stone.positionRowNumber}` ===
            `${movingToLetter}${movingToNumber}`
        );
    });

    return stonesOccupyingField.length <= 0;
}

interface EvaluateDroppedStoneMoveInterface {
    amIOpponent: boolean;
    cb: Function;
    columnLetter: string;
    gameData: DocumentData | undefined;
    gameId: string;
    loggedInUserUserId: string;
    movedFromColumnLetter: string;
    movedFromRowNumber: number;
    movingToLetter: string;
    movingToNumber: number;
    placedStoneId: string;
    placedStoneType: stoneType;
    rowNumber: number;
    stones: StoneInterface[];
}

export const evaluateDroppedStoneMove = ({
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
                                             stones,
                                         }: EvaluateDroppedStoneMoveInterface): void => {
    const stone = getSingleStoneDetails({gameId, stoneId: placedStoneId});
    stone.then((received) => {
        let stoneData = received?.data() as StoneInterface;
        if (!stoneData) {
            return;
        }

        let isMoveToThisFieldAllowed =
            isFieldEmpty(movingToLetter, movingToNumber, stones) &&
            canDraggedStoneMoveToThisPosition({
                amIOpponent: amIOpponent,
                movedFromColumnLetter,
                movedFromRowNumber,
                movingToLetter,
                movingToNumber,
                stashed: stoneData!.stashed,
                stoneType: stoneData!.type,
            });

        let shouldChickenOnThisFieldTurnToHen = shouldChickenTurnIntoHen({
            amIOpponent: amIOpponent,
            stashed: stoneData!.stashed,
            type: stoneData!.type,
            movingToLetter: movingToLetter,
            movingToNumber: movingToNumber,
        });

        let lionConquerAttemptResult = lionConquerAttemptEvaluation({
            stoneData,
            amIOpponent,
            movingToLetter,
            movingToNumber,
            stones,
        });

        return cb({
            gameData,
            loggedInUserUserId,
            movedFromColumnLetter,
            movedFromRowNumber,
            placedStoneType,
            placedStoneId,
            columnLetter,
            rowNumber,
            stoneMoveAllowed: isMoveToThisFieldAllowed,
            shouldChickenTransformToHen: shouldChickenOnThisFieldTurnToHen,
            lionConquerAttemptResult,
        });
    });
};

interface OnStoneDropCallBackInterface {
    columnLetter: string;
    gameData: DocumentData;
    lionConquerAttemptResult: LionConquerAttemptEvaluationOutputInterface;
    loggedInUserUserId: string;
    movedFromColumnLetter: string;
    movedFromRowNumber: number;
    placedStoneType: stoneType;
    placedStoneId: string;
    rowNumber: number;
    shouldChickenTransformToHen: boolean;
    stoneMoveAllowed: boolean;
}

export const onStoneDropCallback = ({
                                        columnLetter,
                                        gameData,
                                        lionConquerAttemptResult,
                                        loggedInUserUserId,
                                        movedFromColumnLetter,
                                        movedFromRowNumber,
                                        placedStoneId,
                                        placedStoneType,
                                        rowNumber,
                                        shouldChickenTransformToHen,
                                        stoneMoveAllowed,
                                    }: OnStoneDropCallBackInterface) => {
    if (stoneMoveAllowed) {
        updateStonePosition({
            gameId: gameData.gameId,
            stoneId: placedStoneId,
            targetPositionColumnLetter: columnLetter,
            targetPositionRowNumber: rowNumber,
        });
        trackStoneMove(
            gameData,
            placedStoneId,
            placedStoneType,
            loggedInUserUserId,
            movedFromColumnLetter,
            movedFromRowNumber,
            columnLetter,
            rowNumber
        );

        if (shouldChickenTransformToHen) {
            transformChickenToHen(gameData, placedStoneId);
        }

        const {conqueringPlayerId, conqueredPlayerId} = lionConquerAttemptResult;
        if (lionConquerAttemptResult.success === true) {
            setGameToComplete(
                gameData.gameId,
                conqueringPlayerId,
                "HOMEBASE_CONQUERED_SUCCESS",
                conqueredPlayerId
            );
            increaseUserLossStats(conqueredPlayerId);
            increaseUserWinStats(conqueringPlayerId);
        }

        if (lionConquerAttemptResult.success === false) {
            setGameToComplete(
                gameData.gameId,
                conqueredPlayerId,
                "HOMEBASE_CONQUERED_FAILURE",
                conqueredPlayerId
            );
            highlightStonesThatDefendedAttackedBase(
                lionConquerAttemptResult,
                gameData
            );
            increaseUserLossStats(conqueringPlayerId);
            increaseUserWinStats(conqueredPlayerId);
        }

        switchMoveToOtherPlayer(gameData, loggedInUserUserId);
    } else {
        console.log("The stone cannot move here");
    }
};
