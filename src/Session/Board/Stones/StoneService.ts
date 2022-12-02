import { chickenTurningToHenCoordinates, movementRules } from "./MovementRules";
import { StoneInterface, stoneType } from "./Stone";
import { columnLetterType } from "../../PlayerInterface/PlayerInterfaceService";
import { DocumentData } from "firebase/firestore";
import { LionConquerAttemptEvaluationOutputInterface } from "./LionStoneService";
import {
  empowerStone,
  handicapStone,
  updateStoneHighlighting,
  gameStatusType,
  updateStoneInvisibility,
} from "../../../api/firestore";
import React from "react";

interface getStashTargetPositionInterface {
  type: stoneType;
  amIOpponent: boolean;
}

export const getStashTargetPosition = ({
  type,
  amIOpponent,
}: getStashTargetPositionInterface): string => {
  if (amIOpponent) {
    return `OPPONENT-${type}`;
  }
  return `CREATOR-${type}`;
};

interface shouldChickenTurnIntoHenInterface {
  amIOpponent: boolean;
  stashed: boolean;
  type: stoneType;
  movingToLetter: string;
  movingToNumber: number;
}

export const shouldChickenTurnIntoHen = ({
  amIOpponent,
  stashed,
  type,
  movingToLetter,
  movingToNumber,
}: shouldChickenTurnIntoHenInterface) => {
  if (type !== "CHICKEN") {
    return false;
  }

  if (stashed) {
    return false;
  }

  if (
    amIOpponent &&
    chickenTurningToHenCoordinates.opponent.includes(
      `${movingToLetter}${movingToNumber}`
    )
  ) {
    return true;
  }

  return (
    !amIOpponent &&
    chickenTurningToHenCoordinates.creator.includes(
      `${movingToLetter}${movingToNumber}`
    )
  );
};

interface isItMyTurnInterface {
  myId: string;
  currentTurnPlayerId: string;
}

export const isItMyTurn = ({
  myId,
  currentTurnPlayerId,
}: isItMyTurnInterface): boolean => {
  return myId === currentTurnPlayerId;
};

interface nextTurnPlayerIdInterface {
  myId: string;
  gameData: DocumentData | undefined;
}

export const nextTurnPlayerId = ({
  myId,
  gameData,
}: nextTurnPlayerIdInterface): string => {
  if (myId === gameData?.currentPlayerTurn) {
    let nextTurnPlayerId =
      myId === gameData?.creatorId ? gameData?.opponentId : gameData?.creatorId;
    // console.log('nextTurnPlayerId', nextTurnPlayerId);
    return nextTurnPlayerId;
  }
  // console.log('nextTurnPlayerId', myId);
  return myId;
};

interface canStoneMoveThisWayInterface {
  stoneType: stoneType;
  movedFromColumnLetter: string;
  movedFromRowNumber: number;
  movingToLetter: string;
  movingToNumber: number;
  amIOpponent: boolean;
  stashed: boolean;
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
    const originatingCoordinate = `${movedFromColumnLetter}${movedFromRowNumber}`;
    const targetCoordinate = `${movingToLetter}${movingToNumber}`;
    // console.log('amIOpponent', amIOpponent);
    const allowedLetters =
      movementRules.CHICKEN[amIOpponent ? "opponent" : "creator"][
        originatingCoordinate
      ];
    // console.log(allowedLetters.includes(targetCoordinate));
    return allowedLetters.includes(targetCoordinate);
  }
  if (stoneType === "GIRAFFE") {
    if (stashed) {
      return true;
    }
    const originatingCoordinate = `${movedFromColumnLetter}${movedFromRowNumber}`;
    const targetCoordinate = `${movingToLetter}${movingToNumber}`;
    const allowedLetters = movementRules.GIRAFFE[originatingCoordinate];
    // console.log(allowedLetters.includes(targetCoordinate));
    return allowedLetters.includes(targetCoordinate);
  }
  if (stoneType === "ELEPHANT") {
    if (stashed) {
      return true;
    }
    const originatingCoordinate = `${movedFromColumnLetter}${movedFromRowNumber}`;
    const targetCoordinate = `${movingToLetter}${movingToNumber}`;
    const allowedLetters = movementRules.ELEPHANT[originatingCoordinate];
    // console.log(allowedLetters.includes(targetCoordinate));
    return allowedLetters.includes(targetCoordinate);
  }
  if (stoneType === "LION") {
    const originatingCoordinate = `${movedFromColumnLetter}${movedFromRowNumber}`;
    const targetCoordinate = `${movingToLetter}${movingToNumber}`;
    const allowedLetters = movementRules.LION[originatingCoordinate];
    // console.log(allowedLetters.includes(targetCoordinate));
    // console.log(allowedLetters.includes(targetCoordinate));
    return allowedLetters.includes(targetCoordinate);
  }
  if (stoneType === "HEN") {
    if (stashed) {
      return true;
    }
    const originatingCoordinate = `${movedFromColumnLetter}${movedFromRowNumber}`;
    const targetCoordinate = `${movingToLetter}${movingToNumber}`;
    const allowedLetters =
      movementRules.HEN[amIOpponent ? "opponent" : "creator"][
        originatingCoordinate
      ];
    // console.log(allowedLetters.includes(targetCoordinate));
    return allowedLetters.includes(targetCoordinate);
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

interface setStonePositionInterface {
  stoneId: string;
  targetPositionColumnLetter: string | columnLetterType;
  targetPositionRowNumber: number;
  positionX: number;
  setPositionX: (position: number) => void;
  positionY: number;
  setPositionY: (position: number) => void;
}

const translateHenToChickenStashPositioning = (
  targetPositionColumnLetter: columnLetterType | string
) => {
  if (targetPositionColumnLetter === "OPPONENT-HEN") {
    return "OPPONENT-CHICKEN";
  }
  if (targetPositionColumnLetter === "CREATOR-HEN") {
    return "CREATOR-CHICKEN";
  }
  return targetPositionColumnLetter;
};

export const setStonePosition = ({
  stoneId,
  targetPositionColumnLetter,
  targetPositionRowNumber,
  positionX,
  setPositionX,
  positionY,
  setPositionY,
}: setStonePositionInterface) => {
  // console.log('targetPositionColumnLetter', targetPositionColumnLetter);
  // console.log('targetPositionRowNumber', targetPositionRowNumber);
  let targetPosition = document.querySelector(
    `[data-column-letter=${translateHenToChickenStashPositioning(
      targetPositionColumnLetter
    )}][data-row-number="${targetPositionRowNumber}"]`
  );
  let stone = document.getElementById(stoneId)?.getBoundingClientRect();

  //console.log('targetPosition', targetPosition);
  let rect = targetPosition?.getBoundingClientRect();
  //console.log('rect', rect);

  setPositionX(Math.floor(rect!.left + (rect!.width - stone!.width) / 2));
  setPositionY(Math.floor(rect!.top + (rect!.height - stone!.height) / 2));
  let div = document.getElementById(stoneId);
  div!.style.left = positionX + "px";
  div!.style.top = positionY + "px";
};

interface rotateOponentStonesInterface {
  currentOwner: string;
  loggedInUserUserId: string;
  setRotateDegrees: (numberOfDegrees: number) => void;
}

export const rotateOponentStones = ({
  currentOwner,
  loggedInUserUserId,
  setRotateDegrees,
}: rotateOponentStonesInterface) => {
  if (!currentOwner || !loggedInUserUserId) {
    return setRotateDegrees(0);
  }
  if (currentOwner === loggedInUserUserId) {
    return setRotateDegrees(0);
  }
  if (currentOwner !== loggedInUserUserId) {
    return setRotateDegrees(180);
  }

  return setRotateDegrees(0);
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

export function transformChickenToHen(
  gameData: DocumentData,
  placedStoneId: string
) {
  empowerStone({
    gameId: gameData.gameId,
    stoneId: placedStoneId,
    type: "HEN",
  });
}

export function transformHenToChicken(
  gameData: DocumentData,
  lyingStoneId: string
) {
  handicapStone({
    gameId: gameData.gameId,
    stoneId: lyingStoneId,
    type: "CHICKEN",
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
  loggedInUserUserId: string
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

export function shouldHighlightStone(stone: StoneInterface[]) {
  return stone[0] && stone[0].highlighted;
}

export function shouldMakeStoneInvisible(stone: StoneInterface[]) {
  return stone[0] && stone[0].invisible;
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

export function highlightLionTakeoverStone(
  gameId: string | undefined,
  id: string
) {
  updateStoneHighlighting({ gameId: gameId!, stoneId: id, highlighted: true });
}

export function makeTakenLionInvisible(
  gameId: string | undefined,
  lyingStone: StoneInterface
) {
  updateStoneInvisibility({
    gameId: gameId!,
    stoneId: lyingStone.id,
    invisible: true,
  });
}

export function isLionGettingTaken(lyingStone: StoneInterface) {
  return lyingStone.type === "LION";
}

export function isHenGettingTaken(lyingStone: StoneInterface) {
  return lyingStone.type === "HEN";
}

export function isChickenTakingOver(draggedStone: StoneInterface) {
  return draggedStone.type === "CHICKEN";
}
