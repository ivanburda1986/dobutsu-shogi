import {GameFinishedMessageType} from './GameFinishedMessage/GameFinishedMessage';
import {VictoryType} from "./Board/Board";
import {DocumentData} from "firebase/firestore";
import {Dispatch} from "react";
import {useUpdateGameInterface} from "../api/firestore";

export const havePlayersJoinedGame = (gameData: DocumentData | undefined, gameId: string | undefined): boolean => {
    if (!!gameData) {
        const {creatorId, opponentId, creatorJoined, opponentJoined} = gameData!;
        return !!creatorId && !!opponentId && !!creatorJoined && !!opponentJoined && !!gameId;
    }
    return false;
};

export const isStartingPlayerDetermined = (startingPlayer: string | undefined): boolean => {
    console.log('isStartingPlayerDetermined', !!startingPlayer);
    return !!startingPlayer;
};

export const determineStartingPlayer = (gameData: DocumentData, gameId: string | undefined, updateGame: Dispatch<useUpdateGameInterface>) => {
    const {creatorId, opponentId, creatorJoined, opponentJoined, startingPlayer} = gameData;
    if (havePlayersJoinedGame(creatorJoined, opponentJoined) && !isStartingPlayerDetermined(startingPlayer)) {
        const randomNumber = Math.random();
        const whoShouldStart = randomNumber < 0.5 ? creatorId : opponentId;
        console.log('whoShouldStart', whoShouldStart);
        updateGame({
            id: gameId!,
            updatedDetails: {startingPlayer: whoShouldStart, currentPlayerTurn: whoShouldStart}
        });
    }
};

// Not refactored
interface evaluateBeingOpponentInterface {
    creatorId: string;
    loggedInUserUserId: string;
}

export const evaluateBeingOpponent = ({creatorId, loggedInUserUserId}: evaluateBeingOpponentInterface) => {
    if (!creatorId || !loggedInUserUserId) {
        return 0;
    }
    if (creatorId === loggedInUserUserId) {
        return 0;
    }
    if (creatorId !== loggedInUserUserId) {
        return 180;
    }

    return 0;
};

interface evaluateBeingWinnerInterface {
    winnerId: string;
    victoryType: VictoryType;
    loggedInUserUserId: string;
}

export const evaluateBeingWinner = ({
                                        winnerId,
                                        victoryType,
                                        loggedInUserUserId
                                    }: evaluateBeingWinnerInterface): GameFinishedMessageType => {
    // console.log("victoryType", victoryType);
    if (winnerId === loggedInUserUserId && victoryType === "LION_CAUGHT_SUCCESS") {
        // console.log('step1');
        // console.log("winnerId === loggedInUserUserId", winnerId === loggedInUserUserId);
        // console.log("VICTORY_LION_CAPTURE");
        return "VICTORY_LION_CAPTURE";
    }

    if (winnerId !== loggedInUserUserId && victoryType === "LION_CAUGHT_SUCCESS") {
        // console.log('step2');
        // console.log("winnerId === loggedInUserUserId", winnerId === loggedInUserUserId);
        // console.log("LOSS_LION_CAPTURE");
        return "LOSS_LION_CAPTURE";
    }

    if (winnerId === loggedInUserUserId && victoryType === "HOMEBASE_CONQUERED_SUCCESS") {
        // console.log('step3');
        // console.log("winnerId === loggedInUserUserId", winnerId === loggedInUserUserId);
        // console.log("VICTORY_HOME_BASE_CONQUER");
        return "VICTORY_HOME_BASE_CONQUER";
    }

    if (winnerId !== loggedInUserUserId && victoryType === "HOMEBASE_CONQUERED_SUCCESS") {
        // console.log('step4');
        // console.log("winnerId === loggedInUserUserId", winnerId === loggedInUserUserId);
        // console.log("LOSS_HOME_BASE_CONQUER");
        return "LOSS_HOME_BASE_CONQUER";
    }

    if (winnerId === loggedInUserUserId && victoryType === "HOMEBASE_CONQUERED_FAILURE") {
        // console.log('step5');
        // console.log("winnerId === loggedInUserUserId", winnerId === loggedInUserUserId);
        // console.log("VICTORY_HOME_BASE_CONQUER_FAILED");
        return "VICTORY_HOME_BASE_CONQUER_FAILED";
    } else {
        // console.log('step6');
        // console.log("winnerId === loggedInUserUserId", winnerId === loggedInUserUserId);
        // console.log("LOSS_HOME_BASE_CONQUER_FAILED");
        return "LOSS_HOME_BASE_CONQUER_FAILED";
    }
    // if (winnerId !== loggedInUserUserId && victoryType === "HOMEBASE_CONQUERED_FAILURE")
};

export function isTouchEnabled(): boolean {
    return 'ontouchstart' in window;
}




