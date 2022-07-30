import {gameType, statusType} from "../../api/firestore";
import {appContextInterface} from "../../App";

export const whichBackroundToUse = (type: gameType) => {
    if (type === "DOBUTSU") {
        return "DobutsuGreen";
    }
    if (type === "GOROGORO") {
        return "warning";
    }
    return "danger";
};

export const displayDeleteOption = ({
                                        creatorId,
                                        appContext,
                                        gameStatus
                                    }: { creatorId: string; appContext: appContextInterface, gameStatus: statusType }) => {
    if (creatorId === appContext.loggedInUserUserId && gameStatus !== "INPROGRESS") {
        return true;
    }
    return false;
};

interface shouldShowButtonInterface {
    loggedInUserUserId: string;
    creatorId: string;
    opponentId: string | null;
}

export const shouldShowAcceptButton = ({loggedInUserUserId, creatorId, opponentId}: shouldShowButtonInterface) => {
    if (opponentId === null && loggedInUserUserId !== creatorId) {
        return true;
    } else {
        return false;
    }
};

export const shouldShowGoToGameButton = ({loggedInUserUserId, creatorId, opponentId}: shouldShowButtonInterface) => {
    if (loggedInUserUserId === creatorId || loggedInUserUserId === opponentId) {
        return true;
    } else {
        return false;
    }
};
