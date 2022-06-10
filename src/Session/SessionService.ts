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
    console.log("victoryType", victoryType);
    if (winnerId === loggedInUserUserId && victoryType === "LION_CAUGHT_SUCCESS") {
        console.log('step1');
        console.log("winnerId === loggedInUserUserId", winnerId === loggedInUserUserId);
        console.log("VICTORY_LION_CAPTURE");
        return "VICTORY_LION_CAPTURE";
    }

    if (winnerId !== loggedInUserUserId && victoryType === "LION_CAUGHT_SUCCESS") {
        console.log('step2');
        console.log("winnerId === loggedInUserUserId", winnerId === loggedInUserUserId);
        console.log("LOSS_LION_CAPTURE");
        return "LOSS_LION_CAPTURE";
    }

    if (winnerId === loggedInUserUserId && victoryType === "HOMEBASE_CONQUERED_SUCCESS") {
        console.log('step3');
        console.log("winnerId === loggedInUserUserId", winnerId === loggedInUserUserId);
        console.log("VICTORY_HOME_BASE_CONQUER");
        return "VICTORY_HOME_BASE_CONQUER";
    }

    if (winnerId !== loggedInUserUserId && victoryType === "HOMEBASE_CONQUERED_SUCCESS") {
        console.log('step4');
        console.log("winnerId === loggedInUserUserId", winnerId === loggedInUserUserId);
        console.log("LOSS_HOME_BASE_CONQUER");
        return "LOSS_HOME_BASE_CONQUER";
    }
    
    if (winnerId === loggedInUserUserId && victoryType === "HOMEBASE_CONQUERED_FAILURE") {
        console.log('step5');
        console.log("winnerId === loggedInUserUserId", winnerId === loggedInUserUserId);
        console.log("LOSS_HOME_BASE_CONQUER_FAILED");
        return "LOSS_HOME_BASE_CONQUER_FAILED";
    } else {
        console.log('step6');
        console.log("winnerId === loggedInUserUserId", winnerId === loggedInUserUserId);
        console.log("VICTORY_HOME_BASE_CONQUER_FAILED");
        return "VICTORY_HOME_BASE_CONQUER_FAILED";
    }
    // if (winnerId !== loggedInUserUserId && victoryType === "HOMEBASE_CONQUERED_FAILURE")
};





