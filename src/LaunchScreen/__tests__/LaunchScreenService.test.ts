import {shouldShowPanda} from "../LaunchScreenService";
import {ReturnedGameInterface} from "../Game/Game";

describe('LaunchScreenService', () => {
    describe('shouldShowPanda', () => {
        it('returns false when some waiting games are available', () => {
            const games = [{id: 'game1', creatorId: '123', status: "WAITING"}] as unknown as ReturnedGameInterface[];
            const loggedInUserId = '456';

            const showPanda = shouldShowPanda(games, loggedInUserId);

            expect(showPanda).toBe(false);
        });

        it('returns false when player has created games which are in progress', () => {
            const games = [
                {id: 'game1', creatorId: '123', status: "INPROGRESS"},
            ] as unknown as ReturnedGameInterface[];
            const loggedInUserId = '123';

            const showPanda = shouldShowPanda(games, loggedInUserId);

            expect(showPanda).toBe(false);
        });

        it('returns false when player has joined games which are in progress', () => {
            const games = [
                {
                    id: 'game2',
                    creatorId: '456',
                    opponentId: '123',
                    status: "INPROGRESS"
                }] as unknown as ReturnedGameInterface[];
            const loggedInUserId = '123';

            const showPanda = shouldShowPanda(games, loggedInUserId);

            expect(showPanda).toBe(false);
        });

        it('returns false when player has any finished games which he has created', () => {
            const games = [{id: 'game1', creatorId: '123', status: "COMPLETED"}] as unknown as ReturnedGameInterface[];
            const loggedInUserId = '123';

            const showPanda = shouldShowPanda(games, loggedInUserId);

            expect(showPanda).toBe(false);
        });

        it('returns false when player has any finished games which she has joined', () => {
            const games = [{
                id: 'game2',
                creatorId: '456',
                opponentId: '123',
                status: "COMPLETED"
            }] as unknown as ReturnedGameInterface[];
            const loggedInUserId = '123';

            const showPanda = shouldShowPanda(games, loggedInUserId);

            expect(showPanda).toBe(false);
        });

        it('returns true when no waiting games are available and player has no in-progress and no finished games', () => {
            const games = [{
                id: 'game4',
                creatorId: '123',
                opponentId: '456',
                status: "INPROGRESS"
            }, {
                id: 'game5',
                creatorId: '123',
                opponentId: '456',
                status: "COMPLETED"
            }] as unknown as ReturnedGameInterface[];
            const loggedInUserId = '789';

            const showPanda = shouldShowPanda(games, loggedInUserId);

            expect(showPanda).toBe(true);
        });
    });
});