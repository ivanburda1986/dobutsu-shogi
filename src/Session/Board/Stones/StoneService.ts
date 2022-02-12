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
  setPositionX(Math.floor(rect!.x + 8));
  setPositionY(Math.floor(rect!.y + 8));

  let div = document.getElementById(stoneId);
  div!.style.left = positionX + "px";
  div!.style.top = positionY + "px";
};
