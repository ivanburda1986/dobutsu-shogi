import { gameType, StoneInterface } from "../../api/firestore";
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

export const getStones = ({ creatorId, opponentId, type }: { creatorId: string; opponentId: string; type: gameType }): StoneInterface[] => {
  if (type === "DOBUTSU") {
    return [
      { id: uuidv4(), type: "ELEPHANT", empowered: false, originalOwner: creatorId, currentOwner: creatorId, stashed: false, positionLetter: "A", positionNumber: 4 },
      { id: uuidv4(), type: "LION", empowered: false, originalOwner: creatorId, currentOwner: creatorId, stashed: false, positionLetter: "B", positionNumber: 4 },
      { id: uuidv4(), type: "GIRAFFE", empowered: false, originalOwner: creatorId, currentOwner: creatorId, stashed: false, positionLetter: "C", positionNumber: 4 },
      { id: uuidv4(), type: "CHICKEN", empowered: false, originalOwner: creatorId, currentOwner: creatorId, stashed: false, positionLetter: "B", positionNumber: 3 },
      { id: uuidv4(), type: "ELEPHANT", empowered: false, originalOwner: opponentId, currentOwner: opponentId, stashed: false, positionLetter: "C", positionNumber: 1 },
      { id: uuidv4(), type: "LION", empowered: false, originalOwner: opponentId, currentOwner: opponentId, stashed: false, positionLetter: "B", positionNumber: 1 },
      { id: uuidv4(), type: "GIRAFFE", empowered: false, originalOwner: opponentId, currentOwner: opponentId, stashed: false, positionLetter: "A", positionNumber: 1 },
      { id: uuidv4(), type: "CHICKEN", empowered: false, originalOwner: opponentId, currentOwner: opponentId, stashed: false, positionLetter: "B", positionNumber: 2 },
    ];
  } else
    return [
      { id: uuidv4(), type: "ELEPHANT", empowered: false, originalOwner: creatorId, currentOwner: creatorId, stashed: false, positionLetter: "A", positionNumber: 4 },
      { id: uuidv4(), type: "LION", empowered: false, originalOwner: creatorId, currentOwner: creatorId, stashed: false, positionLetter: "B", positionNumber: 4 },
      { id: uuidv4(), type: "GIRAFFE", empowered: false, originalOwner: creatorId, currentOwner: creatorId, stashed: false, positionLetter: "C", positionNumber: 4 },
      { id: uuidv4(), type: "CHICKEN", empowered: false, originalOwner: creatorId, currentOwner: creatorId, stashed: false, positionLetter: "B", positionNumber: 3 },
      { id: uuidv4(), type: "ELEPHANT", empowered: false, originalOwner: opponentId, currentOwner: opponentId, stashed: false, positionLetter: "C", positionNumber: 1 },
      { id: uuidv4(), type: "LION", empowered: false, originalOwner: opponentId, currentOwner: opponentId, stashed: false, positionLetter: "B", positionNumber: 1 },
      { id: uuidv4(), type: "GIRAFFE", empowered: false, originalOwner: opponentId, currentOwner: opponentId, stashed: false, positionLetter: "A", positionNumber: 1 },
      { id: uuidv4(), type: "CHICKEN", empowered: false, originalOwner: opponentId, currentOwner: opponentId, stashed: false, positionLetter: "B", positionNumber: 2 },
    ];
};
