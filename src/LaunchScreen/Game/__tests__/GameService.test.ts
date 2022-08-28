import {
    isLoggedInPlayerTurn,
    shouldDisplayAcceptGameOption,
    shouldDisplayGameDeleteOption,
    shouldDisplayGoToGameOption
} from "../GameService";

describe('GameService', () => {
    describe('isLoggedInPlayerTurn', () => {
        it('returns false when game is completed', () => {
            const loggedInUserUserId = '123';
            const currentPlayerTurn = '123';
            const gameStatus = 'COMPLETED';

            const shouldTurnEvaluation = isLoggedInPlayerTurn(loggedInUserUserId, currentPlayerTurn, gameStatus);

            expect(shouldTurnEvaluation).toBe(false);
        });

        it('returns false when game state is a tie', () => {
            const loggedInUserUserId = '123';
            const currentPlayerTurn = '123';
            const gameStatus = 'TIE';

            const shouldTurnEvaluation = isLoggedInPlayerTurn(loggedInUserUserId, currentPlayerTurn, gameStatus);

            expect(shouldTurnEvaluation).toBe(false);
        });

        it('returns false when logged-in player is not allowed to turn', () => {
            const loggedInUserUserId = '123';
            const currentPlayerTurn = '456';
            const gameStatus = 'INPROGRESS';

            const shouldTurnEvaluation = isLoggedInPlayerTurn(loggedInUserUserId, currentPlayerTurn, gameStatus);

            expect(shouldTurnEvaluation).toBe(false);
        });

        it('returns true when logged-in player is allowed to turn', () => {
            const loggedInUserUserId = '123';
            const currentPlayerTurn = '123';
            const gameStatus = 'INPROGRESS';

            const shouldTurnEvaluation = isLoggedInPlayerTurn(loggedInUserUserId, currentPlayerTurn, gameStatus);

            expect(shouldTurnEvaluation).toBe(true);
        });
    });

    describe('shouldDisplayGameDeleteOption', () => {
        it('returns false when game is in progress', () => {
            const creatorId = '123';
            const loggedInUserUserId = '123';
            const gameStatus = 'INPROGRESS';

            const shouldDisplayGameDeleteOptionEvaluation = shouldDisplayGameDeleteOption({
                creatorId,
                loggedInUserUserId,
                gameStatus
            });

            expect(shouldDisplayGameDeleteOptionEvaluation).toBe(false);
        });

        it('returns false when game is not in progress and player did not create the game', () => {
            const creatorId = '123';
            const loggedInUserUserId = '456';
            const gameStatus = 'WAITING';

            const shouldDisplayGameDeleteOptionEvaluation = shouldDisplayGameDeleteOption({
                creatorId,
                loggedInUserUserId,
                gameStatus
            });

            expect(shouldDisplayGameDeleteOptionEvaluation).toBe(false);
        });

        it('returns true when game is not in progress and player created the game', () => {
            const creatorId = '123';
            const loggedInUserUserId = '123';
            const gameStatus = 'COMPLETED';

            const shouldDisplayGameDeleteOptionEvaluation = shouldDisplayGameDeleteOption({
                creatorId,
                loggedInUserUserId,
                gameStatus
            });

            expect(shouldDisplayGameDeleteOptionEvaluation).toBe(true);
        });
    });

    describe('shouldDisplayAcceptGameOption', () => {
        it('returns false when the game has an opponent already', () => {
            const loggedInUserUserId = '456';
            const creatorId = '123';
            const opponentId = '456';

            const shouldDisplayAcceptGameOptionEvaluation = shouldDisplayAcceptGameOption({
                loggedInUserUserId,
                creatorId,
                opponentId
            });

            expect(shouldDisplayAcceptGameOptionEvaluation).toBe(false);
        });

        it('returns false when the game has not opponent yet but player created the game', () => {
            const loggedInUserUserId = '123';
            const creatorId = '123';
            const opponentId = null;

            const shouldDisplayAcceptGameOptionEvaluation = shouldDisplayAcceptGameOption({
                loggedInUserUserId,
                creatorId,
                opponentId
            });

            expect(shouldDisplayAcceptGameOptionEvaluation).toBe(false);
        });

        it('returns true when the game has not opponent yet and player did not create the game', () => {
            const loggedInUserUserId = '456';
            const creatorId = '123';
            const opponentId = null;

            const shouldDisplayAcceptGameOptionEvaluation = shouldDisplayAcceptGameOption({
                loggedInUserUserId,
                creatorId,
                opponentId
            });

            expect(shouldDisplayAcceptGameOptionEvaluation).toBe(true);
        });
    });

    describe('shouldDisplayGoToGameOption', () => {
        it('returns false when player is neither creator nor opponent', () => {
            const loggedInUserUserId = '789';
            const creatorId = '123';
            const opponentId = '456';

            const shouldDisplayGoToGameOptionEvaluation = shouldDisplayGoToGameOption({
                loggedInUserUserId,
                creatorId,
                opponentId
            });

            expect(shouldDisplayGoToGameOptionEvaluation).toBe(false);
        });

        it('returns true when player is creator', () => {
            const loggedInUserUserId = '123';
            const creatorId = '123';
            const opponentId = '456';

            const shouldDisplayGoToGameOptionEvaluation = shouldDisplayGoToGameOption({
                loggedInUserUserId,
                creatorId,
                opponentId
            });

            expect(shouldDisplayGoToGameOptionEvaluation).toBe(true);
        });

        it('returns true when player is opponent', () => {
            const loggedInUserUserId = '456';
            const creatorId = '123';
            const opponentId = '456';

            const shouldDisplayGoToGameOptionEvaluation = shouldDisplayGoToGameOption({
                loggedInUserUserId,
                creatorId,
                opponentId
            });

            expect(shouldDisplayGoToGameOptionEvaluation).toBe(true);
        });
    });
});