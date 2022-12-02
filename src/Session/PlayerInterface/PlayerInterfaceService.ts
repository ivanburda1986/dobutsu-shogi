import { DocumentData } from "firebase/firestore";
import styles from "./PlayerInterface.module.css";

export type columnLetterType =
  | "A"
  | "B"
  | "C"
  | "D"
  | "CREATOR-ELEPHANT"
  | "CREATOR-GIRAFFE"
  | "CREATOR-CHICKEN"
  | "CREATOR-HEN"
  | "OPPONENT-ELEPHANT"
  | "OPPONENT-GIRAFFE"
  | "OPPONENT-CHICKEN"
  | "OPPONENT-HEN";

export const getStashColumnLetters = (
  isCreatorInterface: boolean
): columnLetterType[] => {
  if (isCreatorInterface) {
    return ["CREATOR-ELEPHANT", "CREATOR-GIRAFFE", "CREATOR-CHICKEN"];
  }
  return ["OPPONENT-ELEPHANT", "OPPONENT-GIRAFFE", "OPPONENT-CHICKEN"];
};

export const getInterfacePlayerName = (
  creatorInterface: boolean,
  gameData: DocumentData | undefined
): string => {
  if (creatorInterface) {
    return gameData?.creatorName;
  }
  return gameData?.opponentName;
};

export const isPlayersTurn = (
  creatorInterface: boolean,
  gameData: DocumentData | undefined
): boolean => {
  if (!gameData?.creatorId || !gameData?.opponentId) {
    return false;
  }
  if (creatorInterface) {
    return gameData?.currentPlayerTurn === gameData?.creatorId;
  }
  return gameData?.currentPlayerTurn === gameData?.opponentId;
};

export const getInterfaceTurnBasedBorderStyle = (
  creatorInterface: boolean,
  gameData: DocumentData | undefined
) => {
  return `${styles.PlayerInterface} ${
    isPlayersTurn(creatorInterface, gameData)
      ? styles.PlayerInterfaceCurrentTurn
      : styles.PlayerInterfaceNotOnTurn
  }`;
};

export const getInterfaceHeaderColour = (creatorInterface: boolean) => {
  return creatorInterface ? styles.CreatorHeader : styles.OpponentHeader;
};

export const getInterfaceRotation = (creatorInterface: boolean) => {
  return `rotate(${creatorInterface ? 0 : 180}deg)`;
};
export const getInterfaceAvatarImageName = (
  creatorInterface: boolean,
  gameData: DocumentData | undefined
) =>
  creatorInterface ? gameData?.creatorPhotoURL : gameData?.opponentPhotoURL;
