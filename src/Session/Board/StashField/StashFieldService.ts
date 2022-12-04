import { stoneType } from "../Stones/Stone";
import { columnLetterType } from "../../PlayerInterface/PlayerInterfaceService";

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

export const translateHenToChickenStashPositioning = (
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
