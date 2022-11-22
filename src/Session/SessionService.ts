import {VictoryType} from "./Board/Board";
import {DocumentData} from "firebase/firestore";
import {Dispatch} from "react";
import {getSingleUserStats, updateGame, updateUserStats, useUpdateGameInterface} from "../api/firestore";
import {GameFinishedMessageType} from "./GameFinishedMessage/GameFinishedMessageService";


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

export const determineStartingPlayer =  (gameData: DocumentData | undefined, gameId: string | undefined, updateGame: Dispatch<useUpdateGameInterface>) => {
    if (!gameData) {
        return;
    }
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

export const createAndStoreLastRoundMoveHash = (gameData: DocumentData | undefined, gameId: string | undefined, updateGame: Dispatch<useUpdateGameInterface>) => {
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
    if (!gameData?.moveRepresentations) {
        return false;
    }
    const moveRepresentations = gameData?.moveRepresentations;
    const isMinimumCountOfMovementsAvailableForTieToOccur = moveRepresentations.length >= 6;

    if (!isMinimumCountOfMovementsAvailableForTieToOccur) {
        return false;
    }

    const lastRound = moveRepresentations[moveRepresentations.length - 1];
    const lastMinusThreeRound = moveRepresentations[moveRepresentations.length - 3];
    const lastMinusFiveRound = moveRepresentations[moveRepresentations.length - 5];

    return lastRound === lastMinusThreeRound && lastMinusThreeRound === lastMinusFiveRound;
};

export const isThisPlayerOpponent = (creatorId: string, loggedInUserUserId: string) => {
    if (!creatorId || !loggedInUserUserId) {
        return false;
    }
    if (creatorId === loggedInUserUserId) {
        return false;
    }
    return creatorId !== loggedInUserUserId;
};

// Not covered by tests - struggling with mocking the getSingleUserStats()
export const increaseTieStatsCountForBothPlayers = (player1Id: string, player2Id: string): void => {
    [player1Id, player2Id].forEach((playerId) => {
        getSingleUserStats({userId: playerId}).then((serverStats) => {
            console.log(serverStats);
            updateUserStats({
                userId: playerId,
                updatedDetails: {tie: serverStats.data()?.tie + 1}
            });
        });
    });
};

// Not covered by tests - struggling with mocking the Date.now() value
export function updateGameToBeTie(gameId: string | undefined): void {
    if (!gameId) {
        return;
    }

    updateGame({
        id: gameId,
        updatedDetails: {
            status: "TIE",
            finishedTimeStamp: Date.now(),
        }
    });
}

export const getPlayerFinishedGameState = (
    winnerId: string,
    victoryType: VictoryType,
    loggedInUserUserId: string
): GameFinishedMessageType => {

    if (winnerId === loggedInUserUserId && victoryType === "LION_CAUGHT_SUCCESS") {
        return "VICTORY_LION_CAPTURE";
    }

    if (winnerId !== loggedInUserUserId && victoryType === "LION_CAUGHT_SUCCESS") {
        return "LOSS_LION_CAPTURE";
    }

    if (winnerId === loggedInUserUserId && victoryType === "HOMEBASE_CONQUERED_SUCCESS") {
        return "VICTORY_HOME_BASE_CONQUER";
    }

    if (winnerId !== loggedInUserUserId && victoryType === "HOMEBASE_CONQUERED_SUCCESS") {
        return "LOSS_HOME_BASE_CONQUER";
    }

    if (winnerId === loggedInUserUserId && victoryType === "HOMEBASE_CONQUERED_FAILURE") {
        return "VICTORY_HOME_BASE_CONQUER_FAILED";
    } else {
        return "LOSS_HOME_BASE_CONQUER_FAILED";
    }
};

// Unused
export function isTouchEnabled(): boolean {
    return 'ontouchstart' in window;
}


