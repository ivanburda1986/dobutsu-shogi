import { useState } from "react";

interface useSetStonePositionInterface {
  stoneId: string;
  targetPositionLetter: string;
  targetPositionNumber: number;
}

export const useSetStonePosition = ({ stoneId, targetPositionLetter, targetPositionNumber }: useSetStonePositionInterface) => {
  const [positionX, setPositionX] = useState<number>();
  const [positionY, setPositionY] = useState<number>();

  let targetPosition = document.querySelector(`[data-letter="${targetPositionLetter}"][data-number="${targetPositionNumber}"]`);
  let rect = targetPosition?.getBoundingClientRect();
  setPositionX(Math.floor(rect!.x + 8));
  setPositionY(Math.floor(rect!.y + 8));

  let div = document.getElementById(stoneId);
  div!.style.left = positionX + "px";
  div!.style.top = positionY + "px";
};
