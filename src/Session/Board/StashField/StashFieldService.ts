import { stoneType } from "../Stones/Stone";

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
