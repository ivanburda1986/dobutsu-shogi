import React from "react";
import { DocumentData } from "firebase/firestore";
import {
  empowerStone,
  getSingleStoneDetails,
  getSingleUserStats,
  highlightStone,
  MoveInterface,
  updateGame,
  updateStonePosition,
  updateUserStats,
} from "../../../api/firestore";
import { StoneInterface, stoneType } from "../Stones/Stone";
import {
  canStoneMoveThisWay,
  nextTurnPlayerId,
  shouldChickenTurnIntoHen,
} from "../Stones/StoneService";
import {
  lionConquerAttemptEvaluation,
  LionConquerAttemptEvaluationOutputInterface,
} from "../Stones/LionStoneService";

interface shouldShowLabelInterface {
  rowNumber: number;
  columnLetter: string;
}

export const shouldShowLetterLabel = ({
  rowNumber,
  columnLetter,
}: shouldShowLabelInterface) => {
  const LABELLED_ROW_NUMBER = 1;
  const COLUMN_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  if (
    rowNumber === LABELLED_ROW_NUMBER &&
    COLUMN_LETTERS.includes(columnLetter)
  ) {
    return true;
  }
};

export const shouldShowNumberLabel = ({
  rowNumber,
  columnLetter,
}: shouldShowLabelInterface) => {
  const LABELLED_COLUMN_LETTER = "A";
  const ROW_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  if (
    columnLetter === LABELLED_COLUMN_LETTER &&
    ROW_NUMBERS.includes(rowNumber)
  ) {
    return true;
  }
};

export const enableDropping = (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();
};

export const rotateField = (amIOpponent: boolean): string => {
  if (amIOpponent) {
    return "rotate(180deg)";
  }

  return "rotate(0deg)";
};

interface EvaluateStoneMoveInterface {
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
}: EvaluateStoneMoveInterface): void => {
  const stone = getSingleStoneDetails({ gameId, stoneId: placedStoneId });
  stone.then((received) => {
    let stoneData = received?.data() as StoneInterface;
    if (!stoneData) {
      return;
    }

    let isMoveToThisFieldAllowed =
      isFieldEmpty(movingToLetter, movingToNumber, stones) &&
      canStoneMoveThisWay({
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

function getMoveNumber(updatedMoves: MoveInterface[]): number {
  return updatedMoves.length > 0
    ? updatedMoves[updatedMoves.length - 1].moveNumber + 1
    : 0;
}

interface getUpdateMovesInterface {
  moves: MoveInterface[];
  placedStoneId: string;
  placedStoneType: "CHICKEN" | "ELEPHANT" | "GIRAFFE" | "LION" | "HEN";
  loggedInUserUserId: string;
  movedFromColumnLetter: string;
  movedFromRowNumber: number;
  columnLetter: string;
  rowNumber: number;
}

function getUpdatedMoves({
  moves,
  placedStoneId,
  placedStoneType,
  loggedInUserUserId,
  movedFromColumnLetter,
  movedFromRowNumber,
  columnLetter,
  rowNumber,
}: getUpdateMovesInterface): MoveInterface[] {
  const movesToReturn = [...moves];
  moves.push({
    moveNumber: getMoveNumber(moves),
    id: placedStoneId,
    type: placedStoneType,
    movingPlayerId: loggedInUserUserId,
    fromCoordinates: `${movedFromColumnLetter}${movedFromRowNumber}`,
    targetCoordinates: `${columnLetter}${rowNumber}`,
    isTakeOver: false,
    isVictory: false,
  });
  return movesToReturn;
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
  if (shouldChickenTransformToHen) {
    empowerStone({
      gameId: gameData.gameId,
      stoneId: placedStoneId,
      type: "HEN",
    });
  }
  if (stoneMoveAllowed) {
    updateStonePosition({
      gameId: gameData.gameId,
      stoneId: placedStoneId,
      positionColumnLetter: columnLetter,
      positionRowNumber: rowNumber,
    });

    const updatedMoves = getUpdatedMoves({
      moves: gameData?.moves,
      placedStoneId,
      placedStoneType,
      loggedInUserUserId,
      movedFromColumnLetter,
      movedFromRowNumber,
      columnLetter,
      rowNumber,
    });

    // Send data for stone move tracking
    updateGame({
      id: gameData.gameId!,
      updatedDetails: {
        moves: updatedMoves,
      },
    });

    //Evaluate whether a lion-move is a homebase-conquer attempt and leads to a game end
    if (lionConquerAttemptResult.success !== undefined) {
      const { success, conqueringPlayerId, conqueredPlayerId } =
        lionConquerAttemptResult;
      // console.log('success', success);
      // console.log('conqueringPlayerId', conqueringPlayerId);
      // console.log('conqueredPlayerId', conqueredPlayerId);
      if (success === true) {
        updateGame({
          id: gameData.gameId!,
          updatedDetails: {
            status: "COMPLETED",
            winner: conqueringPlayerId,
            victoryType: "HOMEBASE_CONQUERED_SUCCESS",
          },
        });
        getSingleUserStats({ userId: conqueredPlayerId! }).then((serverStats) =>
          updateUserStats({
            userId: conqueredPlayerId!,
            updatedDetails: { loss: serverStats.data()?.loss + 1 },
          })
        );
        getSingleUserStats({ userId: conqueringPlayerId! }).then(
          (serverStats) =>
            updateUserStats({
              userId: conqueringPlayerId!,
              updatedDetails: { win: serverStats.data()?.win + 1 },
            })
        );
      } else {
        lionConquerAttemptResult.endangeringOpponentStones.forEach((id) => {
          highlightStone({
            gameId: gameData.gameId!,
            stoneId: id,
            highlighted: true,
          });
        });
        updateGame({
          id: gameData.gameId!,
          updatedDetails: {
            status: "COMPLETED",
            winner: conqueredPlayerId,
            victoryType: "HOMEBASE_CONQUERED_FAILURE",
          },
        });
        getSingleUserStats({ userId: conqueringPlayerId! }).then(
          (serverStats) =>
            updateUserStats({
              userId: conqueringPlayerId!,
              updatedDetails: { loss: serverStats.data()?.loss + 1 },
            })
        );
        getSingleUserStats({ userId: conqueredPlayerId! }).then((serverStats) =>
          updateUserStats({
            userId: conqueredPlayerId!,
            updatedDetails: { win: serverStats.data()?.win + 1 },
          })
        );
      }

      // console.log('The stone can move here');
      // console.log('lionConquerAttemptResultSuccessful', lionConquerAttemptResult.success);
    }

    // Set turn to the other player
    // console.log(updatedMoves);
    updateGame({
      id: gameData.gameId!,
      updatedDetails: {
        currentPlayerTurn: nextTurnPlayerId({
          myId: loggedInUserUserId,
          gameData: gameData,
        }),
      },
    });
  } else {
    console.log("The stone cannot move here");
  }
};
