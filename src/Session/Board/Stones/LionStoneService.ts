import { StoneInterface } from "./Stone";
import { lionConquerFields, movementRules } from "./MovementRules";
import {
  updateStoneHighlighting,
  updateStoneInvisibility,
} from "../../../api/firestore";

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

function getNearbyOpponentStones(
  opponentStones: StoneInterface[],
  targetCoordinate: string
) {
  return opponentStones.filter((stone) =>
    lionConquerFields.creator[targetCoordinate].includes(
      `${stone.positionColumnLetter}${stone.positionRowNumber}`
    )
  );
}

function getEndangeringOpponentStones(
  nearbyOpponentStones: StoneInterface[],
  targetCoordinate: string
) {
  return nearbyOpponentStones.filter((stone) => {
    if (stone.type === "CHICKEN" || stone.type === "HEN") {
      return movementRules[stone.type].opponent[
        `${stone.positionColumnLetter}${stone.positionRowNumber}`
      ].includes(targetCoordinate);
    } else {
      return movementRules[stone.type][
        `${stone.positionColumnLetter}${stone.positionRowNumber}`
      ].includes(targetCoordinate);
    }
  });
}

function getNearbyCreatorStones(
  creatorStones: StoneInterface[],
  targetCoordinate: string
) {
  return creatorStones.filter((stone) =>
    lionConquerFields.opponent[targetCoordinate].includes(
      `${stone.positionColumnLetter}${stone.positionRowNumber}`
    )
  );
}

function getEndangeringCreatorStones(
  nearbyCreatorStones: StoneInterface[],
  targetCoordinate: string
) {
  return nearbyCreatorStones.filter((stone) => {
    if (stone.type === "CHICKEN" || stone.type === "HEN") {
      return movementRules[stone.type].creator[
        `${stone.positionColumnLetter}${stone.positionRowNumber}`
      ].includes(targetCoordinate);
    } else {
      return movementRules[stone.type][
        `${stone.positionColumnLetter}${stone.positionRowNumber}`
      ].includes(targetCoordinate);
    }
  });
}

function getLionConqueringResult(
  endangeringOpponentStones: StoneInterface[],
  stoneData: StoneInterface,
  opponentStones: StoneInterface[]
) {
  return {
    success: endangeringOpponentStones.length === 0,
    conqueringPlayerId: stoneData!.currentOwner,
    conqueredPlayerId: opponentStones[0].currentOwner,
    endangeringOpponentStones: endangeringOpponentStones.map(
      (stone) => stone.id
    ),
  };
}

interface LionConquerAttemptEvaluationInputInterface {
  amIOpponent: boolean;
  movingToLetter: string;
  movingToNumber: number;
  stoneData: StoneInterface;
  stones: StoneInterface[];
}

export interface LionConquerAttemptEvaluationOutputInterface {
  conqueredPlayerId: string | undefined;
  conqueringPlayerId: string | undefined;
  endangeringOpponentStones: string[];
  success: boolean | undefined;
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
    let opponentStones = getTheOtherPlayerStones(stones, stoneData);
    let nearbyOpponentStones = getNearbyOpponentStones(
      opponentStones,
      targetCoordinate
    );
    let endangeringOpponentStones = getEndangeringOpponentStones(
      nearbyOpponentStones,
      targetCoordinate
    );
    return getLionConqueringResult(
      endangeringOpponentStones,
      stoneData,
      opponentStones
    );
  }

  if (isOpponentsLionConquering(stoneData, amIOpponent, targetCoordinate)) {
    let creatorStones = getTheOtherPlayerStones(stones, stoneData);
    let nearbyCreatorStones = getNearbyCreatorStones(
      creatorStones,
      targetCoordinate
    );
    let endangeringCreatorStones = getEndangeringCreatorStones(
      nearbyCreatorStones,
      targetCoordinate
    );
    return getLionConqueringResult(
      endangeringCreatorStones,
      stoneData,
      creatorStones
    );
  }

  return {
    conqueredPlayerId: undefined,
    conqueringPlayerId: undefined,
    endangeringOpponentStones: [],
    success: undefined,
  };
};

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
