import { gameType } from "../../api/firestore";

interface BoardInterface {
  rowNumbers: number[];
  columnLetters: string[];
}
export const getStashSize = ({ type }: { type: gameType }): BoardInterface => {
  if (type === "DOBUTSU") {
    return { rowNumbers: [1], columnLetters: ["J", "K", "L"] };
  } else return { rowNumbers: [1, 2], columnLetters: ["J", "K", "L", "M"] };
};
