import {ReturnedGameInterface} from "./WaitingGamesList/WaitingGamesList";


export const filterPlayerRelevantGames = (games: ReturnedGameInterface[], loggedInPlayerId: string): ReturnedGameInterface[] => {
    return games
        .filter((game) => {
            if (game.status === "WAITING") {
                return true;
            }
            if (game.status === "COMPLETED" && (game.creatorId === loggedInPlayerId || game.opponentId === loggedInPlayerId)) {
                return true;
            }
            if (game.status === "TIE" && (game.creatorId === loggedInPlayerId || game.opponentId === loggedInPlayerId)) {
                return true;
            }
            if (game.status === "INPROGRESS" && (game.creatorId === loggedInPlayerId || game.opponentId === loggedInPlayerId)) {
                if (game.creatorId === loggedInPlayerId || game.opponentId === loggedInPlayerId) {
                    return true;
                }
                return false;
            }
            return false;
        });
};

const filterWaitingGames = (games: ReturnedGameInterface[], loggedInPlayerId: string): ReturnedGameInterface[] => {
    return games.filter((game) => game.status === "WAITING");
};

const filterPlayerRelevantCompletedGames = (games: ReturnedGameInterface[], loggedInPlayerId: string): ReturnedGameInterface[] => {
    return games.filter((game) => game.status === "COMPLETED" && (game.creatorId === loggedInPlayerId || game.opponentId === loggedInPlayerId));
};

const filterPlayerRelevantTiedGames = (games: ReturnedGameInterface[], loggedInPlayerId: string): ReturnedGameInterface[] => {
    return games.filter((game) => game.status === "TIE" && (game.creatorId === loggedInPlayerId || game.opponentId === loggedInPlayerId));
};

const filterPlayerRelevantInProgressGames = (games: ReturnedGameInterface[], loggedInPlayerId: string): ReturnedGameInterface[] => {
    return games.filter((game) => {
        if (game.status === "INPROGRESS" && (game.creatorId === loggedInPlayerId || game.opponentId === loggedInPlayerId)) {
            return true;
        }
        return false;
    });
};


export const shouldShowPanda = (games: ReturnedGameInterface[], loggedInUserUserId: string): boolean => {
    const someWaitingGames = games.filter((game) => game.status === "WAITING");
    const someOwnInProgressGames = games.filter((game) => game.status === "INPROGRESS").filter((inProgressGame) => inProgressGame.creatorId === loggedInUserUserId || inProgressGame.opponentId === loggedInUserUserId);
    const someOwnCompletedGames = games.filter((game) => game.status === "COMPLETED").filter((someOwnCompletedGames) => someOwnCompletedGames.creatorId === loggedInUserUserId || someOwnCompletedGames.opponentId === loggedInUserUserId);
    return !((someWaitingGames.length > 0) || (someOwnInProgressGames.length > 0) || (someOwnCompletedGames.length > 0));
};
