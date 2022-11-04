import {DocumentData} from "firebase/firestore";


export type columnLetterType =
    "A"
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
    | "OPPONENT-HEN"

interface BoardInterface {
    rowNumbers: number[];
    columnLetters: string[];
}

export const getStashSize = (creatorInterface: boolean): BoardInterface => {
    if (creatorInterface) {
        return {rowNumbers: [1], columnLetters: ["CREATOR-ELEPHANT", "CREATOR-GIRAFFE", "CREATOR-CHICKEN"]};
    }
    return {rowNumbers: [1], columnLetters: ["OPPONENT-ELEPHANT", "OPPONENT-GIRAFFE", "OPPONENT-CHICKEN"]};
};
//test
export const whatNameToDisplay = ({
                                      creatorInterface,
                                      gameData
                                  }: { creatorInterface: boolean; gameData: DocumentData | undefined }) => {
    if (creatorInterface) {
        return gameData?.creatorName;
    }
    return gameData?.opponentName;
};

export const isPlayersTurn = ({
                             creatorInterface,
                             gameData
                         }: { creatorInterface: boolean; gameData: DocumentData | undefined }) => {
    if (!gameData?.creatorId || !gameData?.opponentId) {
        return false;
    }
    if (creatorInterface) {
        return gameData?.currentPlayerTurn === gameData?.creatorId ? true : false;
    }
    return gameData?.currentPlayerTurn === gameData?.opponentId ? true : false;

};