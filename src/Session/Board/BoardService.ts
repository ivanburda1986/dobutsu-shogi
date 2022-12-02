import { Dispatch, SetStateAction } from "react";
import { StoneInterface } from "./Stones/Stone";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db, VictoryType } from "../../api/firestore";

interface StonePositionChangeListenerInterface {
  updateState: Dispatch<SetStateAction<StoneInterface[]>>;
  gameId?: string;
}

export const listenToStonePositionChange = ({
  updateState,
  gameId,
}: StonePositionChangeListenerInterface) => {
  onSnapshot(collection(db, `games/${gameId}/stones`), (snapshot) => {
    let returnedStones: StoneInterface[] = [];
    snapshot.docs.forEach((doc) => {
      returnedStones.push({ ...doc.data() } as StoneInterface);
    });
    setTimeout(() => updateState(returnedStones), 100);
  });
};

interface GameStateChangeListenerInterface {
  setWinner: Dispatch<SetStateAction<string>>;
  setVictoryType: Dispatch<SetStateAction<VictoryType>>;
  gameId?: string;
}

const listenToGameStateChange = ({
  setWinner,
  setVictoryType,
  gameId,
}: GameStateChangeListenerInterface) => {
  const docRef = doc(db, "games", gameId!);
  onSnapshot(docRef, (doc) => {
    setWinner(doc.data()?.winner);
    setVictoryType(doc.data()?.victoryType);
  });
};

export const getRowNumbers = (amIOpponent: boolean): number[] => {
  const rowNumbers = [1, 2, 3, 4];
  if (amIOpponent) {
    return rowNumbers.reverse();
  }
  return rowNumbers;
};

export const getColumnLetters = (amIOpponent: boolean): string[] => {
  const columnLetters = ["A", "B", "C"];
  if (amIOpponent) {
    return columnLetters.reverse();
  }
  return columnLetters;
};
