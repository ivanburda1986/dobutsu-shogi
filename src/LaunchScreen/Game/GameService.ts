import {statusType} from "../../api/firestore";

export const isLoggedInPlayerTurn = (loggedInUserUserId: string, currentPlayerTurn: string | undefined, gameStatus: statusType) => {
    return loggedInUserUserId === currentPlayerTurn && gameStatus !== 'COMPLETED' && gameStatus !== 'TIE';
};

export const shouldDisplayGameDeleteOption = ({
                                                  creatorId,
                                                  loggedInUserUserId,
                                                  gameStatus
                                              }: { creatorId: string; loggedInUserUserId: string, gameStatus: statusType }) => {
    return creatorId === loggedInUserUserId && gameStatus !== 'INPROGRESS';

};

interface shouldDisplayOptionInterface {
    loggedInUserUserId: string;
    creatorId: string;
    opponentId: string | null;
}

export const shouldDisplayAcceptGameOption = ({
                                                  loggedInUserUserId,
                                                  creatorId,
                                                  opponentId
                                              }: shouldDisplayOptionInterface) => {
    if (opponentId === null && loggedInUserUserId !== creatorId) {
        return true;
    } else {
        return false;
    }
};

export const shouldDisplayGoToGameOption = ({
                                                loggedInUserUserId,
                                                creatorId,
                                                opponentId
                                            }: shouldDisplayOptionInterface) => {
    if (loggedInUserUserId === creatorId || loggedInUserUserId === opponentId) {
        return true;
    } else {
        return false;
    }
};
