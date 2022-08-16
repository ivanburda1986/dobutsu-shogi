import {ReturnedGameInterface} from "./WaitingGamesList/WaitingGamesList";

export const shouldShowPanda = (games: ReturnedGameInterface[], loggedInUserUserId: string): boolean => {
    const someWaitingGames = games.filter((game) => game.status === "WAITING");
    const someOwnInProgressGames = games.filter((game) => game.status === "INPROGRESS").filter((inProgressGame) => inProgressGame.creatorId === loggedInUserUserId || inProgressGame.opponentId === loggedInUserUserId);
    const someOwnCompletedGames = games.filter((game) => game.status === "COMPLETED").filter((someOwnCompletedGames) => someOwnCompletedGames.creatorId === loggedInUserUserId || someOwnCompletedGames.opponentId === loggedInUserUserId);
    return !((someWaitingGames.length > 0) || (someOwnInProgressGames.length > 0) || (someOwnCompletedGames.length > 0));
};