import {DocumentData} from "firebase/firestore";
import {gameType} from "../../api/firestore";


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

export const getStashSize = ({
                                 type,
                                 creatorInterface
                             }: { type: gameType; creatorInterface: boolean }): BoardInterface => {
    if (type === "DOBUTSU" && creatorInterface) {
        return {rowNumbers: [1], columnLetters: ["CREATOR-ELEPHANT", "CREATOR-GIRAFFE", "CREATOR-CHICKEN"]};
    }
    if (type === "DOBUTSU" && !creatorInterface) {
        return {rowNumbers: [1], columnLetters: ["OPPONENT-ELEPHANT", "OPPONENT-GIRAFFE", "OPPONENT-CHICKEN"]};
    } else return {rowNumbers: [1, 2], columnLetters: ["J", "K", "L", "M"]};
};

export const whatNameToDisplay = ({
                                      creatorInterface,
                                      gameData
                                  }: { creatorInterface: boolean; gameData: DocumentData | undefined }) => {
    if (creatorInterface) {
        return gameData?.creatorName;
    }
    return gameData?.opponentName;
};

export const isOnTurn = ({
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