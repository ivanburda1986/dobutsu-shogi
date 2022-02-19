import { DocumentData } from "firebase/firestore";
import { gameType } from "../../api/firestore";

interface BoardInterface {
  rowNumbers: number[];
  columnLetters: string[];
}
export const getStashSize = ({ type, creatorInterface }: { type: gameType; creatorInterface: boolean }): BoardInterface => {
  if (type === "DOBUTSU" && creatorInterface === true) {
    return { rowNumbers: [1], columnLetters: ["J", "K", "L"] };
  }
  if (type === "DOBUTSU" && creatorInterface !== true) {
    return { rowNumbers: [1], columnLetters: ["M", "N", "O"] };
  } else return { rowNumbers: [1, 2], columnLetters: ["J", "K", "L", "M"] };
};

export const whatNameToDisplay = ({ creatorInterface, gameData }: { creatorInterface: boolean; gameData: DocumentData | undefined }) => {
  if (creatorInterface) {
    return gameData?.creatorName;
  }
  return gameData?.opponentName;
};
