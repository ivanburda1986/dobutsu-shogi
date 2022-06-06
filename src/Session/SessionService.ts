import {GameFinishedMessageType} from '../Session/GameFinishedMessage/GameFinishedMessage';

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
    loggedInUserUserId: string;
}

export const evaluateBeingWinner = ({
                                        winnerId,
                                        loggedInUserUserId
                                    }: evaluateBeingWinnerInterface): GameFinishedMessageType => {
    if (winnerId === loggedInUserUserId) {
        return "VICTORY";
    } else {
        return "LOSS";
    }
};
