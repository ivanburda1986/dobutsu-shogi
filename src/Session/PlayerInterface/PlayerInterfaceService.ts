import { gameType, playerType } from "../../api/firestore";

interface BoardInterface {
  rowNumbers: number[];
  columnLetters: string[];
}
export const getStashSize = ({ type, playerType }: { type: gameType; playerType: playerType }): BoardInterface => {
  if (type === "DOBUTSU" && playerType === "CREATOR") {
    return { rowNumbers: [1], columnLetters: ["J", "K", "L"] };
  }
  if (type === "DOBUTSU" && playerType === "OPPONENT") {
    return { rowNumbers: [1], columnLetters: ["M", "N", "O"] };
  } else return { rowNumbers: [1, 2], columnLetters: ["J", "K", "L", "M"] };
};
