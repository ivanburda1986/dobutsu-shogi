import { movementRules } from "./MovementRules";
import { StoneInterface, stoneType } from "./Stone";
import { DocumentData } from "firebase/firestore";
import { LionConquerAttemptEvaluationOutputInterface } from "./LionStoneService";
import {
  gameStatusType,
  updateStoneHighlighting,
} from "../../../api/firestore";
import React from "react";
import { isItMyTurn } from "../../SessionService";

interface canStoneMoveThisWayInterface {
  stoneType: stoneType;
  movedFromColumnLetter: string;
  movedFromRowNumber: number;
  movingToLetter: string;
  movingToNumber: number;
  amIOpponent: boolean;
  stashed: boolean;
}

function getAllowedLetters(
  stoneType: stoneType,
  originatingCoordinate: string,
  amIOpponent: boolean
) {
  if (stoneType === "CHICKEN" || stoneType === "HEN") {
    return movementRules[stoneType][amIOpponent ? "opponent" : "creator"][
      originatingCoordinate
    ];
  }

  return movementRules[stoneType][originatingCoordinate];
}

function canStoneMoveInThisDirection(
  movedFromColumnLetter: string,
  movedFromRowNumber: number,
  movingToLetter: string,
  movingToNumber: number,
  stoneType: stoneType,
  amIOpponent: boolean
) {
  const originatingCoordinate = `${movedFromColumnLetter}${movedFromRowNumber}`;
  const targetCoordinate = `${movingToLetter}${movingToNumber}`;
  const allowedLetters = getAllowedLetters(
    stoneType,
    originatingCoordinate,
    amIOpponent
  );
  return allowedLetters.includes(targetCoordinate);
}

export const canDraggedStoneMoveToThisPosition = ({
  stoneType,
  movedFromColumnLetter,
  movedFromRowNumber,
  movingToLetter,
  movingToNumber,
  amIOpponent,
  stashed,
}: canStoneMoveThisWayInterface) => {
  if (stoneType === "CHICKEN") {
    if (stashed) {
      return true;
    }
    return canStoneMoveInThisDirection(
      movedFromColumnLetter,
      movedFromRowNumber,
      movingToLetter,
      movingToNumber,
      stoneType,
      amIOpponent
    );
  }
  if (stoneType === "GIRAFFE") {
    if (stashed) {
      return true;
    }
    return canStoneMoveInThisDirection(
      movedFromColumnLetter,
      movedFromRowNumber,
      movingToLetter,
      movingToNumber,
      stoneType,
      amIOpponent
    );
  }
  if (stoneType === "ELEPHANT") {
    if (stashed) {
      return true;
    }
    return canStoneMoveInThisDirection(
      movedFromColumnLetter,
      movedFromRowNumber,
      movingToLetter,
      movingToNumber,
      stoneType,
      amIOpponent
    );
  }
  if (stoneType === "LION") {
    const result = canStoneMoveInThisDirection(
      movedFromColumnLetter,
      movedFromRowNumber,
      movingToLetter,
      movingToNumber,
      stoneType,
      amIOpponent
    );
    return result;
  }
  if (stoneType === "HEN") {
    if (stashed) {
      return true;
    }
    return canStoneMoveInThisDirection(
      movedFromColumnLetter,
      movedFromRowNumber,
      movingToLetter,
      movingToNumber,
      stoneType,
      amIOpponent
    );
  }
  return false;
};

interface amIStoneOwnerInterface {
  currentOwner: string;
  loggedInUserUserId: string;
}

export const amIStoneOwner = ({
  currentOwner,
  loggedInUserUserId,
}: amIStoneOwnerInterface) => {
  return currentOwner === loggedInUserUserId;
};

interface rotateOpponentStonesInterface {
  currentOwner: string;
  loggedInUserUserId: string;
  amIOpponent: boolean | undefined;
  stashed: boolean;
}

export const rotateOpponentStones = ({
  currentOwner,
  loggedInUserUserId,
  amIOpponent,
  stashed,
}: rotateOpponentStonesInterface) => {
  if (!currentOwner || !loggedInUserUserId) {
    return 0;
  }
  if (currentOwner === loggedInUserUserId) {
    if (amIOpponent) {
      if (stashed) {
        return 0;
      }
      return 180;
    }

    return 0;
  }
  if (currentOwner !== loggedInUserUserId) {
    if (amIOpponent) {
      return 0;
    }
    if (stashed) {
      return 0;
    }
    return 180;
  }

  return 0;
};

interface getStashedStonePillCountInterface {
  allStones: StoneInterface[];
  currentOwnerId?: string;
  type: stoneType;
  stashed: boolean;
}

export const getStashedStonePillCount = ({
  allStones,
  currentOwnerId,
  type,
  stashed,
}: getStashedStonePillCountInterface): number => {
  if (!currentOwnerId || !stashed) {
    return 0;
  }
  const stashedStones = allStones.filter((stone) => stone.stashed);
  const playerStashedCountOfTheStone = stashedStones
    .filter((stone) => stone.currentOwner === currentOwnerId)
    .filter((stashedStone) => stashedStone.type === type);
  return playerStashedCountOfTheStone.length;
};

export function highlightStonesThatDefendedAttackedBase(
  lionConquerAttemptResult: LionConquerAttemptEvaluationOutputInterface,
  gameData: DocumentData
) {
  lionConquerAttemptResult.endangeringOpponentStones.forEach((id) => {
    updateStoneHighlighting({
      gameId: gameData.gameId!,
      stoneId: id,
      highlighted: true,
    });
  });
}

export function shouldShowStoneStashCountPill(
  allStones: StoneInterface[],
  currentOwner: string,
  stashed: boolean,
  type: stoneType,
  hideStoneStashCountPill: boolean
) {
  return (
    getStashedStonePillCount({
      allStones: allStones,
      currentOwnerId: currentOwner,
      stashed: stashed,
      type: type,
    }) > 1 && !hideStoneStashCountPill
  );
}

export function canStoneBeDragged(
  status: gameStatusType,
  currentOwner: string,
  loggedInUserUserId: string,
  stoneId: string
) {
  return (
    status === "INPROGRESS" &&
    amIStoneOwner({
      currentOwner: currentOwner,
      loggedInUserUserId: loggedInUserUserId,
    })
  );
}

export function getDragStartAction(
  loggedInUserUserId: string,
  currentPlayerTurn: string,
  onDragStartHandler: (event: React.DragEvent<HTMLDivElement>) => void,
  onDragStartHandlerDisallowed: (event: React.DragEvent<HTMLDivElement>) => void
) {
  if (
    isItMyTurn({
      myId: loggedInUserUserId,
      currentTurnPlayerId: currentPlayerTurn,
    })
  ) {
    return onDragStartHandler;
  } else {
    return onDragStartHandlerDisallowed;
  }
}

export function getStone(allStones: StoneInterface[], id: string) {
  return allStones.filter((stone) => stone.id === id);
}

export function isDraggedStoneStillAboveItself(
  lyingStone: StoneInterface,
  draggedStone: StoneInterface
) {
  return lyingStone.id === draggedStone.id;
}

export function isDraggedStoneComingFromStash(draggedStone: StoneInterface) {
  return draggedStone.stashed;
}

export function isDraggedStoneHoveringAboveOwnStone(
  lyingStone: StoneInterface,
  draggedStone: StoneInterface
) {
  return lyingStone.currentOwner === draggedStone.currentOwner;
}
