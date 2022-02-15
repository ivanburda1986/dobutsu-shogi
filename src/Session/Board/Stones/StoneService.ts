import CHICKEN from "./images/chicken.png";
import ELEPHANT from "./images/elephant.png";
import GIRAFFE from "./images/giraffe.png";
import LION from "./images/lion.png";
import { stoneType } from "../../../api/firestore";

interface useSetStonePositionInterface {
  stoneId: string;
  targetPositionLetter: string;
  targetPositionNumber: number;
  positionX: number;
  setPositionX: (position: number) => void;
  positionY: number;
  setPositionY: (position: number) => void;
}

export const useSetStonePosition = ({ stoneId, targetPositionLetter, targetPositionNumber, positionX, setPositionX, positionY, setPositionY }: useSetStonePositionInterface) => {
  let targetPosition = document.querySelector(`[data-letter="${targetPositionLetter}"][data-number="${targetPositionNumber}"]`);
  let rect = targetPosition?.getBoundingClientRect();

  setPositionX(Math.floor(rect!.left));
  setPositionY(Math.floor(rect!.top));
  let div = document.getElementById(stoneId);
  div!.style.left = positionX + "px";
  div!.style.top = positionY + "px";
};

interface rotateOponentStonesInterface {
  currentOwner: string;
  loggedInUserUserId: string;
  setRotateDegrees: (numberOfDegrees: number) => void;
}
export const rotateOponentStones = ({ currentOwner, loggedInUserUserId, setRotateDegrees }: rotateOponentStonesInterface) => {
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

export const getImgReference = (type: stoneType) => {
  if (type === "CHICKEN") return CHICKEN;
  if (type === "ELEPHANT") return ELEPHANT;
  if (type === "GIRAFFE") return GIRAFFE;
  return LION;
};
