import {hasCompletedGames, hasInProgressGames, hasWaitingGames, shouldShowPanda} from "../LaunchScreenService";
import {ReturnedGameInterface} from "../Game/Game";

describe('LaunchScreenService', () => {
    describe('shouldShowPanda', () => {
        it('returns false when games are not loaded', () => {
            const gamesLoaded = false;
            const allGamesCount = 0;

            const showPanda = shouldShowPanda(gamesLoaded, allGamesCount);

            expect(showPanda).toBe(false);
        });

        it('returns false when games are loaded and at least 1 game is available', () => {
            const gamesLoaded = true;
            const allGamesCount = 1;

            const showPanda = shouldShowPanda(gamesLoaded, allGamesCount);

            expect(showPanda).toBe(false);
        });

        it('returns true when games are loaded and no game is available', () => {
            const gamesLoaded = true;
            const allGamesCount = 0;

            const showPanda = shouldShowPanda(gamesLoaded, allGamesCount);

            expect(showPanda).toBe(true);
        });
    });

    describe('hasWaitingGames', () => {
        it('returns false when no waiting game is available', () => {
            const waitingGames = [] as unknown as ReturnedGameInterface[];

            expect(hasWaitingGames(waitingGames)).toBe(false);
        });

        it('returns true when at least 1 waiting game is available', () => {
            const waitingGames = [
                {
                    id: 'game1',
                }] as unknown as ReturnedGameInterface[];

            expect(hasWaitingGames(waitingGames)).toBe(true);
        });
    });

    describe('hasInProgressGames', () => {
        it('returns false when no in-progress game is available', () => {
            const inProgressCreatorGames = [] as unknown as ReturnedGameInterface[];
            const inProgressOpponentGames = [] as unknown as ReturnedGameInterface[];

            expect(hasInProgressGames(inProgressCreatorGames, inProgressOpponentGames)).toBe(false);
        });

        it('returns true when at least 1 in-progress game is available', () => {
            const inProgressCreatorGames = [{
                id: 'game1',
            }] as unknown as ReturnedGameInterface[];
            const inProgressOpponentGames = [] as unknown as ReturnedGameInterface[];

            expect(hasInProgressGames(inProgressCreatorGames, inProgressOpponentGames)).toBe(true);
        });
    });


    describe('hasCompletedGames', () => {
        it('returns false when no completed game is available', () => {
            const completedCreatorGames = [] as unknown as ReturnedGameInterface[];
            const completedOpponentGames = [] as unknown as ReturnedGameInterface[];
            const tieCreatorGames = [] as unknown as ReturnedGameInterface[];
            const tieOpponentGames = [] as unknown as ReturnedGameInterface[];

            expect(hasCompletedGames(completedCreatorGames, completedOpponentGames, tieCreatorGames, tieOpponentGames)).toBe(false);
        });

        it('returns true when at least 1 completed game is available', () => {
            const completedCreatorGames = [] as unknown as ReturnedGameInterface[];
            const completedOpponentGames = [{
                id: 'game1',
            }] as unknown as ReturnedGameInterface[];
            const tieCreatorGames = [] as unknown as ReturnedGameInterface[];
            const tieOpponentGames = [] as unknown as ReturnedGameInterface[];

            expect(hasCompletedGames(completedCreatorGames, completedOpponentGames, tieCreatorGames, tieOpponentGames)).toBe(true);
        });
    });
});