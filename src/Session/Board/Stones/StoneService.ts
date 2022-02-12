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
  setPositionX(Math.floor(rect!.x + 5));
  setPositionY(Math.floor(rect!.y + 5));

  let div = document.getElementById(stoneId);
  div!.style.left = positionX + "px";
  div!.style.top = positionY + "px";
};

interface rotateOponentStones {
  originalOwner: string;
  loggedInUserUserId: string;
  setRotateDegrees: (numberOfDegrees: number) => void;
}
export const rotateOponentStones = ({ originalOwner, loggedInUserUserId, setRotateDegrees }: rotateOponentStones) => {
  if (originalOwner === loggedInUserUserId) {
    return setRotateDegrees(0);
  }
  return setRotateDegrees(180);
};

export const getImgReference = (type: stoneType) => {
  if (type === "CHICKEN") return CHICKEN;
  if (type === "ELEPHANT") return ELEPHANT;
  if (type === "GIRAFFE") return GIRAFFE;
  return LION;
};
