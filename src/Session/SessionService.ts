import {GameFinishedMessageType} from '../Session/GameFinishedMessage/GameFinishedMessage';
import {VictoryType} from "./Board/Board";

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
    if (winnerId === loggedInUserUserId && victoryType === "LION_CAUGHT_SUCCESS") {
        return "VICTORY_LION_CAPTURE";
    }
    if (winnerId === loggedInUserUserId && victoryType === "HOMEBASE_CONQUERED_SUCCESS") {
        return "VICTORY_HOME_BASE_CONQUER";
    }
    if (winnerId === loggedInUserUserId && victoryType === "HOMEBASE_CONQUERED_FAILURE") {
        return "VICTORY_HOME_BASE_CONQUER_FAILED";
    }
    if (winnerId !== loggedInUserUserId && victoryType === "HOMEBASE_CONQUERED_FAILURE") {
        return "LOSS_HOME_BASE_CONQUER_FAILED";
    } else {
        return "LOSS_LION_CAPTURE";
    }
    // (winnerId !== loggedInUserUserId && victoryType === "LION_CAUGHT_SUCCESS")

};
