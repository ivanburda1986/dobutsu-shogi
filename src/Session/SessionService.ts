import {GameFinishedMessageType} from './GameFinishedMessage/GameFinishedMessage';
import {VictoryType} from "./Board/Board";
import {DocumentData} from "firebase/firestore";
import {Dispatch} from "react";
import {useUpdateGameInterface} from "../api/firestore";

export const isGameDataAvailable = (gameData: DocumentData | undefined, gameId: string | undefined): boolean => {
    if (!!gameData) {
        const {creatorId, opponentId, creatorJoined, opponentJoined} = gameData!;
        return !!creatorId && !!opponentId && !!creatorJoined && !!opponentJoined && !!gameId;
    }
    return false;
};

export const isStartingPlayerDetermined = (startingPlayer: string | undefined): boolean => {
    return !!startingPlayer;
};

export const haveBothPlayersJoined = (creatorId: string | undefined, opponentId: string | undefined): boolean => {
    return !!creatorId && !!opponentId;
};

export const determineStartingPlayer = (gameData: DocumentData, gameId: string | undefined, updateGame: Dispatch<useUpdateGameInterface>) => {
    const {creatorId, opponentId, startingPlayer} = gameData;
    if (haveBothPlayersJoined(creatorId, opponentId) && !isStartingPlayerDetermined(startingPlayer)) {
        const randomNumber = Math.random();
        const whoShouldStart = randomNumber < 0.5 ? creatorId : opponentId;
        updateGame({
            id: gameId!,
            updatedDetails: {startingPlayer: whoShouldStart, currentPlayerTurn: whoShouldStart}
        });
    }
};

interface PlayerMoveHashInput {
    id: string;
    type: string;
    fromCoordinates: string;
    targetCoordinates: string;
}

interface BothPlayerHashInput {
    player1: PlayerMoveHashInput;
    player2: PlayerMoveHashInput;
}

const shouldSaveLatestRoundMovementHash = (moveRepresentations: string[], latestRoundMoveHash: string | undefined): boolean => {
    return !!latestRoundMoveHash && moveRepresentations[moveRepresentations.length - 1] !== latestRoundMoveHash;
};

const isMoveHashRelatedToStash = (moveHash: string): boolean => {
    return moveHash.length > 12;
};

const createLatestRoundMoveHash = (hashInput: BothPlayerHashInput): string | undefined => {
    const {player1, player2} = hashInput;
    const latestRoundMoveHash = (player1.id.charAt(0) + player1.type.charAt(0) + player1.fromCoordinates + player1.targetCoordinates + player2.id.charAt(0) + player2.type.charAt(0) + player2.fromCoordinates + player2.targetCoordinates).toLowerCase();
    if (isMoveHashRelatedToStash(latestRoundMoveHash)) {
        return;
    } else return latestRoundMoveHash;
};
const areSufficientMoveRecordsAvailable = (gameData: DocumentData | undefined): boolean => {
    return !!(gameData && gameData.moves.length >= 2 && gameData.moves.length % 2 === 0);
};
export const createAndStoreLastRoundMoveHash = (gameId: string | undefined, gameData: DocumentData | undefined, updateGame: Dispatch<useUpdateGameInterface>) => {
    if (!isGameDataAvailable(gameData, gameId)) {
        return;
    }

    if (!areSufficientMoveRecordsAvailable(gameData)) {
        return;
    }

    const recordedMoves = gameData!.moves;
    const numberOfRecordedMoves = gameData!.moves.length;
    const player1LatestMove = recordedMoves[numberOfRecordedMoves - 1];
    const player2LatestMove = recordedMoves[numberOfRecordedMoves - 2];
    const latestRoundMoveHash = createLatestRoundMoveHash({player1: player1LatestMove, player2: player2LatestMove});

    const moveRepresentations = gameData?.moveRepresentations;
    if (shouldSaveLatestRoundMovementHash(moveRepresentations, latestRoundMoveHash)) {
        let updatedMoveRepresentations = [...moveRepresentations, latestRoundMoveHash];
        updateGame({
            id: gameId!,
            updatedDetails: {moveRepresentations: updatedMoveRepresentations}
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


