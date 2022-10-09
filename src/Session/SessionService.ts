import {GameFinishedMessageType} from './GameFinishedMessage/GameFinishedMessage';
import {VictoryType} from "./Board/Board";
import {DocumentData} from "firebase/firestore";
import {Dispatch, SetStateAction} from "react";
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
    movingPlayerId: string;
    type: string;
    fromCoordinates: string;
    targetCoordinates: string;
}

interface BothPlayerHashInput {
    player1: PlayerMoveHashInput;
    player2: PlayerMoveHashInput;
}

export const shouldSaveLatestRoundMovementHash = (moveRepresentations: string[], latestRoundMoveHash: string | undefined): boolean => {
    return !!latestRoundMoveHash && moveRepresentations[moveRepresentations.length - 1] !== latestRoundMoveHash;
};

export const isMoveHashRelatedToStash = (moveHash: string): boolean => {
    return moveHash.length > 12;
};

export const createLatestRoundMoveHash = (hashInput: BothPlayerHashInput): string | undefined => {
    const {player1, player2} = hashInput;
    const latestRoundMoveHash = (player1.movingPlayerId.charAt(0) + player1.type.charAt(0) + player1.fromCoordinates + player1.targetCoordinates + player2.movingPlayerId.charAt(0) + player2.type.charAt(0) + player2.fromCoordinates + player2.targetCoordinates).toLowerCase();
    if (isMoveHashRelatedToStash(latestRoundMoveHash)) {
        return;
    } else return latestRoundMoveHash;
};

export const areSufficientMoveRecordsAvailable = (gameData: DocumentData | undefined): boolean => {
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
    const player2LatestMove = recordedMoves[numberOfRecordedMoves - 1];
    const player1LatestMove = recordedMoves[numberOfRecordedMoves - 2];
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

//A tie occurs if both players repeat the same row of moves 3 times
/*  Player's move   Round hash          Position in array
    1)              1-gc4c3--p-ga1a2    - length-6;
    2)              1-gc3c4--p-ga2a1    - length-5;
    3)              1-gc4c3--p-ga1a2    - length-4;
    4)              1-gc3c4--p-ga2a1    - length-3;
    5)              1-gc4c3--p-ga1a2    - length-2;
    6)              1-gc3c4--p-ga2a1    - length-1;

    Identical hashes:
    1, 3, 5 -> both players have repeated 3 movements
    2, 4, 6 -> both players have repeated 3 movements
 */
export const isTieEvaluation = (gameData: DocumentData | undefined): boolean => {
    const moveRepresentations = gameData!.moveRepresentations;
    const isMinimumCountOfMovementsAvailableForTieToOccur = moveRepresentations.length >= 6;

    if (!isMinimumCountOfMovementsAvailableForTieToOccur) {
        return false;
    }

    const lastRound = moveRepresentations[moveRepresentations.length - 1];
    const lastMinusThreeRound = moveRepresentations[moveRepresentations.length - 3];
    const lastMinusFiveRound = moveRepresentations[moveRepresentations.length - 5];

    return lastRound === lastMinusThreeRound && lastMinusThreeRound === lastMinusFiveRound;
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


