import {
  chickenTurningToHenCoordinates,
  lionConquerFields,
  stoneMovements,
} from "./StoneMovements";
import { StoneInterface, stoneType } from "./Stone";
import { columnLetterType } from "../../PlayerInterface/PlayerInterfaceService";
import { DocumentData } from "firebase/firestore";

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
  // console.log('amIOpponent', amIOpponent);
  // console.log('stashed', stashed);
  // console.log('movingToLetter', movingToLetter);
  // console.log('movingToNumber', movingToNumber);
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

export const canStoneMoveThisWay = ({
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
      stoneMovements.CHICKEN[amIOpponent ? "opponent" : "creator"][
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
    const allowedLetters = stoneMovements.GIRAFFE[originatingCoordinate];
    // console.log(allowedLetters.includes(targetCoordinate));
    return allowedLetters.includes(targetCoordinate);
  }
  if (stoneType === "ELEPHANT") {
    if (stashed) {
      return true;
    }
    const originatingCoordinate = `${movedFromColumnLetter}${movedFromRowNumber}`;
    const targetCoordinate = `${movingToLetter}${movingToNumber}`;
    const allowedLetters = stoneMovements.ELEPHANT[originatingCoordinate];
    // console.log(allowedLetters.includes(targetCoordinate));
    return allowedLetters.includes(targetCoordinate);
  }
  if (stoneType === "LION") {
    const originatingCoordinate = `${movedFromColumnLetter}${movedFromRowNumber}`;
    const targetCoordinate = `${movingToLetter}${movingToNumber}`;
    const allowedLetters = stoneMovements.LION[originatingCoordinate];
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
      stoneMovements.HEN[amIOpponent ? "opponent" : "creator"][
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

interface useSetStonePositionInterface {
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

export const useSetStonePosition = ({
  stoneId,
  targetPositionColumnLetter,
  targetPositionRowNumber,
  positionX,
  setPositionX,
  positionY,
  setPositionY,
}: useSetStonePositionInterface) => {
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

// Lion conquer attempt evaluation
interface LionConquerAttemptEvaluationInputInterface {
  stoneData: StoneInterface;
  amIOpponent: boolean;
  movingToLetter: string;
  movingToNumber: number;
  stones: StoneInterface[];
}

export interface LionConquerAttemptEvaluationOutputInterface {
  conqueredPlayerId: string | undefined;
  conqueringPlayerId: string | undefined;
  endangeringOpponentStones: string[];
  success: boolean | undefined;
}

function isCreatorsLionConquering(
  stoneData: StoneInterface,
  amIOpponent: boolean,
  targetCoordinate: string
) {
  return (
    stoneData!.type === "LION" &&
    !amIOpponent &&
    targetCoordinate in lionConquerFields.creator
  );
}

function isOpponentsLionConquering(
  stoneData: StoneInterface,
  amIOpponent: boolean,
  targetCoordinate: string
) {
  return (
    stoneData!.type === "LION" &&
    amIOpponent &&
    targetCoordinate in lionConquerFields.opponent
  );
}

function getTheOtherPlayerStones(
  stones: StoneInterface[],
  stoneData: StoneInterface
) {
  return stones.filter(
    (stone) => stone.currentOwner !== stoneData!.currentOwner && !stone.stashed
  );
}

export const lionConquerAttemptEvaluation = ({
  stoneData,
  amIOpponent,
  movingToLetter,
  movingToNumber,
  stones,
}: LionConquerAttemptEvaluationInputInterface): LionConquerAttemptEvaluationOutputInterface => {
  const targetCoordinate = `${movingToLetter}${movingToNumber}`;

  if (isCreatorsLionConquering(stoneData, amIOpponent, targetCoordinate)) {
    let theOtherPlayerStones = getTheOtherPlayerStones(stones, stoneData);
    let nearbyOtherPlayerStones = theOtherPlayerStones.filter((stone) =>
      lionConquerFields.creator[targetCoordinate].includes(
        `${stone.positionColumnLetter}${stone.positionRowNumber}`
      )
    );
    let endangeringOtherPlayerStones = nearbyOtherPlayerStones.filter(
      (stone) => {
        if (stone.type === "CHICKEN" || stone.type === "HEN") {
          return stoneMovements[stone.type].opponent[
            `${stone.positionColumnLetter}${stone.positionRowNumber}`
          ].includes(targetCoordinate);
        } else {
          return stoneMovements[stone.type][
            `${stone.positionColumnLetter}${stone.positionRowNumber}`
          ].includes(targetCoordinate);
        }
      }
    );
    // console.log('endangeringOtherPlayerStones', endangeringOtherPlayerStones);
    return {
      success: endangeringOtherPlayerStones.length === 0,
      conqueringPlayerId: stoneData!.currentOwner,
      conqueredPlayerId: theOtherPlayerStones[0].currentOwner,
      endangeringOpponentStones: endangeringOtherPlayerStones.map(
        (stone) => stone.id
      ),
    };
  }

  if (isOpponentsLionConquering(stoneData, amIOpponent, targetCoordinate)) {
    // console.log('lion target coordinate', targetCoordinate);
    let theOtherPlayerStones = stones.filter(
      (stone) =>
        stone.currentOwner !== stoneData!.currentOwner && !stone.stashed
    );
    // console.log('theOtherPlayerStones', theOtherPlayerStones);
    // console.log('nearby fields of lion target position', lionConquerFields.opponent[targetCoordinate]);
    let nearbyOpponentStones = theOtherPlayerStones.filter((stone) =>
      lionConquerFields.opponent[targetCoordinate].includes(
        `${stone.positionColumnLetter}${stone.positionRowNumber}`
      )
    );
    // console.log('nearbyOpponentStones', nearbyOpponentStones);
    let endangeringOpponentStones = nearbyOpponentStones.filter((stone) => {
      if (stone.type === "CHICKEN" || stone.type === "HEN") {
        return stoneMovements[stone.type].creator[
          `${stone.positionColumnLetter}${stone.positionRowNumber}`
        ].includes(targetCoordinate);
      } else {
        return stoneMovements[stone.type][
          `${stone.positionColumnLetter}${stone.positionRowNumber}`
        ].includes(targetCoordinate);
      }
    });
    // console.log('endangeringOpponentStones', endangeringOpponentStones);
    return {
      success: endangeringOpponentStones.length === 0,
      conqueringPlayerId: stoneData!.currentOwner,
      conqueredPlayerId: theOtherPlayerStones[0].currentOwner,
      endangeringOpponentStones: endangeringOpponentStones.map(
        (stone) => stone.id
      ),
    };
  }

  return {
    conqueredPlayerId: undefined,
    conqueringPlayerId: undefined,
    endangeringOpponentStones: [],
    success: undefined,
  };
};
