import { gameType } from "../../api/firestore";
import { v4 as uuidv4 } from "uuid";

interface BoardInterface {
  rowNumbers: number[];
  columnLetters: string[];
}
export const getBoardSize = ({ type }: { type: gameType }): BoardInterface => {
  if (type === "DOBUTSU") {
    return { rowNumbers: [1, 2, 3, 4], columnLetters: ["A", "B", "C"] };
  } else return { rowNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9], columnLetters: ["A", "B", "C", "D", "E", "F", "G", "H", "I"] };
};
