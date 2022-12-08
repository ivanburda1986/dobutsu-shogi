import { gameStatusType } from "../../api/firestore";
import { ReturnedGameInterface } from "./Game";

export const isLoggedInPlayerTurn = (
  loggedInUserUserId: string,
  currentPlayerTurn: string | undefined,
  gameStatus: gameStatusType
) => {
  return (
    loggedInUserUserId === currentPlayerTurn &&
    gameStatus !== "COMPLETED" &&
    gameStatus !== "TIE"
  );
};

export const shouldDisplayGameDeleteOption = ({
  creatorId,
  loggedInUserUserId,
  gameStatus,
}: {
  creatorId: string;
  loggedInUserUserId: string;
  gameStatus: gameStatusType;
}) => {
  return creatorId === loggedInUserUserId && gameStatus !== "INPROGRESS";
};

interface shouldDisplayOptionInterface {
  loggedInUserUserId: string;
  creatorId: string;
  opponentId: string | null;
}

export const shouldDisplayAcceptGameOption = ({
  loggedInUserUserId,
  creatorId,
  opponentId,
}: shouldDisplayOptionInterface) => {
  if (opponentId === null && loggedInUserUserId !== creatorId) {
    return true;
  } else {
    return false;
  }
};

export const shouldDisplayGoToGameOption = ({
  loggedInUserUserId,
  creatorId,
  opponentId,
}: shouldDisplayOptionInterface) => {
  if (loggedInUserUserId === creatorId || loggedInUserUserId === opponentId) {
    return true;
  } else {
    return false;
  }
};

export const getWinnerName = (gameData: ReturnedGameInterface) => {
  if (gameData.winner === gameData.opponentId) {
    return gameData.opponentName;
  } else {
    return gameData.creatorName;
  }
};
